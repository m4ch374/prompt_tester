"use client"

import { getProfile } from "@/services/profile.services"
import { deleteCookie, getCookie } from "@/utils/actions/cookies.action"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import Image from "next/image"
import Logout from "@/icons/Logout"
import { AnimatePresence, motion } from "framer-motion"

type TProfile = {
  name: string
  img_link: string
}

const SideBarProfile: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const router = useRouter()
  const [profile, setProfile] = useState<TProfile>()
  const [visible, setVisible] = useState(false)
  const logoutRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    ;(async () => {
      const token = await (getCookie("auth_key") as unknown as Promise<string>)
      const resp = await getProfile(token)

      if (!resp.ok) {
        toast.error(resp.error)
        router.push("/")
        return
      }

      setProfile({
        img_link: resp.data.profile_link,
        name: resp.data.first_name + " " + resp.data.last_name,
      })
    })()
  }, [router])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        logoutRef.current &&
        !logoutRef.current.contains(e.target as Node) &&
        visible
      ) {
        setVisible(false)
      }
    }

    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick)
  }, [visible])

  return (
    <div className="relative mb-6 w-[90%]">
      <AnimatePresence>
        {visible && (
          <motion.button
            className="absolute inset-x-0 -top-14 flex w-full gap-2 rounded-md border border-red-500 p-2 text-red-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => {
              deleteCookie("auth_key")
              router.push("/")
            }}
            ref={logoutRef}
          >
            <Logout />
            {!collapsed && <h1 className="flex-1">Logout</h1>}
          </motion.button>
        )}
      </AnimatePresence>

      <button
        className="flex w-full gap-4 rounded-md border border-zinc-600 p-2 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-100"
        onClick={() => setVisible(true)}
      >
        <div
          className={`flex w-full items-center justify-center gap-2 ${!profile && "animate-pulse"}`}
        >
          {profile ? (
            <Image
              alt="profile pic"
              src={profile.img_link}
              width={24}
              height={24}
              className="size-6 rounded-full"
            />
          ) : (
            <div className="size-6 rounded-full bg-slate-700" />
          )}
          {!collapsed && (
            <div
              className={`flex-1 ${!profile && "h-3 w-full rounded-full bg-slate-700"}`}
            >
              {profile?.name}
            </div>
          )}
        </div>
      </button>
    </div>
  )
}

export default SideBarProfile
