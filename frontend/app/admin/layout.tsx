import AdminHeader from "@/components/admin/AdminHeader";
import AdminNavbar from "@/components/admin/AdminNavBar";


export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  
  return (
    <div>
      <AdminHeader />
      <AdminNavbar />
      <main className="page">{children}</main>
    </div>
  );
}