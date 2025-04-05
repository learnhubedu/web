"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { CalendarIcon, ChevronDown, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { sendApplicationEmail } from "../app/actions/send-application"
import bgImage from "./image.jpg" // update path if different

export default function AdmissionsBanner() {
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
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image using next/image */}
        <Image
          src={bgImage || "/placeholder.svg"}
          alt="Admissions background"
          fill
          className="object-cover object-center brightness-75"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4">
            Admissions Open Now!
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-white mb-4 sm:mb-6 md:mb-8">
            Join us for a brighter future. Enroll today.
          </p>
          <Button
            onClick={() => setFormOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 text-base sm:text-lg font-medium border-2 border-white"
          >
            Apply Now
          </Button>
        </div>
      </section>

      {/* Application Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[85vw] md:max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-blue-600">
              Application Form
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
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
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Gender:</Label>
                <RadioGroup
                  defaultValue={formData.gender}
                  onValueChange={(value) => handleSelectChange("gender", value)}
                  className="flex flex-wrap gap-4 sm:gap-2 sm:space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
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

              <div className="space-y-2 md:col-span-2">
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
                  <SelectTrigger>
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

