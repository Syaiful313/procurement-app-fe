import DashboardUserPage from "@/features/dashboard/user";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const DashboardUser = async () => {
  const session = await auth();

  if (!session) return redirect("/login");
  if (session.user.role !== "USER") return redirect("/");
  return <DashboardUserPage />;
};

export default DashboardUser;
