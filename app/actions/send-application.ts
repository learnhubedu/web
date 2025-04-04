"use server"

import nodemailer from "nodemailer"

type ApplicationFormData = {
  name: string
  email: string
  mobileNumber: string
  whatsappNumber: string
  gender: string
  nationality: string
  address: string
  interestedCourse: string
  guardianName: string
  guardianNumber: string
  bloodGroup: string
  dateOfBirth?: string
}

export async function sendApplicationEmail(formData: ApplicationFormData) {
  try {
    // Create a transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Replace with your SMTP server
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // Format the application data for the email
    const applicationDetails = Object.entries(formData)
      .map(([key, value]) => {
        // Convert camelCase to Title Case with spaces
        const formattedKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
        return `<strong>${formattedKey}:</strong> ${value || "Not provided"}`
      })
      .join("<br>")

    // Send email
    const info = await transporter.sendMail({
      from: '"LearnHub Edu" <info@learnhubedu.in>',
      to: "info@learnhubedu.in,hublearn14@gmail.com", // Replace with recipient email
      subject: `New Application from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">New Application Submission</h2>
          <p>A new application has been submitted through the website:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${applicationDetails}
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This is an automated message from the LearnHub Edu website.</p>
        </div>
      `,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: "Failed to send application email" }
  }
}

