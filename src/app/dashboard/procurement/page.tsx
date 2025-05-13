import DashboardProcurementPage from "@/features/dashboard/procurement";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardProcurement = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "PROCUREMENT") return redirect("/");
  return <DashboardProcurementPage />;
};

export default DashboardProcurement;
