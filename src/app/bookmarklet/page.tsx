import type { Metadata } from "next";
import { BookmarkletContent } from "./client";

export const metadata: Metadata = { title: "书签小工具", description: "一键提交工具到创客集" };

export default function BookmarkletPage() {
  return <BookmarkletContent />;
}
