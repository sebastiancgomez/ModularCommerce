
# ModularCommerce Fullstack

![.NET](https://img.shields.io/badge/.NET-8-blue)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

ModularCommerce is a fullstack e-commerce platform designed for small businesses.  
It includes a backend API for order management and a frontend catalog built with Next.js.

The architecture is prepared to evolve into a SaaS multi-tenant solution.

---

## Tech Stack

### Backend
- .NET 8
- Entity Framework Core
- PostgreSQL
- Docker
- MailKit
- JWT Authentication

### Frontend
- Next.js (App Router)
- TypeScript
- CSS Modules
- Zustand (State Management & Persistence)

---

## Features

### Orders
- No-Login Flow: Guest checkout support for frictionless conversion.
- Stock Validation: Real-time frontend validation against backend inventory.
- Persistent Cart: Cart state remains safe after page refreshes (localStorage sync).
- OTP Verification: Secure order confirmation via one-time password.
- Payment receipt upload & Manual validation.
- Order lifecycle management

### OTP
- Code generation
- Expiration control
- Attempt limits

### Payments
- Upload receipts
- Manual validation
- Approval or rejection

### Frontend
- Product catalog
- Category grouping
- Carousel per category
- Dynamic theming
- Live Search: Debounced product search with instant results.
- Dynamic Catalog: Category grouping with optimized carousels.
- Responsive Toast Notifications: Real-time feedback for cart actions.
- Skeleton Loading: Improved perceived performance during data fetching
- Admin panel  

---

## Order Status Flow

- Pending: Order created  
- PaymentPending: OTP verified  
- UnderReview: Receipt uploaded  
- Paid: Payment approved  
- Rejected: Payment rejected  
- Preparing: Order being prepared  
- Delivered: Order delivered  
- Cancelled: Cancelled before payment  

---

## API Endpoints

### Auth
POST /api/auth/login  
Returns JWT token

---

### Orders

POST /api/orders  
Create order

GET /api/orders/{id}  
Get order by id

POST /api/orders/verify-otp  
Verify OTP

POST /api/orders/upload-receipt  
Upload payment receipt

POST /api/orders/{id}/approve  
Approve payment

POST /api/orders/{id}/reject  
Reject payment

POST /api/orders/{id}/prepare  
Mark as preparing

POST /api/orders/{id}/deliver  
Mark as delivered

POST /api/orders/{id}/cancel  
Cancel order

---

### Products

GET /api/products  
List products

GET /api/products/{id}  
Get product

POST /api/products  
Create product

---

## Project Structure

/backend
  /src
    /ModularCommerce.Api          # Endpoints & Controllers
    /ModularCommerce.Application  # DTOs, Mappers, Business Logic
    /ModularCommerce.Domain       # Entities & Value Objects
    /ModularCommerce.Infrastructure # Data Access & External Services

/frontend
  /app
    /(buyer)                      # Public catalog & Checkout routes
    /admin                        # Backoffice routes
    /login                        # Auth routes
  /components
    /buyer                        # Catalog, Search & Cart components
    /admin                        # Management dashboards
  /store                          # Zustand stores (Cart, Notifications)
  /types                          # TypeScript Interfaces (Product, Order, Cart)
  /hooks                          # Custom React Hooks
  /lib                            # API Client & Utilities
docker-compose.yml  
.env  

---

## Environment Variables

Create a .env file:

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

---

## Running Locally

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
