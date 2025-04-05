import Hero from "@/components/hero"
import AboutSection from "@/components/about-section"
import CollegeSection from "@/components/college-section"
import ContactSection from "@/components/contact-section"
import LogoSlider from "@/components/logoslider"
import Admission from "@/components/admissions-banner"

export default function Home() {
  return (
    <main key="home-page">
      <Hero />
      <AboutSection />
      <CollegeSection />
      <Admission />
      <LogoSlider />
      <ContactSection />
    </main>
  )
}

