"use client"

import { Code, Cog, PenTool, Shrub } from "lucide-react"

const Services4 = () => {
  const services = [
    {
      icon: <Cog className="h-6 w-6" />,
      title: "Product Strategy",
      description:
        "Strategic planning and market positioning to ensure your product meets user needs and business goals.",
      items: ["Market Research", "User Personas", "Competitive Analysis"],
    },
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Design",
      description: "Beautiful, user-centered designs that create engaging experiences across all platforms.",
      items: ["UI/UX Design", "Prototyping", "Interaction Design"],
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Web Development",
      description: "Modern, scalable web applications built with the latest technologies and best practices.",
      items: ["Frontend Dev", "Backend Dev", "API Integration"],
    },
    {
      icon: <Shrub className="h-6 w-6" />,
      title: "Marketing",
      description: "Data-driven strategies to launch successfully and scale your product efficiently.",
      items: ["SEO Strategy", "Analytics & Data", "A/B Testing"],
    },
  ]

  return (
    <section className="py-10">
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="font-semibold tracking-tight text-lg">Services</h2>
            <p className="text-muted-foreground mx-auto max-w-2xl tracking-tight text-base">
              We craft digital experiences that captivate and convert, bringing your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={index}
                className="border-border space-y-6 rounded-lg border p-8 transition-shadow hover:shadow-sm shadow-none"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-muted rounded-full p-3">{service.icon}</div>
                  <h3 className="font-semibold text-base">{service.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{service.description}</p>
                <div className="space-y-2">
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <div className="bg-foreground h-1.5 w-1.5 rounded-full" />
                      <span className="font-medium text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Services4 }
