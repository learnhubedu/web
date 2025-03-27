"use client"

import { useEffect, useState } from "react"
import { getColleges } from "@/lib/supabase-college-api"
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Users, Calendar } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Update the College type to include the logo field
type College = {
  id: string
  name: string
  location: string
  image: string
  logo?: string // Add logo field
  description?: string
  foundedYear?: number
  website?: string
  programs?: string[]
  studentCount?: number
  brochure?: string
}

export default function CollegeSection() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const itemsPerPage = 3

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true)
        const data = await getColleges()
        setColleges(data || []) // ✅ Ensures state is always an array
      } catch (error) {
        console.error("Error fetching colleges:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchColleges()
  }, [])

  const totalPages = Math.ceil(colleges.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleColleges = colleges.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const openCollegeDetails = (college: College) => {
    setSelectedCollege(college)
  }

  const closeCollegeDetails = () => {
    setSelectedCollege(null)
  }

  return (
    <section id="colleges" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium bg-white">
            Educational Partners
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Partner Universities</h2>
          <p className="mt-6 text-xl text-gray-600 leading-relaxed">
            Explore our network of prestigious educational institutions that provide world-class learning opportunities.
          </p>
        </div>

        <div className="mt-20 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
            >
              {loading ? (
                // Premium skeleton loader cards
                Array.from({ length: 3 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <div className="pt-4">
                        <Skeleton className="h-10 w-full rounded-md" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : colleges.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
                  <div className="rounded-full bg-gray-100 p-6 mb-6">
                    <MapPin className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No colleges available</h3>
                  <p className="text-gray-500 max-w-md">
                    We're currently expanding our network of partner universities. Please check back soon.
                  </p>
                </div>
              ) : (
                visibleColleges.map((college, index) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={college.image || "/placeholder.svg?height=300&width=400"}
                        alt={college.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Add logo display if available */}
                      {college.logo && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
                          <img
                            src={college.logo || "/placeholder.svg"}
                            alt={`${college.name} logo`}
                            className="h-8 w-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {college.name}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="text-sm">{college.location}</span>
                      </div>

                      <div className="flex justify-between items-center mt-6">
                        {college.foundedYear && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Est. {college.foundedYear}</span>
                          </div>
                        )}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            openCollegeDetails(college)
                          }}
                          variant="outline"
                          className="ml-auto"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {!loading && colleges.length > itemsPerPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-12 gap-6"
            >
              <Button
                onClick={prevPage}
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-gray-200"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentPage === index ? "bg-blue-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
              <Button
                onClick={nextPage}
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 border-gray-200"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Premium College Detail Modal */}
      <Dialog open={selectedCollege !== null} onOpenChange={closeCollegeDetails}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white rounded-xl">
          {selectedCollege && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-5 h-full"
            >
              {/* Left column with image and quick stats */}
              <div className="md:col-span-2 relative h-full">
                <div className="absolute inset-0">
                  <img
                    src={selectedCollege.image || "/placeholder.svg?height=600&width=400"}
                    alt={selectedCollege.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />

                  {/* Add logo display in the modal if available */}
                  {selectedCollege.logo && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
                      <img
                        src={selectedCollege.logo || "/placeholder.svg"}
                        alt={`${selectedCollege.name} logo`}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="relative p-8 h-full flex flex-col justify-end text-white">
                  <DialogTitle className="text-3xl font-bold mb-2 text-white">{selectedCollege.name}</DialogTitle>
                  <div className="flex items-center mb-6">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{selectedCollege.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    {selectedCollege.foundedYear && (
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">Founded</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCollege.foundedYear}</p>
                      </div>
                    )}
                    {selectedCollege.studentCount && (
                      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4" />
                          <span className="text-sm font-medium">Students</span>
                        </div>
                        <p className="text-xl font-bold">{selectedCollege.studentCount.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column with comprehensive details */}
              <div className="md:col-span-3 p-8 max-h-[80vh] overflow-y-auto">
                <DialogHeader className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">University Details</h3>
                </DialogHeader>

                <div className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                      <span className="bg-blue-100 text-blue-800 p-1.5 rounded-md mr-2">
                        <Users className="h-4 w-4" />
                      </span>
                      Basic Information
                    </h4>
                    <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-sm text-gray-500 block">University Name</span>
                        <span className="text-gray-900 font-medium">{selectedCollege.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500 block">Location</span>
                        <span className="text-gray-900 font-medium">{selectedCollege.location}</span>
                      </div>
                      {selectedCollege.foundedYear && (
                        <div>
                          <span className="text-sm text-gray-500 block">Year Founded</span>
                          <span className="text-gray-900 font-medium">{selectedCollege.foundedYear}</span>
                        </div>
                      )}
                      {selectedCollege.studentCount && (
                        <div>
                          <span className="text-sm text-gray-500 block">Student Population</span>
                          <span className="text-gray-900 font-medium">
                            {selectedCollege.studentCount.toLocaleString()} students
                          </span>
                        </div>
                      )}
                      {/* Add logo display in the details section if available */}
                      {selectedCollege.logo && (
                        <div>
                          <span className="text-sm text-gray-500 block">University Logo</span>
                          <div className="mt-2 bg-white p-3 rounded-lg border border-gray-200 inline-block">
                            <img
                              src={selectedCollege.logo || "/placeholder.svg"}
                              alt={`${selectedCollege.name} logo`}
                              className="h-12 w-auto object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                      <span className="bg-green-100 text-green-800 p-1.5 rounded-md mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-file-text"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" x2="8" y1="13" y2="13" />
                          <line x1="16" x2="8" y1="17" y2="17" />
                          <line x1="10" x2="8" y1="9" y2="9" />
                        </svg>
                      </span>
                      About the University
                    </h4>
                    <div className="prose prose-gray max-w-none bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCollege.description ||
                          `${selectedCollege.name} is a prestigious institution located in ${selectedCollege.location}. 
                          The university offers a wide range of programs and is known for its academic excellence, 
                          innovative research, and vibrant campus life. Students benefit from state-of-the-art 
                          facilities, experienced faculty, and a supportive learning environment.`}
                      </p>
                    </div>
                  </div>

                  {/* Programs */}
                  {selectedCollege.programs && selectedCollege.programs.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                        <span className="bg-purple-100 text-purple-800 p-1.5 rounded-md mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-graduation-cap"
                          >
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                          </svg>
                        </span>
                        Academic Programs
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">
                          The university offers the following featured programs:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedCollege.programs.map((program, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                              <span className="text-gray-800">{program}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedCollege.brochure && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                        <span className="bg-red-100 text-red-800 p-1.5 rounded-md mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-file-text"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" x2="8" y1="13" y2="13" />
                            <line x1="16" x2="8" y1="17" y2="17" />
                            <line x1="10" x2="8" y1="9" y2="9" />
                          </svg>
                        </span>
                        College Brochure
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">
                          Download the official brochure for detailed information:
                        </p>
                        <a
                          href={selectedCollege.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
                        >
                          View Brochure <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {selectedCollege.website && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-gray-900 flex items-center">
                        <span className="bg-orange-100 text-orange-800 p-1.5 rounded-md mr-2">
                          <ExternalLink className="h-4 w-4" />
                        </span>
                        College Website
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">Visit the official website for more information:</p>
                        <a
                          href={selectedCollege.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
                        >
                          Visit {selectedCollege.name} <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button className="w-full" onClick={closeCollegeDetails}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

