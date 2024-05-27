import SideBarWrapper from "@/components/SideBar/SideBarWrapper"
import React from "react"

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <SideBarWrapper>{children}</SideBarWrapper>
}

export default ProtectedLayout
