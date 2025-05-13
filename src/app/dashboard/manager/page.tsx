import DashboardManagerPage from "@/features/dashboard/manager";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardManager = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "MANAGER") return redirect("/");
  return <DashboardManagerPage />;
};

export default DashboardManager;
