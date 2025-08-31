import Link from "next/link"

export default function SidebarGabi() {
  return (
    <>
      {/* Desktop layout - sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-[30%] bg-[#F6F4F4] flex-col justify-between p-8 overflow-hidden">
        {/* Top section with title */}
        <div className="flex flex-col">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <div className="m3-label text-foreground mb-[42px]">PORTFOLIO // 2025</div>
          </Link>
          <div className="font-sans font-regular text-[48px] leading-tight text-foreground my-[-0] leading-[1.1rem]">
            Gabriela
            <br />
            Cecchin
          </div>
        </div>

        {/* Bottom section with bio and links */}
        <div className="flex flex-col space-y-6">
          <p className="font-sans font-light text-[18px] leading-relaxed text-stone-500">
            👋 Hello, I am Gabriela - a multidisciplinar designer with passion for tech, language and everything in
            between.
          </p>

          <div className="flex space-y-2 items-start flex-row gap-4">
            <Link
              href="/about"
              className="font-sans font-light text-[18px] text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <a
              href="#"
              className="font-sans font-light text-[18px] text-foreground hover:text-primary transition-colors"
            >
              CV
            </a>
            <a
              href="https://www.linkedin.com/in/gabriela-cecchin-b2933a120/"
              className="font-sans font-light text-[18px] text-foreground hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-[#F6F4F4] p-6 space-y-6">
        {/* Top section with title */}
        <div className="space-y-4">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <div className="m3-label text-foreground">PORTFOLIO // 2025</div>
          </Link>
          <div className="font-sans font-regular text-[32px] md:text-[40px] leading-tight text-foreground">
            Gabriela Cecchin
          </div>
        </div>

        {/* Bio text */}
        <p className="font-sans font-light text-[16px] md:text-[18px] leading-relaxed text-foreground">
          👋 Hello, I am Gabriela - a multidisciplinar designer with passion for tech, language and everything in
          between.
        </p>

        <div className="flex space-x-4">
          <a
            href="#"
            className="font-sans font-light text-[16px] md:text-[18px] text-foreground hover:text-primary transition-colors"
          >
            CV
          </a>
          <Link
            href="/about"
            className="font-sans font-light text-[16px] md:text-[18px] text-foreground hover:text-primary transition-colors"
          >
            About
          </Link>
          <a
            href="https://www.linkedin.com/in/gabriela-cecchin-b2933a120/"
            className="font-sans font-light text-[16px] md:text-[18px] text-foreground hover:text-primary transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </>
  )
}
