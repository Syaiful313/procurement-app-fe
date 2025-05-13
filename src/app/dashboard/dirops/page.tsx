import DashboardDiropsPage from "@/features/dashboard/dirops";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardDirops = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "DIROPS") return redirect("/");
  return <DashboardDiropsPage />;
};

export default DashboardDirops;
