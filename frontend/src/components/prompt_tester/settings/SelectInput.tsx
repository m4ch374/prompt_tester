"use client"

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import promptContext from "../PromptContext"
import Down from "@/icons/Down"
import { TChatModel } from "@/services/types"
import { AnimatePresence, motion } from "framer-motion"

const SelectInput: React.FC = () => {
  const [model, setModel] = useContext(promptContext).modelController

  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleBtnClick = useCallback(
    (val: TChatModel) => {
      setModel(val)
      setOpen(false)
    },
    [setModel],
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick)
  }, [open])

  return (
    <div className="mb-6">
      <h1>Model</h1>
      <div className="relative z-10 w-full" ref={containerRef}>
        <button
          type="button"
          className="my-2 flex w-full justify-between rounded-md border border-zinc-600 bg-transparent p-1.5"
          onClick={() => setOpen(s => !s)}
        >
          <h1 className="text-nowrap">{model}</h1>
          <Down />
        </button>

        {/* hard code this, using a list is overkill */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 top-12 flex w-full flex-col rounded-md border border-zinc-600 bg-black"
            >
              <button
                type="button"
                className="w-full p-2 text-start"
                onClick={() => handleBtnClick("gemma-7b-it")}
              >
                gemma-7b-it
              </button>
              <hr className="h-px w-[90%] place-self-center border-0 bg-zinc-800" />
              <button
                type="button"
                className="w-full p-2 text-start"
                onClick={() => handleBtnClick("llama3-70b-8192")}
              >
                llama3-70b-8192
              </button>
              <hr className="h-px w-[90%] place-self-center border-0 bg-zinc-800" />
              <button
                type="button"
                className="w-full p-2 text-start"
                onClick={() => handleBtnClick("llama3-8b-8192")}
              >
                llama3-8b-8192
              </button>
              <hr className="h-px w-[90%] place-self-center border-0 bg-zinc-800" />
              <button
                type="button"
                className="w-full p-2 text-start"
                onClick={() => handleBtnClick("mixtral-8x7b-32768")}
              >
                mixtral-8x7b-32768
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SelectInput
