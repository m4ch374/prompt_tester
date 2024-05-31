"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from "react"

const RangeInput: React.FC<{
  title: string
  numberController: [number, Dispatch<SetStateAction<number>>]
  minNum: number
  maxNum: number
  stepNum: number
}> = ({ numberController, title, minNum, maxNum, stepNum }) => {
  const [val, setVal] = numberController
  const [inputVal, setInputVal] = useState(val.toString())

  useEffect(() => {
    setInputVal(val.toString())
  }, [val])

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mt-4 block text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </h1>
        <input
          type="text"
          className="w-20 rounded-md border border-zinc-600 bg-transparent px-2 text-end outline-none focus:border-zinc-400"
          value={inputVal}
          onChange={e => {
            setInputVal(e.target.value)
          }}
          onBlur={e => {
            const parsed = parseFloat(e.target.value)
            const evall = isNaN(parsed) ? val : parsed
            const actual = Math.min(Math.max(evall, minNum), maxNum)
            setVal(actual)
          }}
        />
      </div>
      <input
        type="range"
        min={minNum}
        max={maxNum}
        step={stepNum}
        value={val}
        onChange={e => {
          const parsed = parseFloat(e.currentTarget.value)
          setVal(parsed)
        }}
        className="mb-6 h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-700"
      />
    </>
  )
}

export default RangeInput
