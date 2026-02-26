## Packages
framer-motion | Page transitions and sleek micro-interactions for a premium feel
recharts | Data visualization for the Admin Dashboard metrics
lucide-react | High-quality icons for UI elements

## Notes
- JWT Authentication relies on `localStorage` storing `token` and `user`. The frontend will attach `Authorization: Bearer <token>` to all API requests.
- Razorpay script (`https://checkout.razorpay.com/v1/checkout.js`) is dynamically injected during the online checkout flow.
- Ensure the backend allows `Content-Type: multipart/form-data` without explicitly setting the header in `fetch` (the browser sets it automatically with the correct boundary).
- If Razorpay `key_id` is not exposed to the client, the checkout might fail in a real environment unless the key is injected, but the UI flow is completely modeled.
