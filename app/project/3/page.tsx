import SidebarGabi from "@/components/sidebargabi"

export default function Project3Page() {
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
                  src="/placeholder.svg?height=400&width=600&text=Mobile+App"
                  alt="Mobile App Excellence"
                  className="mb-6 aspect-video w-full max-w-3xl rounded-lg border object-cover"
                />
                <div className="prose dark:prose-invert text-sm leading-relaxed">
                  <h1 className="text-xl font-regular mb-4">Mobile App Excellence</h1>
                  <p className="mb-6">
                    Award-winning mobile application design that achieved 4.8 stars in app stores and over 1 million
                    downloads in the first month.
                  </p>

                  <h2 className="text-lg font-semibold mb-3">The Mobile Revolution</h2>
                  <p className="mb-4">
                    MobileFirst came to us with an ambitious goal: create a mobile app that would set new standards for
                    user experience in their industry. The app needed to be intuitive, fast, and delightful to use.
                  </p>

                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-xs mb-4">
                    "We didn't just want another app—we wanted to create something that users would love and recommend
                    to others."
                  </blockquote>

                  <h3 className="text-base font-medium mb-3">Design Principles</h3>
                  <p className="mb-3">Our design was built on core principles:</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>Intuitive navigation that requires no learning curve</li>
                    <li>Consistent visual language across all screens</li>
                    <li>Performance optimization for smooth interactions</li>
                    <li>Accessibility features for all users</li>
                  </ul>

                  <h3 className="text-base font-medium mb-3">User Experience Innovation</h3>
                  <p className="mb-4">
                    We introduced several innovative UX patterns that became industry standards, including gesture-based
                    navigation and contextual micro-interactions that guide users naturally through the app.
                  </p>

                  <h3 className="text-base font-medium mb-3">Recognition & Results</h3>
                  <p className="mb-3">The app's success was unprecedented:</p>
                  <div className="mb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-left py-2">Achievement</th>
                          <th className="text-left py-2">Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">App Store Rating</td>
                          <td className="py-2">4.8/5 stars</td>
                          <td className="py-2">Launch week</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Downloads</td>
                          <td className="py-2">1M+ downloads</td>
                          <td className="py-2">First month</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Awards</td>
                          <td className="py-2">3 design awards</td>
                          <td className="py-2">First year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    This project demonstrated how thoughtful mobile design can create exceptional user experiences that
                    drive both user satisfaction and business success.
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
                        <dd>MobileFirst</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Industry</dt>
                        <dd>Mobile Technology</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Location</dt>
                        <dd>New York, NY</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Company Size</dt>
                        <dd>25-50 employees</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Website</dt>
                        <dd>
                          <a href="https://mobilefirst.com/" className="text-primary hover:underline">
                            mobilefirst.com
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Topics</dt>
                        <dd>Mobile Design, App Development, User Interface</dd>
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
              src="/placeholder.svg?height=400&width=600&text=Mobile+App"
              alt="Mobile App Excellence"
              className="mb-6 aspect-video w-full rounded-lg border object-cover"
            />
            <div className="prose dark:prose-invert text-sm leading-relaxed">
              <h1 className="text-xl font-regular mb-4">Mobile App Excellence</h1>
              <p className="mb-4">
                Award-winning mobile application design that achieved 4.8 stars in app stores and over 1 million
                downloads in the first month.
              </p>

              <h2 className="text-lg font-semibold mb-3">The Mobile Revolution</h2>
              <p className="mb-4">
                MobileFirst came to us with an ambitious goal: create a mobile app that would set new standards for user
                experience.
              </p>
            </div>
          </article>

          <div className="mt-6 rounded-lg border bg-card p-4">
            <h3 className="mb-3 text-base font-semibold">Project Details</h3>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="font-medium text-muted-foreground">Company</dt>
                <dd>MobileFirst</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Industry</dt>
                <dd>Mobile Technology</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  )
}
