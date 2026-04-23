// app/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="theme-light">
        {children} {/* Aquí se inyectará el layout del grupo correspondiente */}
      </body>
    </html>
  );
}