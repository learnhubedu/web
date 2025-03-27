import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import CollegeSection from "@/components/college-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <main key="home-page">
      <Hero />
      <AboutSection />
      <CollegeSection />
      <ContactSection />
    </main>
  )
}

