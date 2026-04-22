import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";

const SITE_URL = "https://bizforsale.io";

export const metadata = {
  title: "BizForSale.io | #1 Marketplace to Buy & Sell Businesses Online",
  description:
    "Find your next business opportunity on BizForSale.io. Browse thousands of verified businesses for sale — from profitable online stores to established brick-and-mortar businesses. Buy, sell, and invest with confidence.",
  keywords: [
    "business for sale",
    "buy a business",
    "sell a business",
    "small business for sale",
    "online business for sale",
    "business opportunities",
    "franchise for sale",
    "profitable businesses",
    "business marketplace",
    "business investment",
    "SBA approved business",
    "seller financing business",
    "acquire a business",
    "business broker marketplace",
    "remote business for sale",
  ],
  openGraph: {
    title: "BizForSale.io | The #1 Marketplace to Buy & Sell Businesses",
    description:
      "Thousands of verified businesses for sale. Buy, sell, or invest in a business today on BizForSale.io.",
    url: SITE_URL,
    siteName: "BizForSale.io",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BizForSale.io - Browse Businesses For Sale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BizForSale.io | Buy & Sell Businesses Online",
    description:
      "Browse verified businesses for sale across every industry. Find your perfect business opportunity today.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
