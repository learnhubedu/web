import { Users, Award, BookOpen } from "lucide-react"

export default function AboutSection() {
  const features = [
    {
      name: "Expert Guidance",
      description: "Get personalized advice from experienced education consultants.",
      icon: Users,
    },
    {
      name: "Top Universities",
      description: "Access to prestigious institutions worldwide.",
      icon: Award,
    },
    {
      name: "Comprehensive Support",
      description: "From application to admission, we guide you every step of the way.",
      icon: BookOpen,
    },
  ]

  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Why Choose LearnHub Edu?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            We help students achieve their academic dreams through expert guidance and comprehensive support.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div>
                  <feature.icon className="h-12 w-12 text-blue-600" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

