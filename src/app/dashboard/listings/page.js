"use client";

import AdminListingsPage from "@/components/dashboard/Listings/AdminListingsPage";
import SellerListingPage from "@/components/dashboard/Listings/SellerListingPage";
import Loading from "@/components/Shared/Loading";
import { useAuth } from "@/contexts/AuthContext";

export default function ListingsPage() {
  const { user, isLoading } = useAuth();

  const role = user?.user_metadata?.role;

  console.log("User role:", user);

  if (isLoading) {
    return <Loading />;
  }

  if (["seller", "broker"].includes(role)) {
    return <SellerListingPage />;
  }

  if (role === "admin") {
    return <AdminListingsPage />;
  }

  return <div>Unauthorized</div>;
}
