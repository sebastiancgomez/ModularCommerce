import Header from "./Header";
import Navbar from "@/components/Navbar";

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <Navbar />

      <main style={{ padding: 20 }}>
        {children}
      </main>
    </div>
  );
}