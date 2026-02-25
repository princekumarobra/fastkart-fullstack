# Complete E-commerce Backend (Node.js, Express, MongoDB)

This is a complete backend implementation as requested, built alongside a full modern React storefront and Admin dashboard.

## Folder Structure
As requested, your backend structure is implemented within the `/server` directory:
- `/server/models/` - Contains Mongoose schemas (User, Product, Order, Cart)
- `/server/middleware/` - Contains JWT auth middleware and Admin authorization checks
- `/server/utils/` - Contains Razorpay utility and signature verification
- `/server/routes.ts` - Acts as the primary router and controller index, binding API endpoints exactly as requested.
- `/server/db.ts` - Handles MongoDB connection setup

## Required Environment Variables
To run this application, you must provide your own credentials in the Replit Secrets tool (or create a `.env` file for local development outside Replit).

Use the `Secrets` tool in Replit (the lock icon in the sidebar) to add the following:
- `MONGO_URI`: Your MongoDB connection string (e.g., MongoDB Atlas)
- `JWT_SECRET`: A secure random string for JWT token generation
- `RAZORPAY_KEY_ID`: Your Razorpay test Key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay test Key Secret

An example `.env.example` file is included in the project root.

## How to Run in Replit
1. Ensure all packages are installed (`npm install` is run automatically).
2. Set your environment variables in the **Secrets** tool.
3. Click the **Run** button at the top of the Replit workspace.
4. The application will start both the frontend Vite server and the Node.js Express backend. MongoDB will connect on startup.
5. If the database is empty, the server will automatically seed an Admin user (`admin@example.com` / `admin123`) and some sample products.

## Example API Requests (Backend)
Here are examples of how to interact with the backend APIs directly via curl or Postman:

**1. Login to get JWT Token:**
```bash
curl -X POST https://your-repl-url.replit.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**2. Create a Product (Admin Only):**
```bash
curl -X POST https://your-repl-url.replit.dev/api/products \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Earbuds",
    "description": "High quality audio",
    "price": 49.99,
    "category": "Mobile accessories",
    "image": "https://example.com/image.png",
    "stock": 100
  }'
```

**3. Get All Products:**
```bash
curl -X GET "https://your-repl-url.replit.dev/api/products?page=1&limit=10"
```

## Bulk Upload (CSV)
A `sample_products.csv` file has been generated in the root of the project. Admin users can upload this CSV via the frontend dashboard or directly via the `/api/products/bulk` endpoint.
