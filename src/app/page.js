import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";

export const metadata = {
  title: "BizForSale.io - Buy & Sell Businesses Online",
  description:
    "Buy and sell businesses with confidence. Discover vetted business opportunities on BizForSale.io - the trusted marketplace for business sales.",
  keywords:
    "business for sale, buy business, sell business, business marketplace, business listings",
  openGraph: {
    title: "BizForSale.io - Businesses for Sale",
    description: "Buy and sell businesses with confidence on BizForSale.io",
    url: "https://bizforsale.io",
    siteName: "BizForSale.io",
    type: "website",
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
