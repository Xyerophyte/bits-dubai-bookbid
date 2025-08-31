import SidebarGabi from "@/components/sidebargabi"

export default function Project2Page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F4F4" }}>
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-[30%]">
          <SidebarGabi />
        </div>

        {/* Case study main content */}
        <div className="flex-1 overflow-y-auto">
          <section className="px-4 py-12 md:px-6 lg:px-8 lg:py-16">
            <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:gap-16">
              <article className="mx-auto">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Brand+Identity"
                  alt="Miranda Labs"
                  className="mb-6 aspect-video w-full max-w-3xl rounded-lg border object-cover"
                />
                <div className="prose dark:prose-invert text-sm leading-relaxed">
                  <h1 className="text-xl font-regular mb-4">Miranda Labs</h1>
                  <p className="mb-6">
                    Complete brand transformation for a tech startup, including logo design, color palette, and
                    comprehensive brand guidelines that helped secure $2M in funding.
                  </p>

                  <h2 className="text-lg font-semibold mb-3">The Vision</h2>
                  <p className="mb-4">
                    TechStart Inc. needed more than just a logo—they needed a complete brand identity that would
                    resonate with investors and customers alike. The challenge was to create something that felt both
                    innovative and trustworthy.
                  </p>

                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-xs mb-4">
                    "The new brand identity didn't just change how we looked—it changed how we felt about our company
                    and how others perceived us."
                  </blockquote>

                  <h3 className="text-base font-medium mb-3">Brand Strategy</h3>
                  <p className="mb-3">Our comprehensive approach included:</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>Market research and competitive analysis</li>
                    <li>Brand positioning and messaging framework</li>
                    <li>Visual identity system development</li>
                    <li>Brand guidelines and implementation strategy</li>
                  </ul>

                  <h3 className="text-base font-medium mb-3">Design Process</h3>
                  <p className="mb-4">
                    We developed a sophisticated visual language that balanced innovation with reliability. The color
                    palette, typography, and imagery all worked together to create a cohesive brand experience.
                  </p>

                  <h3 className="text-base font-medium mb-3">Impact</h3>
                  <p className="mb-3">The results exceeded all expectations:</p>
                  <div className="mb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Achievement</th>
                          <th className="text-left py-2">Timeline</th>
                          <th className="text-left py-2">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Series A Funding</td>
                          <td className="py-2">3 months post-launch</td>
                          <td className="py-2">$2M raised</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Brand Recognition</td>
                          <td className="py-2">6 months</td>
                          <td className="py-2">85% increase</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Customer Trust</td>
                          <td className="py-2">1 year</td>
                          <td className="py-2">92% confidence rating</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    This brand transformation became a case study in how strategic design can directly impact business
                    success and investor confidence.
                  </p>
                </div>
              </article>

              <aside className="lg:w-80">
                <div className="sticky top-8 space-y-4">
                  <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                    <h3 className="mb-3 text-base font-semibold">Project Details</h3>
                    <dl className="space-y-2 text-xs">
                      <div>
                        <dt className="font-medium text-muted-foreground">Company</dt>
                        <dd>TechStart Inc.</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Industry</dt>
                        <dd>Technology Startup</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Location</dt>
                        <dd>Austin, TX</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Company Size</dt>
                        <dd>10-25 employees</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Website</dt>
                        <dd>
                          <a href="https://techstart.com/" className="text-primary hover:underline">
                            techstart.com
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Topics</dt>
                        <dd>Brand Identity, Logo Design, Visual Identity</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>

      <div className="lg:hidden">
        <SidebarGabi />
        <section className="px-4 py-12">
          <article>
            <img
              src="/placeholder.svg?height=400&width=600&text=Brand+Identity"
              alt="Brand Identity Revolution"
              className="mb-6 aspect-video w-full rounded-lg border object-cover"
            />
            <div className="prose dark:prose-invert text-sm leading-relaxed">
              <h1 className="text-xl font-regular mb-4">Brand Identity Revolution</h1>
              <p className="mb-4">
                Complete brand transformation for a tech startup that helped secure $2M in funding.
              </p>

              <h2 className="text-lg font-semibold mb-3">The Vision</h2>
              <p className="mb-4">
                TechStart Inc. needed a complete brand identity that would resonate with investors and customers alike.
              </p>
            </div>
          </article>

          <div className="mt-6 rounded-lg border bg-card p-4">
            <h3 className="mb-3 text-base font-semibold">Project Details</h3>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="font-medium text-muted-foreground">Company</dt>
                <dd>TechStart Inc.</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Industry</dt>
                <dd>Technology Startup</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  )
}
