import DashboardUserProcurementPage from "@/features/dashboard/user/procurement";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Procurement = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "USER") return redirect("/");
  return <DashboardUserProcurementPage />;
};

export default Procurement;