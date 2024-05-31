import React from "react"
import Google from "../../icons/Google"
import Link from "next/link"

const GoogleLogin: React.FC = () => {
  return (
    <Link
      className="flex h-[50px] w-[200px] items-center justify-center rounded-lg bg-gradient-to-tr from-yellow-500 via-green-500 to-red-600"
      href={process.env.NEXT_PUBLIC_OAUTH_URL!}
    >
      <div className="flex size-[calc(100%-2px)] items-center justify-center rounded-[inherit] bg-stone-950 text-gray-400 transition-colors duration-300 hover:text-white">
        <Google className="flex-1 scale-[0.4]" />
        <h6 className="flex-[2.5]">Login via google</h6>
      </div>
    </Link>
  )
}

export default GoogleLogin
