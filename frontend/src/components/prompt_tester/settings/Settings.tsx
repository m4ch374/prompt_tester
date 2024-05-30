"use client"

import React, { useContext, useState } from "react"
import Tooltip from "./Tooltip"
import RangeInput from "./RangeInput"
import promptContext from "../PromptContext"
import SelectInput from "./SelectInput"

const Settings: React.FC = () => {
  const {
    temperatureController,
    maxTokenController,
    topPController,
    seedController,
  } = useContext(promptContext)

  const [seed, setSeed] = seedController
  const [localSeed, setLocalSeed] = useState(seed?.toString() || "")

  return (
    <div className="mx-4">
      <h1 className="my-2 text-lg">Settings</h1>
      <SelectInput />
      <Tooltip tooltipText="Controls randomness: lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.">
        <RangeInput
          title="Temperature"
          numberController={temperatureController}
          minNum={0}
          maxNum={2}
          stepNum={0.01}
        />
      </Tooltip>
      <Tooltip tooltipText="The maximum number of tokens to generate. Requests can use up to 8192 tokens shared between prompt and completion.">
        <RangeInput
          title="Max Tokens"
          numberController={maxTokenController}
          minNum={0}
          maxNum={8192}
          stepNum={1}
        />
      </Tooltip>
      <Tooltip tooltipText="Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.">
        <RangeInput
          title="Top P"
          numberController={topPController}
          minNum={0}
          maxNum={1}
          stepNum={0.01}
        />
      </Tooltip>
      <Tooltip tooltipText="Seed used for sampling. If empty, a random seed is used.">
        <div className="flex justify-between">
          <h1 className="mt-4 block text-sm font-medium text-gray-900 dark:text-white">
            Seed
          </h1>
          <input
            type="text"
            className="w-20 rounded-md border border-zinc-600 bg-transparent px-2 text-end outline-none focus:border-zinc-400"
            value={localSeed}
            onChange={e => {
              setLocalSeed(e.target.value)
            }}
            onBlur={e => {
              const parsed = parseInt(e.target.value)
              const valid = !isNaN(parsed) && parsed > 0
              if (valid) {
                setSeed(parsed)
                setLocalSeed(parsed.toString())
              } else {
                setSeed(undefined)
                setLocalSeed("")
              }
            }}
          />
        </div>
      </Tooltip>
    </div>
  )
}

export default Settings
