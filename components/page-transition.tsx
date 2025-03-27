"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Loader from "./loader"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Show loader on route change
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }

    // Hide loader when route change is complete
    const handleRouteChangeComplete = () => {
      setIsLoading(false)
    }

    // Add event listeners for route changes
    window.addEventListener("beforeunload", handleRouteChangeStart)

    // Simulate route change completion
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)

      return () => clearTimeout(timer)
    }

    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart)
    }
  }, [pathname, isLoading])

  return (
    <>
      {isLoading && <Loader />}
      {children}
    </>
  )
}

