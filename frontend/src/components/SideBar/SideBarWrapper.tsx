"use client"

import Rocket from "@/icons/Rocket"
import React, { useState } from "react"
import SideBarBtn from "./SideBarBtn"
import Code from "@/icons/Code"
import Adjust from "@/icons/Adjust"
import Film from "@/icons/Film"
import Bars3 from "@/icons/Bars3"
import SideBarProfile from "./SideBarProfile"
import hoverContext from "../HoverContext"
import useHoverClick from "@/utils/hooks/UseHoverClick.hook"

const BTN_DATA = [
  {
    icon: <Code />,
    link: "/prompt_tester",
    title: "Prompt Tester",
  },
  {
    icon: <Adjust />,
    link: "/dashboard",
    title: "Dashboard",
  },
  {
    icon: <Film />,
    link: "/campaign",
    title: "Campaign",
  },
]

const SideBarWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false)
  const hovers = useHoverClick(BTN_DATA.map(x => x.link))

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
            <hoverContext.Provider value={hovers}>
              {BTN_DATA.map(x => (
                <SideBarBtn
                  key={x.link}
                  icon={x.icon}
                  link={x.link}
                  title={x.title}
                  collapsed={collapsed}
                />
              ))}
            </hoverContext.Provider>
          </div>
        </div>
        <SideBarProfile collapsed={collapsed} />
      </nav>
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default SideBarWrapper
