import { Box } from "@mui/material";
import Sidebar from "@/components/dashboard/layout/Sidebar";

export const metadata = {
  title: "Dashboard - BizForSale",
  description: "Manage your business listings",
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
