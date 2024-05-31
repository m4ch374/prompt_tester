"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { ClassNameValue, twMerge } from "tailwind-merge"

type TExpertiseCard = {
  children?: string | JSX.Element | JSX.Element[]
  title: string
  icon?: JSX.Element
  innerGlowColor?: string
  titleClassName?: ClassNameValue
}

const ExpertiseCard: React.FC<TExpertiseCard> = ({
  children,
  title,
  icon,
  innerGlowColor = "#ffffff",
  titleClassName = "",
}) => {
  const selfRef = useRef<HTMLDivElement>(null!)

  const hexToRgb = useCallback((s: string, opacity: number) => {
    const sliced = s.slice(1)

    const rgb = sliced.match(/.{1,2}/g)!
    return `rgba(${parseInt(rgb[0], 16)}, ${parseInt(rgb[1], 16)}, ${parseInt(
      rgb[2],
      16,
    )}, ${opacity})`
  }, [])

  useEffect(() => {
    const div = selfRef.current

    div.style.setProperty("--inner-glow", hexToRgb(innerGlowColor, 0.1))
  }, [hexToRgb, innerGlowColor])

  return (
    // I am a css god
    <div
      ref={selfRef}
      className="
        card
        relative
        min-h-[160px]
        min-w-[300px]
        flex-1
        rounded-md
        bg-stone-400/20
        before:absolute
        before:left-0
        before:top-0
        before:z-30
        before:size-full
        before:rounded-[inherit]
        before:opacity-0
        before:transition-opacity
        before:duration-500
        after:absolute
        after:left-0
        after:top-0
        after:z-10
        after:size-full
        after:rounded-[inherit]
        after:opacity-0
        after:transition-opacity
        after:duration-500
        before:hover:opacity-100
      "
    >
      <div className="relative z-20 m-px size-[calc(100%-2px)] rounded-[inherit] bg-[#111] p-4">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          {icon}
          <h1 className={twMerge("font-mono", titleClassName)}>{title}</h1>
        </div>
        <div className="mt-4 font-mono text-zinc-400">
          <h3>
            {"<"}
            <span className="text-red-400">p</span>
            {">"}
          </h3>
          <div className="border-l border-zinc-600 px-4">{children}</div>
          <h3>
            {"</"}
            <span className="text-red-400">p</span>
            {">"}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default ExpertiseCard
