"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GraduationCap, Menu, X, CalendarIcon, ChevronDown, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { sendApplicationEmail } from "../app/actions/send-application"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    whatsappNumber: "",
    gender: "",
    nationality: "",
    address: "",
    interestedCourse: "",
    guardianName: "",
    guardianNumber: "",
    bloodGroup: "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format date if selected
      const formDataWithDate = {
        ...formData,
        dateOfBirth: date ? format(date, "yyyy-MM-dd") : undefined,
      }

      // Send application using server action
      const result = await sendApplicationEmail(formDataWithDate)

      if (result.success) {
        // Show success message
        alert("Application submitted successfully!")

        // Close form and reset data
        setFormOpen(false)
        setFormData({
          name: "",
          email: "",
          mobileNumber: "",
          whatsappNumber: "",
          gender: "",
          nationality: "",
          address: "",
          interestedCourse: "",
          guardianName: "",
          guardianNumber: "",
          bloodGroup: "",
        })
        setDate(undefined)
      } else {
        throw new Error(result.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
                onClick={() => setFormOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 flex items-center font-medium"
              >
                Apply Now
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
                setFormOpen(true)
                setIsOpen(false)
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 font-medium text-center"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden under the navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Application Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-blue-600">
              Application Form
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name:</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email:</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number:</Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="Enter your mobile number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappNumber">WhatsApp Number:</Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  placeholder="Enter your WhatsApp number"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="rounded-md border shadow-md"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Gender:</Label>
                <RadioGroup
                  defaultValue={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex flex-wrap gap-4 sm:gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">
                      Other
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality:</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  placeholder="Your Nation"
                  value={formData.nationality}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address:</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Your Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="min-h-[80px] sm:min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestedCourse">Interested Course:</Label>
                <Input
                  id="interestedCourse"
                  name="interestedCourse"
                  placeholder="Interested Course"
                  value={formData.interestedCourse}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianName">Guardian Name:</Label>
                <Input
                  id="guardianName"
                  name="guardianName"
                  placeholder="Guardian name"
                  value={formData.guardianName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianNumber">Guardian Number:</Label>
                <Input
                  id="guardianNumber"
                  name="guardianNumber"
                  placeholder="Guardian Number"
                  value={formData.guardianNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group:</Label>
                <Select onValueChange={(value) => handleSelectChange("bloodGroup", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center pt-4 sm:pt-6">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 sm:px-8 rounded-lg text-base sm:text-lg font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

