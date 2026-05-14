const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env" });

const BASE_URL = "https://bizforsale.io"; // Change this to your actual domain
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function generateSitemap() {
  console.log("🚀 Starting Sitemap Generation...");

  const sitemapData = {
    static: [],
    listings: [],
    blogs: [],
    timestamp: new Date().toISOString(),
  };

  // 1. Static Pages
  const staticPages = [
    { url: "/", priority: 1.0, changefreq: "daily" },
    { url: "/business-for-sale", priority: 0.9, changefreq: "daily" },
    { url: "/blogs", priority: 0.8, changefreq: "weekly" },
    { url: "/auth/login", priority: 0.5, changefreq: "monthly" },
    { url: "/auth/signup", priority: 0.5, changefreq: "monthly" },
  ];
  sitemapData.static = staticPages;

  // 2. Dynamic Listings
  console.log("Fetching listings...");
  const { data: listings, error: listingError } = await supabase
    .from("listings")
    .select("id, title, business_category, updated_at")
    .eq("is_approved", true)
    .neq("status", "draft");

  if (listingError) {
    console.error("Error fetching listings:", listingError);
  } else {
    sitemapData.listings = listings.map((l) => {
      // Create slug from title
      const slug = l.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const catslug = l.business_category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return {
        url: `/business-for-sale/${catslug}/${slug}/${l.id}`,
        lastmod: l.updated_at,
        priority: 0.7,
        changefreq: "weekly",
      };
    });
  }

  // 3. Dynamic Blogs
  console.log("Fetching blogs...");
  const { data: blogs, error: blogError } = await supabase
    .from("blogs") // Assuming table name is 'blogs'
    .select("slug, updated_at")
    .eq("status", "published");

  if (blogError) {
    console.log(
      "Note: Error fetching blogs (table might not exist yet):",
      blogError.message,
    );
  } else if (blogs) {
    sitemapData.blogs = blogs.map((b) => ({
      url: `/blogs/${b.slug}`,
      lastmod: b.updated_at,
      priority: 0.6,
      changefreq: "monthly",
    }));
  }

  // Save intermediate JSON
  const jsonPath = path.join(process.cwd(), "public", "sitemap-data.json");
  fs.writeFileSync(jsonPath, JSON.stringify(sitemapData, null, 2));
  console.log(`✅ JSON data saved to ${jsonPath}`);

  // Generate XML
  const allUrls = [
    ...sitemapData.static,
    ...sitemapData.listings,
    ...sitemapData.blogs,
  ];

  const xmlItems = allUrls
    .map(
      (item) => `
  <url>
    <loc>${BASE_URL}${item.url}</loc>
    ${item.lastmod ? `<lastmod>${new Date(item.lastmod).toISOString().split("T")[0]}</lastmod>` : `<lastmod>${new Date().toISOString().split("T")[0]}</lastmod>`}
    <changefreq>${item.changefreq || "weekly"}</changefreq>
    <priority>${item.priority || 0.5}</priority>
  </url>`,
    )
    .join("");

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  const xmlPath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(xmlPath, xmlSitemap);
  console.log(`✅ XML sitemap saved to ${xmlPath}`);

  // Generate robots.txt
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
`;

  const robotsPath = path.join(process.cwd(), "public", "robots.txt");
  fs.writeFileSync(robotsPath, robotsTxt);
  console.log(`✅ Robots.txt updated with sitemap link at ${robotsPath}`);
}

generateSitemap().catch((err) => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(1);
});
