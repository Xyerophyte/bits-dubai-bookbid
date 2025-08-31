import SidebarGabi from "@/components/sidebargabi"

export default function Project1Page() {
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
                  src="/placeholder.svg?height=400&width=600&text=Game+Interface"
                  alt="Game Changer: Revolutionary Gaming Interface"
                  className="mb-6 aspect-video w-full max-w-3xl rounded-lg border object-cover"
                />
                <div className="prose dark:prose-invert text-sm leading-relaxed">
                  <h1 className="text-xl font-regular mb-4">Game Changer: Revolutionary Gaming Interface</h1>
                  <p className="mb-6">
                    A comprehensive redesign of a gaming platform that increased user engagement by 300% through
                    innovative interface design and seamless user experience.
                  </p>

                  <h2 className="text-lg font-semibold mb-3">The Challenge</h2>
                  <p className="mb-4">
                    GameTech Studios approached us with a critical problem: their gaming platform was experiencing
                    declining user engagement and high bounce rates. Players were struggling to navigate the complex
                    interface, leading to frustration and abandonment.
                  </p>

                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-xs mb-4">
                    "We needed a complete overhaul of our user experience. The old interface was driving players away
                    instead of keeping them engaged."
                  </blockquote>

                  <h3 className="text-base font-medium mb-3">Research & Discovery</h3>
                  <p className="mb-3">Our team conducted extensive user research to understand the pain points:</p>
                  <ul className="text-xs space-y-1 mb-4">
                    <li>Complex navigation structure confusing new users</li>
                    <li>Poor visual hierarchy making important features hard to find</li>
                    <li>Inconsistent design patterns across different game modes</li>
                    <li>Slow loading times affecting user experience</li>
                  </ul>

                  <h3 className="text-base font-medium mb-3">Design Solution</h3>
                  <p className="mb-4">
                    We implemented a revolutionary gaming interface that prioritized user flow and engagement. The new
                    design featured intuitive navigation, streamlined game discovery, and personalized recommendations.
                  </p>

                  <h3 className="text-base font-medium mb-3">Results</h3>
                  <p className="mb-3">The impact was immediate and significant:</p>
                  <div className="mb-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Metric</th>
                          <th className="text-left py-2">Before</th>
                          <th className="text-left py-2">After</th>
                          <th className="text-left py-2">Improvement</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">User Engagement</td>
                          <td className="py-2">2.3 min avg session</td>
                          <td className="py-2">9.2 min avg session</td>
                          <td className="py-2">+300%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Bounce Rate</td>
                          <td className="py-2">68%</td>
                          <td className="py-2">23%</td>
                          <td className="py-2">-66%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">User Retention</td>
                          <td className="py-2">34%</td>
                          <td className="py-2">78%</td>
                          <td className="py-2">+129%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p>
                    The success of this project established GameTech Studios as a leader in user-centric gaming design
                    and significantly increased their market share in the competitive gaming industry.
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
                        <dd>GameTech Studios</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Industry</dt>
                        <dd>Gaming & Entertainment</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Location</dt>
                        <dd>San Francisco, CA</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Company Size</dt>
                        <dd>50-100 employees</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Website</dt>
                        <dd>
                          <a href="https://gametech.com/" className="text-primary hover:underline">
                            gametech.com
                          </a>
                        </dd>
                      </div>
                      <div>
                        <dt className="font-medium text-muted-foreground">Topics</dt>
                        <dd>UI/UX Design, Gaming Interface, User Experience</dd>
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
              src="/placeholder.svg?height=400&width=600&text=Game+Interface"
              alt="Game Changer: Revolutionary Gaming Interface"
              className="mb-6 aspect-video w-full rounded-lg border object-cover"
            />
            <div className="prose dark:prose-invert text-sm leading-relaxed">
              <h1 className="text-xl font-regular mb-4">Game Changer: Revolutionary Gaming Interface</h1>
              <p className="mb-4">
                A comprehensive redesign of a gaming platform that increased user engagement by 300% through innovative
                interface design and seamless user experience.
              </p>

              <h2 className="text-lg font-semibold mb-3">The Challenge</h2>
              <p className="mb-4">
                GameTech Studios approached us with a critical problem: their gaming platform was experiencing declining
                user engagement and high bounce rates.
              </p>

              <h3 className="text-base font-medium mb-3">Results</h3>
              <p>The impact was immediate and significant with 300% increase in user engagement.</p>
            </div>
          </article>

          <div className="mt-6 rounded-lg border bg-card p-4">
            <h3 className="mb-3 text-base font-semibold">Project Details</h3>
            <dl className="space-y-2 text-xs">
              <div>
                <dt className="font-medium text-muted-foreground">Company</dt>
                <dd>GameTech Studios</dd>
              </div>
              <div>
                <dt className="font-medium text-muted-foreground">Industry</dt>
                <dd>Gaming & Entertainment</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  )
}
