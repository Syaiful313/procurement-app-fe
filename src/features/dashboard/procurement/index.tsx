import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarProcurement } from "./components/AppSidebarProcurement";
import { ProcurementsTable } from "./components/ProcurementsTable";
import { SiteHeaderProcurement } from "./components/SiteHeaderProcurement";

export default function DashboardProcurementPage() {
  return (
    <SidebarProvider>
      <AppSidebarProcurement variant="inset" />
      <SidebarInset>
        <SiteHeaderProcurement />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pengadaan barang</h1>
            <p className="text-muted-foreground mt-1">
              Halaman ini menampilkan semua pengadaan barang yang telah karyawan
              buat. Anda dapat mengelola pengadaan barang karyawan di sini.
            </p>
          </div>
          <ProcurementsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
