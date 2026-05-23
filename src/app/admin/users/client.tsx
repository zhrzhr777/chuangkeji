"use client";

import { useEffect, useState } from "react";
import { Shield, Coins, User, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

export function AdminUsersPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pointAmounts, setPointAmounts] = useState<Record<string, number>>({});
  const { user } = useAuth();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (id === user?.id && newRole === "user") {
      toast({ variant: "destructive", title: "不能取消自己的管理员权限" });
      return;
    }
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    if (error) toast({ variant: "destructive", title: "操作失败", description: error.message });
    else { toast({ title: `角色已更新为 ${newRole}` }); loadUsers(); }
  }

  async function grantPoints(profileId: string) {
    const amount = pointAmounts[profileId] || 0;
    if (amount === 0) return;
    const { error } = await supabase.from("transactions").insert({
      user_id: profileId,
      amount,
      type: "admin_grant",
      description: "管理员发放积分",
    });
    if (error) toast({ variant: "destructive", title: "发放失败", description: error.message });
    else { toast({ title: `已发放 ${amount} 积分` }); loadUsers(); }
  }

  if (loading) return <p className="text-muted-foreground">加载中...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <p className="text-muted-foreground">共 {profiles.length} 个用户</p>
      </div>
      <div className="space-y-3">
        {profiles.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex items-center justify-between py-4 flex-wrap gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{p.username}</span>
                  {p.role === "admin" && <Badge><Shield className="h-3 w-3 mr-1" />管理员</Badge>}
                  {p.vip_level !== "free" && <Badge className="bg-amber-100 text-amber-700"><Crown className="h-3 w-3 mr-1" />{p.vip_level}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  <Coins className="h-3 w-3 inline mr-1" />{p.points} 积分 · 加入于 {formatDate(p.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="积分"
                  className="w-20 h-8 text-sm"
                  value={pointAmounts[p.id] || ""}
                  onChange={(e) => setPointAmounts(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                />
                <Button size="sm" variant="outline" onClick={() => grantPoints(p.id)}>
                  <Coins className="h-3 w-3 mr-1" />发放
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleRole(p.id, p.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {p.role === "admin" ? "降级" : "升为管理员"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
