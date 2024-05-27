import React from "react"

const BlurredBalls: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 800 1000"
      className="scale-150 -scale-x-150"
    >
      <animate
        attributeName="opacity"
        values="0.7;0.9;0.7"
        dur="10s"
        repeatCount="indefinite"
      />
      <defs>
        <filter
          id="bbblurry-filter"
          x="-100%"
          y="-100%"
          width="400%"
          height="400%"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur
            stdDeviation="104"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            in="SourceGraphic"
            edgeMode="none"
            result="blur"
          ></feGaussianBlur>
        </filter>
      </defs>
      <g filter="url(#bbblurry-filter)">
        <ellipse
          rx="83"
          ry="233.5"
          cx="639.1513081714168"
          cy="571.0930469585726"
          fill="hsl(37, 99%, 67%)"
        ></ellipse>
        <ellipse
          rx="83"
          ry="233.5"
          cx="369.2077638137366"
          cy="406.76451521568396"
          fill="hsl(316, 73%, 52%)"
        ></ellipse>
        <ellipse
          rx="70"
          ry="233.5"
          cx="527.5923333783498"
          cy="621.700864012832"
          fill="hsl(185, 100%, 57%)"
        ></ellipse>
      </g>
    </svg>
  )
}

export default BlurredBalls
