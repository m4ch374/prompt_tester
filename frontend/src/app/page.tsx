"use client"

import { AuroraBackground } from "@/components/AuroraBackground"
import Divider from "@/components/Divider"
import HireMe from "@/components/hire_me/HireMe"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Home() {
  return (
    <main>
      <AuroraBackground className="text-white">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 1 } }}
            className="text-[5rem] font-thin tracking-tighter"
          >
            Prompt <span className="text-purple-300">Tester</span>
          </motion.h1>
          <motion.h3
            className="text-xl font-thin"
            initial={{ opacity: 0, y: 40 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, delay: 0.5 },
            }}
          >
            An Epic Groq AI <span className="line-through">Copy</span>{" "}
            Implementation{" "}
          </motion.h3>
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 1, delay: 1 },
            }}
          >
            <Link
              href={"/auth"}
              className="rounded-full bg-white px-4 py-2 text-black"
            >
              Get started
            </Link>
          </motion.div>
        </div>
        <Divider />
      </AuroraBackground>
      <div className="relative bg-[#111] p-5 py-20">
        <h3 className="text-xl font-thin">
          Here is why{" "}
          <span className="font-semibold text-purple-300 underline underline-offset-4">
            you
          </span>{" "}
          should hire me
        </h3>
        <HireMe />
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-thin">
            Convinced Yet? Let&apos;s get started
          </h1>
          <Link
            href={"/auth"}
            className="rounded-full bg-zinc-200 px-4 py-2 text-black"
          >
            Get started
          </Link>
        </div>
      </div>
    </main>
  )
}
