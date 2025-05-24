import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarProcurement } from "../components/AppSidebarProcurement";
import { SiteHeaderProcurement } from "../components/SiteHeaderProcurement";
import { ProcurementsHistoriesTable } from "./components/ProcurementsHistoriesTable";

export default function DashboardProcurementHistoriesPage() {
  return (
    <SidebarProvider>
      <AppSidebarProcurement variant="inset" />
      <SidebarInset>
        <SiteHeaderProcurement />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Riwayat Pengadaan</h1>
            <p className="text-muted-foreground mt-1">
                Halaman ini menampilkan riwayat pengadaan yang telah dilakukan
                sebelumnya. Anda dapat melihat detail pengadaan dengan mengklik
                tombol di bawah ini.
            </p>
          </div>
          <ProcurementsHistoriesTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
