import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/supabase";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SellerDashboard from "@/components/dashboard/SellerDashboard";
import BrokerDashboard from "@/components/dashboard/BrokerDashboard";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "buyer";
  const userName = profile?.full_name ?? "";

  if (role === "admin") {
    return <AdminDashboard userName={userName} />;
  }

  if (role === "seller") {
    return <SellerDashboard userId={user.id} userName={userName} />;
  }

  if (role === "broker") {
    return <BrokerDashboard userId={user.id} userName={userName} />;
  }

  // Default: buyer
  return <BuyerDashboard userId={user.id} userName={userName} />;
}
