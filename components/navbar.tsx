"use client"

import { useState, useEffect } from "react"
import { GraduationCap, Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for premium look
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBookConsultation = () => {
    const phoneNumber = "+916282595965" // Replace with your actual WhatsApp number
    const message = encodeURIComponent("Hi, I would like to book a consultation with LearnHub Edu.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <>
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300",
          scrolled ? "bg-white/95 backdrop-blur-sm shadow-md py-2" : "bg-white py-4",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative">
                  <GraduationCap className="h-9 w-9 text-blue-600 transition-transform group-hover:scale-110" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="ml-2">
                  <span className="text-xl font-bold text-gray-800">LearnHub</span>
                  <span className="text-xl font-bold text-blue-600">Edu</span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {["Home", "About", "Colleges", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-blue-600 relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              <button
                onClick={handleBookConsultation}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center font-medium"
              >
                Book Consultation
              </button>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu with overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={cn(
          "fixed top-0 right-0 z-40 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="flex items-center mb-8">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <div className="ml-2">
              <span className="text-xl font-bold text-gray-800">LearnHub</span>
              <span className="text-xl font-bold text-blue-600">Edu</span>
            </div>
          </div>

          {["Home", "About", "Colleges", "Contact"].map((item) => (
            <Link
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="block py-3 px-4 text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-gray-200">
            <button
              onClick={() => {
                handleBookConsultation()
                setIsOpen(false)
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-medium text-center"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  )
}

