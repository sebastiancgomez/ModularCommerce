"use client";
import LoginHeader from "@/components/login/LoginHeader";


type Props = {
  children: React.ReactNode;
};

export default function LoginLayout({ children }: Props) {
  return (
    <>
        <LoginHeader/>
        <main>
          {children}
        </main>
      </>
  );
}