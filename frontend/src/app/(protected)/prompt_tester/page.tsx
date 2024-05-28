import PromptTesterForm from "@/components/prompt_tester/PromptTesterForm"
import React from "react"

const PromptTester: React.FC = () => {
  return (
    <div className="flex size-full flex-col">
      <h1 className="my-4 ml-4 text-2xl font-thin">Prompt Tester</h1>
      <hr className="h-px border-0 bg-zinc-500/40" />
      <PromptTesterForm />
    </div>
  )
}

export default PromptTester
