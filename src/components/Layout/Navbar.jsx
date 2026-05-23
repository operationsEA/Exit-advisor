import { AppBar, Toolbar, Box } from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import NavbarAuth from "./NavbarAuth";

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          mx: "auto",
          width: "100%",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 0,
            width: "100%",
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

          {/* Navigation */}
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            {/* Static public links — server-rendered for crawlers */}
            {staticLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ textDecoration: "none", color: "#0884ff" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth-dependent section — client component */}
            <NavbarAuth />
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
}
