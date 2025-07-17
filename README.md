# Ecommerce Fullstack Project

A modern, full-featured ecommerce platform with admin dashboard, user authentication, product management, order management, and responsive UI.

## Features

- User authentication (register, login, password reset)
- User profile with order history
- Admin dashboard for managing products and orders
- Product catalog with search, filtering, and carousel
- Shopping cart and checkout with Stripe integration
- Image upload via Cloudinary
- Email notifications (e.g., password reset)
- Responsive, modern UI (React + Tailwind CSS)

## Tech Stack

- **Frontend:** React, Redux Toolkit, React Router, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Stripe, Cloudinary, Nodemailer

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas or local MongoDB instance
- Cloudinary account (for image uploads)
- Gmail account (for email notifications)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ecommerce-fullstack
```

### 2. Setup Environment Variables

Create a `.env` file in `backend/` with the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
```

> **Note:** For Gmail, you may need to use an [App Password](https://support.google.com/accounts/answer/185833?hl=en) if 2FA is enabled.

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the Application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend

```bash
cd ../frontend
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

---

## Folder Structure

```
ecommerce-fullstack/
  backend/      # Express API, models, controllers, routes
  frontend/     # React app, components, pages, Redux slices
```

---

## Usage Notes

- Admin features are accessible only to users with admin role.
- Product and order management is available via the admin dashboard.
- Image uploads use Cloudinary; ensure your credentials are correct.
- Email notifications use Gmail SMTP; ensure your credentials are correct.
- Stripe is used for payment processing in checkout.

---

## API Routes

### Auth

- `POST   /api/auth/register` — Register a new user
- `POST   /api/auth/login` — Login
- `POST   /api/auth/logout` — Logout
- `GET    /api/auth/check` — Check authentication status
- `POST   /api/auth/forgot-password` — Request password reset
- `POST   /api/auth/reset-password/:token` — Reset password

### User

- `GET    /api/user/profile` — Get user profile (auth required)
- `PUT    /api/user/profile` — Update user profile (auth required)

### Products (User)

- `GET    /api/products/` — List all products
- `GET    /api/products/top-selling` — Top selling products
- `GET    /api/products/new` — New products
- `GET    /api/products/:id` — Get product by ID

### Orders (User)

- `POST   /api/orders/` — Create order
- `POST   /api/orders/myorders` — Get my orders (auth required)
- `GET    /api/orders/:id` — Get order by ID (auth required)
- `PUT    /api/orders/:id/status` — Update order status (admin only)
- `GET    /api/orders/` — Get all orders (admin only)

### Cart

- `GET    /api/cart/` — Get user cart (auth required)
- `POST   /api/cart/add` — Add item to cart (auth required)
- `POST   /api/cart/remove` — Remove item from cart (auth required)
- `POST   /api/cart/clear` — Clear cart (auth required)

### Checkout

- `POST   /api/checkout/create-checkout-session` — Create Stripe checkout session (auth required)
- `POST   /api/checkout/process-order` — Process order after payment (auth required)

### Images

- `POST   /api/image/upload` — Upload image to local storage
- `POST   /api/image/cloudinary` — Upload image to Cloudinary
- `POST   /api/image/remove` — Remove local image

### Admin (all require admin role)

- `GET    /api/admin/orders` — List all orders
- `GET    /api/admin/orders/stats` — Order statistics
- `GET    /api/admin/orders/status/:status` — Orders by status
- `GET    /api/admin/orders/:id` — Get order by ID
- `PUT    /api/admin/orders/:id/status` — Update order status
- `DELETE /api/admin/orders/:id` — Delete order
- `GET    /api/admin/products` — List all products
- `GET    /api/admin/products/stats` — Product statistics
- `GET    /api/admin/products/search` — Search products
- `GET    /api/admin/products/:id` — Get product by ID
- `POST   /api/admin/products` — Create product (with image upload)
- `PUT    /api/admin/products/:id` — Update product (with image upload)
- `DELETE /api/admin/products/:id` — Delete product

---

## License

This project is licensed under the MIT License.
