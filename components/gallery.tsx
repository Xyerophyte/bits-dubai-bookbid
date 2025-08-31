"use client"

import Link from "next/link"

interface Project {
  id: string
  title: string
  category: string
  image: string
}

interface GalleryProps {
  projects?: Project[]
}

const defaultProjects: Project[] = [
  { id: "1", title: "Neuwaes", category: "UI/UX", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/Rectangle%202.png" },
  { id: "2", title: "Miranda Labs", category: "Branding", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/Slide%2016_9%20-%209.png" },
  { id: "3", title: "Art Portfolio | CECHK", category: "UI/UX", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/MacBook-Pro-16%20%281%29%201.png" },
  { id: "4", title: "Eidos - art app", category: "Campaign", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/original-ea1362184570d64698251999a7470a76.webp" },
  { id: "5", title: "Caffio", category: "UI/UX", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/image%202.png" },
  { id: "6", title: "Nebula", category: "Print", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/original-1523529fe6f7f6dd98523021caac4a09.webp" },
  { id: "7", title: "Anima Labs", category: "UI/UX", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/Rectangle%208.png" },
  { id: "8", title: "Logo Collection", category: "Branding", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/logos.png" },
  { id: "9", title: "Art Direction Collection", category: "Campaign", image: "https://zvp33vils3mcd4rj.public.blob.vercel-storage.com/ART%20DIRECTION.png" },
]

export default function Gallery({ projects = defaultProjects }: GalleryProps) {
  const categories = ["All", "UI/UX", "Branding", "Campaign", "Print"]

  return (
    <div className="flex flex-col h-full">
      {/* Projects grid */}
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 auto-rows-max">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/project/${project.id}`}
              className="group relative bg-white rounded-[22px] overflow-hidden cursor-pointer w-full aspect-[4/3] block"
            >
              <img
                src={project.image || "/placeholder.svg?height=300&width=400&query=project image"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-neutral-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="absolute bottom-0 left-0 text-white text-xl font-medium p-[1.5px] px-5 py-1.5">
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
