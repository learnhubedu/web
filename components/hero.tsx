import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  const whatsappNumber = "+916282595965" // Replace with your actual WhatsApp number
  const whatsappMessage = encodeURIComponent("Hi! I would like to book a free consultation.")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <div id="home" className="relative bg-white pt-16">
      <div className="absolute inset-0">
 
        <div className="absolute inset-0 bg-blue-900 mix-blend-multiply opacity-80" />
      </div>

      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Shape Your Future with
          <span className="block text-blue-400">LearnHub Edu</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-gray-300">
          Expert guidance for your college journey. Get personalized consulting services to help you achieve your
          academic goals and secure admissions to top universities.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Book Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <Link
            href="#colleges"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
          >
            Explore Colleges
          </Link>
        </div>
      </div>
    </div>
  )
}

