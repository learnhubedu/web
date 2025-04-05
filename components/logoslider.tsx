"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
// You'll need to add these environment variables to your project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for logo data
interface Logo {
  id: number
  name: string
  logo_url: string
  created_at: string
}

export default function LogoSlider() {
  const [isHovered, setIsHovered] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [logos, setLogos] = useState<Logo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Fetch logos from Supabase
  useEffect(() => {
    async function fetchLogos() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("logos").select("*").order("id", { ascending: true })

        if (error) {
          throw error
        }

        if (data) {
          setLogos(data)
        }
      } catch (error) {
        setError("Error fetching logos")
        console.error("Error fetching logos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogos()
  }, [])

  // Create duplicate array for infinite scroll effect
  const allLogos = [...logos, ...logos]

  // Animation effect
  useEffect(() => {
    if (!scrollerRef.current || isHovered || logos.length === 0) return

    const scrollerContent = scrollerRef.current
    scrollerContent.setAttribute("style", `animation: scroll 10s linear infinite;`)

    return () => {
      scrollerContent.removeAttribute("style")
    }
  }, [isHovered, logos])

  // Handle image error
  const handleImageError = (logoUrl: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [logoUrl]: true,
    }))
  }

  return (
    <main className="w-full flex flex-col items-center justify-center p-0 m-0">
      <br />
      <h2 className="text-lg font-semibold text-center mt-0 mb-1">Top Colleges</h2>
<br />
<br />
      {loading ? (
        <div className="py-8 text-center">Loading...</div>
      ) : error ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : (
        <div
          className="relative overflow-hidden w-full max-w-5xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <style jsx global>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
          `}</style>

          <div ref={scrollerRef} className="flex w-max">
            {allLogos.map((logo, index) => (
              <div key={index} className="w-[150px] h-[120px] mx-2 flex-shrink-0 flex items-center justify-center">

                {logo.logo_url && !imageErrors[logo.logo_url] ? (
               <Image
               src={logo.logo_url || "/placeholder.svg"}
               alt={`${logo.name} logo`}
               width={90} // or whatever smaller size you prefer
               height={60}
               className="object-contain"
               style={{ objectFit: "contain" }}
               onError={() => handleImageError(logo.logo_url)}
             />
             
                ) : (
                  <Image
                    src="/placeholder.svg?height=80&width=200"
                    alt={`${logo.name} logo placeholder`}
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}

