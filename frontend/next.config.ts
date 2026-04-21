import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Mantenemos el modo export para generar archivos estáticos (HTML/CSS/JS)
  output: "export",

  // 2. Opcional: Evita errores de trailing slashes en Azure
  trailingSlash: true,

  images: {
    // 3. CRÍTICO para modo export: 
    // Como no hay servidor Node.js para procesar imágenes, debemos usar 'unoptimized'
    unoptimized: true,

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloudinary.images-iherb.com",
      },
      {
        protocol: "http",
        hostname: "cloudinary.images-iherb.com",
      },
    ],
  },
};

export default nextConfig;