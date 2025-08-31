/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://bits-dubai-bookbid.vercel.app",
  generateRobotsTxt: true,
  exclude: ["/auth/*", "/dashboard/*", "/checkout/*", "/admin/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/auth/", "/dashboard/", "/checkout/", "/admin/"],
      },
    ],
  },
}
