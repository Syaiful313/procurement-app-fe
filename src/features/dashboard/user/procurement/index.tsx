import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProcurementPage from "@/features/dashboard/user/procurement/components/Procurement";
import { AppSidebarUser } from "../components/AppSidebarUser";
import { SiteHeaderUser } from "../components/SiteHeaderUser";

export default function DashboardUserProcurementPage() {
  return (
    <SidebarProvider>
      <AppSidebarUser variant="inset" />
      <SidebarInset>
        <SiteHeaderUser />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <ProcurementPage />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
