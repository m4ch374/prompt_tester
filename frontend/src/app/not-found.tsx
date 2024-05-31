import React from "react"
import Image from "next/image"
import Link from "next/link"

const NotFound: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Image
        src={"/walk.svg"}
        width={250}
        height={250}
        alt="walking"
        className="border-r border-zinc-600 p-2"
      />
      <div className="ml-4 flex flex-col items-start gap-4">
        <h1 className="text-xl font-thin">
          Oh no! It seems like you&apos;ve went missing!
        </h1>
        <Link
          href={"/"}
          className="mt-4 rounded-full bg-white px-4 py-2 text-black"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
