import { AppBar, Toolbar, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import NavbarAuth from "./NavbarAuth";
import MobileNavbarAuth from "./MobileNavbarAuth";

// Static links always visible to all users (crawlers see these immediately)
const staticLinks = [
  { label: "Browse", href: "/business-for-sale" },
  { label: "Blogs", href: "/blogs" },
];

export default function Navbar() {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#ffffff",
        color: "#0884ff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 4 },
          mx: "auto",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 0,
            width: "100%",
            minHeight: { xs: 56, sm: 64 },
          }}
        >
          {/* Logo — server-rendered, indexable */}
          <Link
            href="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Image
              src="/logo.png"
              alt="BizForSale Logo"
              width={32}
              height={32}
              priority
              style={{ height: "auto" }}
            />
          </Link>

          {/* Desktop navigation (md and above) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              alignItems: "center",
            }}
          >
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                {link.label}
              </Link>
            ))}
            <NavbarAuth />
          </Box>

          {/* Mobile hamburger (below md) */}
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <MobileNavbarAuth staticLinks={staticLinks} />
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
