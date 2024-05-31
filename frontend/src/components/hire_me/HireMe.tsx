import React, { useCallback, useEffect, useRef } from "react"
import ExpertiseCard from "./ExpertieseCard"
import Code from "@/icons/Code"
import Adjust from "@/icons/Adjust"
import Cube from "@/icons/Cube"
import Rocket from "@/icons/Rocket"
import Logout from "@/icons/Logout"

const BreakPoint: React.FC = () => {
  return (
    <h3 className="font-mono">
      {"<"}
      <span className="text-red-400">br</span>
      {" />"}
    </h3>
  )
}

const HireMe: React.FC = () => {
  const selfRef = useRef<HTMLDivElement>(null!)

  const mouseOver = useCallback((e: MouseEvent) => {
    const section = selfRef.current
    for (const box of section.getElementsByClassName("card")) {
      const bound = box.getBoundingClientRect()

      const x = e.clientX - bound.left
      const y = e.clientY - bound.top

      const node = box as HTMLElement

      node.style.setProperty("--mouse-x", `${x}px`)
      node.style.setProperty("--mouse-y", `${y}px`)
    }
  }, [])

  useEffect(() => {
    const sectionRef = selfRef.current
    sectionRef.addEventListener("mousemove", mouseOver)

    return () => sectionRef.removeEventListener("mousemove", mouseOver)
  }, [mouseOver])

  return (
    <section className="mx-auto mb-8 mt-4 flex w-[90%] max-w-[1100px] flex-col items-center rounded-lg">
      <div ref={selfRef} id="cards" className="flex w-full flex-wrap gap-2">
        <ExpertiseCard
          title="High Standards"
          icon={<Code />}
          innerGlowColor="#f87171"
          titleClassName="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent"
        >
          <>
            All components except for the banner above was made by me.{" "}
            <BreakPoint /> Giving all my efforts in styling the frontend and
            also structuring the backend.
          </>
        </ExpertiseCard>
        <ExpertiseCard
          title="Fast Learner"
          icon={<Adjust />}
          innerGlowColor="#059669"
          titleClassName="bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 bg-clip-text text-transparent"
        >
          <>
            This project has me play with some new frameworks (last time I used
            Nextjs is v12).
            <BreakPoint />I am able to quickly learn these framework at a quick
            pace and code up something.
          </>
        </ExpertiseCard>
        <ExpertiseCard
          title="Relevant Experience"
          icon={<Cube />}
          innerGlowColor="#7c3aed"
          titleClassName="bg-gradient-to-r from-purple-400 to-yellow-400 bg-clip-text text-transparent"
        >
          <>
            Worked in a tech startup, understands the culture and the pace of
            early startups.
            <BreakPoint />
            Handled AWS services such as cognito and S3 for authentication and
            content delivery.
          </>
        </ExpertiseCard>
        <ExpertiseCard
          title="Naturally Curious"
          icon={<Logout />}
          innerGlowColor="#fb923c"
          titleClassName="bg-gradient-to-r from-red-400 via-gray-300 to-blue-500 bg-clip-text text-transparent"
        >
          Always curious and try to find better ways of improving things.
          Especially in terms of code.
        </ExpertiseCard>
        <ExpertiseCard
          title="Hard Working"
          icon={<Rocket />}
          innerGlowColor="#f472b6"
          titleClassName="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent"
        >
          Motivated, and Hard Working. Always stayed up late to finish work.
        </ExpertiseCard>
      </div>
    </section>
  )
}

export default HireMe
