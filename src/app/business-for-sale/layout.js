const SITE_URL = "https://bizforsale.io";

export const metadata = {
  title: "Businesses For Sale | Browse Verified Listings",
  description:
    "Browse thousands of verified businesses for sale across every industry. Filter by price, revenue, location, and category. Find your perfect business opportunity on BizForSale.io.",
  keywords: [
    "businesses for sale",
    "buy a business",
    "business listings",
    "small business for sale",
    "online business for sale",
    "franchise opportunities",
    "SBA approved businesses",
    "seller financing",
    "distressed businesses",
    "remote business for sale",
    "business for sale near me",
    "profitable business listings",
    "business investment opportunities",
  ],
  openGraph: {
    title: "Businesses For Sale | Browse Verified Listings - BizForSale.io",
    description:
      "Thousands of verified businesses for sale. Filter by price, revenue, industry, and location. Start your business search today.",
    url: `${SITE_URL}/business-for-sale`,
    siteName: "BizForSale.io",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Browse Businesses For Sale - BizForSale.io",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Businesses For Sale | BizForSale.io",
    description:
      "Browse verified business listings. Filter by price, revenue, location, and category.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: `${SITE_URL}/business-for-sale`,
  },
};

export default function BusinessForSaleLayout({ children }) {
  return <>{children}</>;
}
