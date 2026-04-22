import { Box } from "@mui/material";
import Sidebar from "@/components/dashboard/layout/Sidebar";

export const metadata = {
  title: "Dashboard | Manage Your Listings",
  description:
    "Manage your business listings, track buyer inquiries, and monitor performance. Create and publish business listings to reach thousands of buyers on BizForSale.io.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardRootLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flex: 1 }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          backgroundColor: "#f9fafb",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
