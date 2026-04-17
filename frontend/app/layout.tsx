import "./globals.css";
type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="es">
      <body className="theme-light">
        {children}
      </body>
    </html>
  );
}