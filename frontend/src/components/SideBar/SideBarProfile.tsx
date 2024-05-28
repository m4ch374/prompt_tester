"use client"

import React from "react"

const SideBarProfile: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <button className="mb-6 flex w-[90%] gap-4 rounded-md border border-zinc-600 p-2 transition-colors hover:border-zinc-400">
      <div className="flex w-full animate-pulse items-center justify-center gap-2">
        <div className="size-6 rounded-full bg-slate-700" />
        {!collapsed && (
          <div className="h-3 w-full flex-1 rounded-full bg-slate-700" />
        )}
      </div>
    </button>
  )
}

export default SideBarProfile
