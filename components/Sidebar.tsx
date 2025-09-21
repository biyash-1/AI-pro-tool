// components/Sidebar.tsx
"use client";

import { FC } from "react";
import Link from "next/link";

const Sidebar: FC = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-cyan-800 to-blue-900 flex-shrink-0 h-screen text-white">
      <div className="p-6 text-xl font-bold border-b border-blue-700">
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          AI Pro Tool
        </span>
      </div>
      <nav className="flex flex-col mt-6 p-4 space-y-3">
        <Link href="#" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>📊</span> Dashboard
        </Link>
        <Link href="#" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🤖</span> AI Tools
        </Link>
        <Link href="/textsummarizer" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>📝</span> Text Summarizer
        </Link>
        <Link href="/textgenerator" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🖼️</span> Text generator
        </Link>

          <Link href="/qna" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🖼️</span> Q&A assitant
        </Link>
        
          <Link href="/lt" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🖼️</span> language translator
        </Link>

         <Link href="/imagegen" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🖼️</span> Image generator
        </Link>
              <Link href="/aicode" className="p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2">
          <span>🖼️</span> Ai code translator
       </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;