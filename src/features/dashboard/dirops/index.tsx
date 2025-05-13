import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarUser } from "./components/AppSidebarDirops";
import { SiteHeaderDirops } from "./components/SiteHeaderDirops";
import { ProcurementsTable } from "@/components/ProcurementsTable";

export default function DashboardDiropsPage() {
  return (
    <SidebarProvider>
      <AppSidebarUser variant="inset" />
      <SidebarInset>
        <SiteHeaderDirops />
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
