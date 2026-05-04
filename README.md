# ModularCommerce Fullstack 🛒 🇨🇴/🇺🇸

![.NET](https://img.shields.io/badge/.NET-8-blue)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![Google Maps](https://img.shields.io/badge/Google%20Maps-Geocoding-4285F4)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌎 Language / Idioma
- [English](#overview-en)
- [Español](#resumen-es)

---

## <a name="overview-en"></a>Overview (EN)

**ModularCommerce** is a fullstack e-commerce platform designed for small businesses, optimized for frictionless conversion and high logistics precision. It features a robust **.NET 8** backend and a high-performance **Next.js** frontend.

The architecture is built with a **SaaS Multi-tenant** vision, ensuring scalability and modularity from the ground up.

### 🚀 Key AI-Augmented Features
- **Smart Geolocation:** Interactive Google Maps integration allowing users to pinpoint exact delivery locations via draggable markers.
- **Reverse Geocoding:** Automated conversion of map coordinates into human-readable addresses.
- **Intelligent Order Recovery:** A secure post-checkout flow that allows users to correct contact details and delivery locations without losing order state.

---

## <a name="resumen-es"></a>Resumen (ES)

**ModularCommerce** es una plataforma e-commerce de alto impacto diseñada para pequeños negocios, optimizada para una conversión sin fricciones y una alta precisión logística. Cuenta con un backend robusto en **.NET 8** y un frontend de alto rendimiento en **Next.js**.

La arquitectura está construida con una visión **SaaS Multi-tenant**, asegurando escalabilidad y modularidad desde su concepción.

### 🚀 Características Clave (IA-Asistida)
- **Geolocalización Inteligente:** Integración interactiva con Google Maps que permite a los usuarios marcar puntos exactos de entrega mediante marcadores arrastrables.
- **Geocodificación Inversa:** Conversión automática de coordenadas de mapa en direcciones de texto legibles.
- **Recuperación Inteligente de Órdenes:** Flujo seguro post-checkout que permite a los usuarios corregir datos de contacto y ubicación sin perder el estado de la orden.

---

## 🛠 Tech Stack / Tecnologías

### Backend
- **.NET 8** (Web API)
- **Entity Framework Core** (Migrations & Design Time Factory)
- **PostgreSQL 17**
- **Docker**
- **MailKit** (SMTP for OTP & Notifications)
- **JWT Authentication**

### Frontend
- **Next.js (App Router)**
- **TypeScript**
- **Google Maps Platform** (Places & Geocoding API)
- **Zustand** (State Management & Persistence)
- **CSS Modules**

---

## ✨ Features / Funcionalidades

### Orders & Logistics / Órdenes y Logística
- **No-Login Flow:** Guest checkout support for frictionless conversion.
- **Interactive Maps:** Google Maps Selector with real-time address synchronization via draggable pin.
- **Stock Validation:** Real-time frontend validation against backend inventory.
- **OTP Verification:** Secure order confirmation via one-time password.
- **Payment Management:** Receipt upload and manual admin validation.
- **Order Recovery:** Securely update address and phone after order creation.
- **Order Lifecycle Management:** Full status tracking from Pending to Delivered.

### Frontend Experience / Experiencia de Usuario
- **Product Catalog:** Dynamic grouping and category carousels.
- **Live Search:** Debounced product search with instant results.
- **Dynamic Theming:** Configurable branding and UI feedback.
- **Skeleton Loading:** Improved perceived performance during data fetching.
- **Persistent Cart:** Cart state remains safe after page refreshes (localStorage sync).
- **Admin Panel:** Complete dashboard for order and product management.

---

## 🔄 Order Status Flow / Flujo de Estados

- **Pending (Pendiente):** Order created / Orden creada.
- **PaymentPending (Pago Pendiente):** OTP verified / OTP verificado.
- **UnderReview (En Revisión):** Receipt uploaded / Comprobante subido.
- **Paid (Pagado):** Payment approved / Pago aprobado.
- **Rejected (Rechazado):** Payment rejected / Pago rechazado.
- **Preparing (Preparando):** Order being prepared / En alistamiento.
- **Delivered (Entregado):** Order delivered / Entregado.
- **Cancelled (Cancelado):** Cancelled before payment / Cancelado antes del pago.

---

## 📂 Project Structure / Estructura


/backend
  /src
    /ModularCommerce.Api           # Endpoints & Controllers
    /ModularCommerce.Application   # DTOs, Mappers, Business Logic
    /ModularCommerce.Domain        # Entities & Value Objects
    /ModularCommerce.Infrastructure # Data Access, Migrations & External Services

/frontend
  /app
    /(buyer)                       # Public catalog, Checkout & Recovery routes
    /admin                         # Backoffice & Management dashboards
    /login                         # Auth routes
  /components
    /ui                            # Reusable components (MapSelector, Inputs)
    /buyer                         # Catalog & Cart components
    /admin                         # Management dashboards
  /store                           # Zustand stores (Cart, Notifications)
  /hooks                           # Custom React Hooks
  /lib                             # API Client & Utilities

---

## Environment Variables / Variables de Entorno

Create a .env file for backend and .env.local for frontend:

# Backend
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=your_password
JWT_KEY=your_secret
DB_HOST=postgres
DB_PORT=5432
DB_NAME=modularcommerce
DB_USER=your_user
DB_PASSWORD=your_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@email.com
SMTP_PASS=your_password_16chars
STORAGE_RECEIPTS_PATH=receipts

# Frontend
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_URL=http://localhost:8080/api

---

## Running Locally / Ejecución Local

### Backend

docker compose up --build  

API: http://localhost:8080  

---

### Frontend

cd frontend  
npm install  
npm run dev  

App: http://localhost:3000  

---

## Azure Deployment Guide

### Backend

1. Build Docker image  
2. Push to Azure Container Registry  
3. Deploy using Azure Container Apps  

### Database

- Use Azure PostgreSQL Flexible Server  
- Update connection string  

### Frontend

- Deploy to Azure Static Web Apps  
- Configure environment variables  

---

## Multi-Tenant Ready

Prepared for:

- TenantId per entity  
- Domain-based tenant resolution  
- Configurable branding per tenant  

---

## Future Improvements

- Multi-tenant implementation  
- Payment gateway integration  
- Analytics dashboard  

---

## Author

Sebastián Cárdenas - Senior Software Development Engineer

---

## License

MIT
