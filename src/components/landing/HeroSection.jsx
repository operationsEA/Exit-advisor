import { Button } from "@mui/material";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
          Buy & Sell Businesses with{" "}
          <span className="text-primary-600">Confidence</span>
        </h1>

        <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          BizForSale.io connects serious buyers and sellers. Discover vetted
          business opportunities, connect with qualified investors, and close
          deals faster.
        </p>

        {/* Search Bar Component */}
        <SearchBar />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/business-for-sale" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#0884ff",
                textTransform: "none",
                fontSize: "1.1rem",
                padding: "12px 32px",
                "&:hover": { backgroundColor: "#0670d6" },
              }}
            >
              Browse Businesses
            </Button>
          </Link>
          <Link href="/list-your-business" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#0884ff",
                color: "#0884ff",
                textTransform: "none",
                fontSize: "1.1rem",
                padding: "12px 32px",
                "&:hover": { backgroundColor: "rgba(8, 132, 255, 0.05)" },
              }}
            >
              List Your Business
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-12 border-t border-neutral-200">
          <div>
            <p className="text-4xl font-bold text-primary-600 mb-2">500+</p>
            <p className="text-neutral-600">Active Listings</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-secondary-600 mb-2">10K+</p>
            <p className="text-neutral-600">Verified Buyers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-success-600 mb-2">$2.5B+</p>
            <p className="text-neutral-600">Total Deal Value</p>
          </div>
        </div>
      </div>
    </section>
  );
}
