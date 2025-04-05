"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MessageCircle, Send, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { sendContactEmail } from "@/app/actions/send-email"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null
    message: string
    title: string
  }>({ type: null, message: "", title: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setNotification({ type: null, message: "", title: "" })

    try {
      // Send email using server action
      const result = await sendContactEmail(formData)

      if (result.success) {
        // Reset form
        setFormData({ name: "", email: "", message: "" })

        // Show success message
        setNotification({
          type: "success",
          title: "Message sent successfully",
          message: "We'll get back to you as soon as possible.",
        })
      } else {
        throw new Error(result.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setNotification({
        type: "error",
        title: "Something went wrong",
        message: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const whatsappNumber = "+916282595965" // Replace with your actual WhatsApp number
  const whatsappMessage = encodeURIComponent("Hi! I would like to get more information.")
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-background to-muted flex items-center justify-center">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">Get in Touch</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Have questions or need assistance? Reach out to our team for personalized guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              {notification.type && (
                <Alert
                  className={`mb-6 ${
                    notification.type === "success"
                      ? "bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900"
                      : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{notification.title}</AlertTitle>
                  <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      Sending<span className="ml-2 animate-pulse">...</span>
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Connect with us through any of these channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center p-4 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+916282595965</p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-muted/50 transition-colors hover:bg-muted">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">info@learnhubedu.in</p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors dark:bg-green-950/30 dark:hover:bg-green-950/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">WhatsApp</p>
                    <p className="text-sm text-green-600 dark:text-green-500">Chat with us directly</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

