import { Suspense } from "react"; // 1. Importamos Suspense
import BuyerHeader from '@/components/buyer/BuyerHeader';
import Navbar from '@/components/buyer/Navbar';
import CartDrawer from "@/components/buyer/CartDrawer"; 
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <>
        <Suspense fallback={<div style={{ height: '70px', background: '#1a1a1a' }} />}>
          <BuyerHeader />
        </Suspense>
      <Navbar />
      <Breadcrumbs />
        <CartDrawer /> 
        <main>
          {children}
        </main>
      </>
  );
}