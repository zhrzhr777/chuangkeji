"use client";

import { useEffect, useState } from "react";

export function BookmarkletContent() {
  const [origin, setOrigin] = useState("http://localhost:3000");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const bookmarkletCode = `javascript:(function(){window.open('${origin}/submit?url='+encodeURIComponent(location.href)+'&title='+encodeURIComponent(document.title),'_blank')})()`;

  return (
    <div className="container max-w-2xl py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">书签小工具</h1>
      <p className="text-muted-foreground mb-8">
        把下面的按钮拖到你的浏览器书签栏，以后在任何网页点一下就能快速提交工具到创客集。
      </p>

      <a
        href={bookmarkletCode}
        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl transition-shadow select-none"
        onClick={(e) => {
          e.preventDefault();
          alert("请把按钮拖到书签栏，而不是直接点击。\n\n拖过去后，在任意网页点击书签即可提交工具。");
        }}
      >
        + 提交到创客集
      </a>

      <p className="text-xs text-muted-foreground mt-4">拖到书签栏</p>

      <div className="mt-12 bg-muted/50 rounded-lg p-6 text-left">
        <h2 className="font-bold mb-3">使用方法</h2>
        <ol className="space-y-2 text-sm text-muted-foreground list-decimal pl-4">
          <li>把上面蓝色按钮 <strong>拖到浏览器书签栏</strong>（不是点击）</li>
          <li>浏览网页时，发现好工具，<strong>点击书签栏里的按钮</strong></li>
          <li>自动跳转到创客集提交页，<strong>网址和标题已自动填好</strong></li>
          <li>补充分类和描述，点提交即可</li>
        </ol>
      </div>

      <div className="mt-8 p-4 rounded-lg border text-sm text-muted-foreground text-left">
        <p className="font-medium mb-1">如果拖拽不生效，手动创建书签：</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>浏览器添加新书签</li>
          <li>名称设为「提交到创客集」</li>
          <li>URL 粘贴以下代码：</li>
        </ol>
        <pre className="mt-2 bg-muted p-3 rounded text-xs overflow-x-auto whitespace-pre-wrap break-all">{bookmarkletCode}</pre>
      </div>
    </div>
  );
}
