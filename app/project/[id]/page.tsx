import SidebarGabi from "@/components/sidebargabi"
import { Casestudy8 } from "@/components/casestudy8"

const projects = [
  {
    id: "1",
    title: "Game Changer: Revolutionary Gaming Interface",
    category: "UI/UX",
    description:
      "A comprehensive redesign of a gaming platform that increased user engagement by 300% through innovative interface design and seamless user experience.",
    image: "/placeholder.svg?height=400&width=600&text=Game+Interface",
    company: "GameTech Studios",
    industry: "Gaming & Entertainment",
    location: "San Francisco, CA",
    companySize: "50-100",
    website: "https://gametech.com/",
    topics: "UI/UX Design, Gaming Interface, User Experience",
  },
  {
    id: "2",
    title: "Brand Identity Revolution",
    category: "Branding",
    description:
      "Complete brand transformation for a tech startup, including logo design, color palette, and comprehensive brand guidelines that helped secure $2M in funding.",
    image: "/placeholder.svg?height=400&width=600&text=Brand+Identity",
    company: "TechStart Inc.",
    industry: "Technology Startup",
    location: "Austin, TX",
    companySize: "10-25",
    website: "https://techstart.com/",
    topics: "Brand Identity, Logo Design, Visual Identity",
  },
  {
    id: "3",
    title: "Mobile App Excellence",
    category: "UI/UX",
    description:
      "Award-winning mobile application design that achieved 4.8 stars in app stores and over 1 million downloads in the first month.",
    image: "/placeholder.svg?height=400&width=600&text=Mobile+App",
    company: "MobileFirst",
    industry: "Mobile Technology",
    location: "New York, NY",
    companySize: "25-50",
    website: "https://mobilefirst.com/",
    topics: "Mobile Design, App Development, User Interface",
  },
  {
    id: "4",
    title: "Creative Campaign Success",
    category: "Campaign",
    description:
      "Multi-channel marketing campaign that increased brand awareness by 250% and generated $5M in revenue through creative storytelling and visual design.",
    image: "/placeholder.svg?height=400&width=600&text=Creative+Campaign",
    company: "Creative Agency Co.",
    industry: "Marketing & Advertising",
    location: "Los Angeles, CA",
    companySize: "100-200",
    website: "https://creativeagency.com/",
    topics: "Marketing Campaign, Creative Direction, Brand Strategy",
  },
  {
    id: "5",
    title: "Web Platform Innovation",
    category: "UI/UX",
    description:
      "Enterprise web platform redesign that improved user productivity by 40% and reduced support tickets by 60% through intuitive design patterns.",
    image: "/placeholder.svg?height=400&width=600&text=Web+Platform",
    company: "Enterprise Solutions",
    industry: "Enterprise Software",
    location: "Seattle, WA",
    companySize: "500+",
    website: "https://enterprisesolutions.com/",
    topics: "Web Design, Enterprise UX, Platform Design",
  },
  {
    id: "6",
    title: "Print Design Mastery",
    category: "Print",
    description:
      "Award-winning print design series that won 3 international design awards and was featured in major design publications worldwide.",
    image: "/placeholder.svg?height=400&width=600&text=Print+Design",
    company: "Design Studio Pro",
    industry: "Design & Publishing",
    location: "Chicago, IL",
    companySize: "15-30",
    website: "https://designstudiopro.com/",
    topics: "Print Design, Typography, Layout Design",
  },
  {
    id: "7",
    title: "Dashboard Analytics Revolution",
    category: "UI/UX",
    description:
      "Data visualization dashboard that transformed how executives make decisions, reducing analysis time by 70% through intelligent design and clear data presentation.",
    image: "/placeholder.svg?height=400&width=600&text=Dashboard+Analytics",
    company: "DataViz Corp",
    industry: "Data Analytics",
    location: "Boston, MA",
    companySize: "75-150",
    website: "https://dataviz.com/",
    topics: "Data Visualization, Dashboard Design, Analytics UX",
  },
  {
    id: "8",
    title: "Logo Collection Showcase",
    category: "Branding",
    description:
      "Comprehensive logo design collection for various industries, showcasing versatility and creative problem-solving across different brand challenges.",
    image: "/placeholder.svg?height=400&width=600&text=Logo+Collection",
    company: "Brand Identity Studio",
    industry: "Branding & Design",
    location: "Portland, OR",
    companySize: "5-15",
    website: "https://brandidentity.com/",
    topics: "Logo Design, Brand Identity, Visual Branding",
  },
  {
    id: "9",
    title: "Marketing Materials Excellence",
    category: "Campaign",
    description:
      "Comprehensive marketing materials suite that increased conversion rates by 180% through cohesive design strategy and compelling visual storytelling.",
    image: "/placeholder.svg?height=400&width=600&text=Marketing+Materials",
    company: "Marketing Pro Agency",
    industry: "Marketing Services",
    location: "Miami, FL",
    companySize: "30-60",
    website: "https://marketingpro.com/",
    topics: "Marketing Design, Campaign Materials, Visual Communication",
  },
]

export default function ProjectPage({ params }: { params: { id: string } }) {
  const project = projects.find((p) => p.id === params.id)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F6F4F4" }}>
      <div className="hidden lg:flex h-screen">
        {/* Sidebar */}
        <div className="w-[30%]">
          <SidebarGabi />
        </div>

        {/* Case study main content */}
        <div className="flex-1 overflow-y-auto">
          <Casestudy8 project={project} />
        </div>
      </div>

      <div className="lg:hidden">
        <SidebarGabi />
        <Casestudy8 project={project} />
      </div>
    </div>
  )
}
