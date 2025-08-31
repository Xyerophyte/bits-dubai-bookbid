import SidebarGabi from "@/components/sidebargabi"
import { Services4 } from "@/components/services4"

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F4F4" }}>
      {/* Sidebar */}
      <SidebarGabi />

      {/* Main content */}
      <div className="lg:ml-[30%] lg:flex lg:flex-col">
        {/* Desktop: content area, Mobile: stacked layout */}
        <div className="lg:overflow-y-auto lg:h-screen">
          <div className="lg:p-8 p-6 space-y-8">
            {/* Hero Section */}
            <section className="space-y-4">
              <h1 className="font-sans text-xl font-regular leading-tight text-foreground">About Me</h1>
              <div className="prose dark:prose-invert space-y-4 text-sm leading-relaxed">
                <p>
                  Hi there! I'm Gabriela, an internationally exhibited artist with a passion for blending art, design,
                  and technology. My journey started with a degree in linguistics, which uniquely shapes the way I craft
                  designs—ensuring they're not just visually striking but also resonate on a deeper, communicative
                  level.
                </p>
                <p>
                  With 5 years in the ever-evolving crypto landscape, I'm no stranger to fast-paced environments where
                  innovation is key. I thrive on creating experiences that not only meet business goals but also connect
                  with audiences in meaningful ways.
                </p>
                <p>
                  When I'm not designing, you'll find me diving into art projects, programming, or hitting the pavement
                  for a good run. If you're looking for someone who brings creativity, precision, and a fresh
                  perspective to the table, let's make something amazing together!
                </p>
              </div>
            </section>

            {/* Education Section */}
            <section className="space-y-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Education</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-foreground text-sm">BASc, Linguistics (English, Communications)</h3>
                  <p className="text-muted-foreground text-xs">Paraná State University (2021)</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">UX Design Psychology</h4>
                    <p className="text-muted-foreground text-xs">UXCEL (2024)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Design Thinking</h4>
                    <p className="text-muted-foreground text-xs">UXCEL (2024)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Design Composition</h4>
                    <p className="text-muted-foreground text-xs">UXCEL (2024)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Leadership and Soft Skills</h4>
                    <p className="text-muted-foreground text-xs">WoMakersCode (2023)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="space-y-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Skills</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3 text-sm">Hard Skills</h3>
                  <div className="prose dark:prose-invert text-xs">
                    <ul className="space-y-1">
                      <li>Figma</li>
                      <li>Next.Js</li>
                      <li>User Testing</li>
                      <li>Data Analysis</li>
                      <li>Design Systems</li>
                      <li>Prototyping</li>
                      <li>Accessibility Design</li>
                      <li>Adobe Suite</li>
                      <li>Color & Typography</li>
                      <li>Blender</li>
                      <li>Marvelous Designer</li>
                      <li>Garment Prototyping</li>
                      <li>Unreal Engine</li>
                      <li>Concept Design</li>
                      <li>Product Design</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-3 text-sm">Soft Skills</h3>
                  <div className="prose dark:prose-invert text-xs">
                    <ul className="space-y-1">
                      <li>User Advocacy</li>
                      <li>User Research</li>
                      <li>Critical Thinking</li>
                      <li>Empathy</li>
                      <li>Teamwork</li>
                      <li>Adaptability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Experience Section */}
            <section className="space-y-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Experience</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-foreground text-sm">Currently</h3>
                  <p className="text-muted-foreground text-xs">2023 - Art Director at Delgado Agency</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground text-sm">Previously</h3>
                  <div className="prose dark:prose-invert text-xs">
                    <ul className="space-y-1">
                      <li>2024 - Art Director at Obinex</li>
                      <li>2020 - Senior Designer at Veoito</li>
                      <li>2018 - Designer at UNESPAR</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Focus Section */}
            <section className="space-y-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">Focus</h2>
              <div className="prose dark:prose-invert text-xs">
                <ul className="space-y-1">
                  <li>UI/UX</li>
                  <li>Product</li>
                  <li>Brand Identity</li>
                  <li>Prototyping</li>
                  <li>Art Direction</li>
                  <li>Web3</li>
                  <li>Finance</li>
                </ul>
              </div>
            </section>

            {/* Services Section */}
            <Services4 />
          </div>
        </div>
      </div>
    </div>
  )
}
