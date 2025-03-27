"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate minimum display time to avoid flashes
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 90000)

    // Add event listeners for page load
    const handleLoad = () => {
      clearTimeout(timer)
      setIsLoading(false)
    }

    window.addEventListener("load", handleLoad)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("load", handleLoad)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-white transition-opacity duration-500",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
    >
      <div className="relative">
        {/* Outer circle */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 animate-pulse"></div>

        {/* Inner spinner */}
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="w-16 h-16 rounded-full border-t-4 border-blue-600 animate-spin"></div>
        </div>

        {/* Logo in center */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
          </svg>
        </div>
      </div>
      <p className="absolute mt-24 text-sm text-blue-600 font-medium">Loading...</p>
    </div>
  )
}

