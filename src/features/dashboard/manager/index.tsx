import { ProcurementsTable } from "@/components/ProcurementsTable";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarManager } from "./components/AppSidebarManager";
import { SiteHeaderManager } from "./components/SiteHeaderManager";

export default function DashboardManagerPage() {
  return (
    <SidebarProvider>
      <AppSidebarManager variant="inset" />
      <SidebarInset>
        <SiteHeaderManager />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pengadaan barang</h1>
            <p className="text-muted-foreground mt-1">
              Halaman ini menampilkan semua pengadaan barang yang telah karyawan
              buat. Anda dapat melihat pengadaan barang karyawan di sini.
            </p>
          </div>
          <ProcurementsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
