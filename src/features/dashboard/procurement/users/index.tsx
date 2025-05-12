import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebarProcurement } from "../components/AppSidebarProcurement";
import { SiteHeaderProcurement } from "../components/SiteHeaderProcurement";
import { UsersTable } from "./components/UsersTable";

export default function DashboardProcurementUsersPage() {
  return (
    <SidebarProvider>
      <AppSidebarProcurement variant="inset" />
      <SidebarInset>
        <SiteHeaderProcurement />
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Daftar Pengguna</h1>
            <p className="text-muted-foreground mt-1">
              Halaman ini menampilkan daftar pengguna yang terdaftar dalam
              sistem. Anda dapat mengelola pengguna, termasuk menambah dan
              menghapus pengguna sesuai kebutuhan.
            </p>
          </div>
          <UsersTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
