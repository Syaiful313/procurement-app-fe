import DashboardProcurementUsersPage from "@/features/dashboard/procurement/users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardProcurementUsers = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "PROCUREMENT") return redirect("/");
  return <DashboardProcurementUsersPage />;
};

export default DashboardProcurementUsers;
