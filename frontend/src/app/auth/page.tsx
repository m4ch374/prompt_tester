import React from "react"
import BlurredBalls from "../../components/auth/BlurredBalls"
import GoogleLogin from "@/components/auth/GoogleLogin"

const Auth: React.FC = () => {
  return (
    <div className="flex h-screen w-full justify-between">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <BlurredBalls />

        <div className="absolute left-0 top-0 flex size-full flex-col items-center justify-center">
          <h1 className="text-[3em] font-semibold tracking-tighter drop-shadow-lg">
            Test out your AI in{" "}
            <span className="font-mono font-thin text-purple-300 underline underline-offset-8">
              style
            </span>
          </h1>
          <h3 className="font-thin text-gray-200/80">
            powered by{" "}
            <span className="font-normal tracking-tighter">Prompt Tester</span>
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-stone-950 drop-shadow-md">
        <h1 className="text-lg font-thin">Start your journey by</h1>
        <GoogleLogin />
      </div>
    </div>
  )
}

export default Auth
