"use client"

import Rocket from "@/icons/Rocket"
import React, { useState } from "react"
import SideBarBtn from "./SideBarBtn"
import Code from "@/icons/Code"
import Adjust from "@/icons/Adjust"
import Film from "@/icons/Film"
import Bars3 from "@/icons/Bars3"
import SideBarProfile from "./SideBarProfile"

const SideBarWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full">
      <nav
        className={`flex h-full flex-col items-center justify-between border-r border-zinc-800 bg-zinc-900 transition-all duration-500 ease-out ${collapsed ? "w-[50px]" : "w-[200px]"}`}
      >
        <div
          className={`flex size-full flex-col ${collapsed && "items-center"}`}
        >
          <button
            className={`mt-2 rounded-md p-2 hover:bg-zinc-700 ${collapsed ? "place-self-center" : "ml-2 place-self-start"}`}
            onClick={() => setCollapsed(s => !s)}
          >
            <Bars3 />
          </button>
          <div className="flex items-center justify-center gap-2 py-8">
            <Rocket className="size-6" />
            {!collapsed && (
              <h1 className="text-nowrap text-lg font-thin">Prompt Tester</h1>
            )}
          </div>
          <hr className="mb-8 h-px w-4/5 place-self-center border-0 bg-gray-400/20" />
          <div className="grid px-2">
            <SideBarBtn
              icon={<Code />}
              link="/prompt_tester"
              title="Prompt Tester"
              collapsed={collapsed}
            />
            <SideBarBtn
              icon={<Adjust />}
              link="/dashboard"
              title="Dashboard"
              collapsed={collapsed}
            />
            <SideBarBtn
              icon={<Film />}
              link="/campaign"
              title="Campaign"
              collapsed={collapsed}
            />
          </div>
        </div>
        <SideBarProfile collapsed={collapsed} />
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SideBarWrapper
