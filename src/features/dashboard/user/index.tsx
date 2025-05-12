import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProcurementsUserTable } from "@/features/dashboard/user/components/ProcurementsUserTable";
import { AppSidebarUser } from "./components/AppSidebarUser";
import { SiteHeaderUser } from "./components/SiteHeaderUser";

export default function DashboardUserPage() {
  return (
    <SidebarProvider>
      <AppSidebarUser variant="inset" />
      <SidebarInset>
        <SiteHeaderUser />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Pengadaan barang</h1>
            <p className="text-muted-foreground mt-1">
              Halaman ini menampilkan semua pengadaan barang yang telah Anda
              buat. Anda dapat mengelola pengadaan barang Anda di sini.
            </p>
          </div>
          <ProcurementsUserTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
