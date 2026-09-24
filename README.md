# Product Admin Dashboard

Welcome! This is a modern, easy-to-use web application built to help manage and organize products smoothly. It connects to an online product database to give you a complete store management system.

---

## 🌟 What This App Can Do

- **Keep Your Place in the Link:**
  Whenever you search for something, change pages, or sort products, the web link at the top updates automatically. If you copy that link and send it to a friend—or refresh your browser page—you will land right back on the exact same view.
- **Manage Products Instantly (Add, Edit, Delete):**
  Because the online test database doesn't permanently save changes on its main server, this app saves your changes right on your screen instantly. You can add a new product, edit its details, or delete items smoothly without breaking anything.
- **Upload Pictures & Set Details:**
  When adding or editing a product, you can upload a photo straight from your computer (with an instant live preview), set how many items are in stock, change prices, and give star ratings (from 0 to 5) using a clean form window.
- **Fast Typing Without Errors:**
  If you type very quickly in the search bar, the app is smart enough to ignore slow old answers and always show you the most up-to-date search results.
- **Safe and Secure Connections:**
  All communication with the server is handled securely behind the scenes. It automatically manages your login tokens and handles any unexpected login issues in one central place.
- **Won't Crash on Mistakes:**
  If someone types weird things into the web link address (like letters instead of page numbers), the app won't break—it safely guides you back to a normal page.

---

## 📂 Project Structure

product-admin-dashboard/
├── src/
│   ├── app/
│   │   ├── login/                 # Authentication pages
│   │   ├── products/              # Product management routes
│   │   │   ├── [id]/              # Dynamic product detail route
│   │   │   ├── layout.jsx         # Products layout wrapper
│   │   │   ├── page.jsx           # Server Component wrapper (force-dynamic & Suspense)
│   │   │   └── ProductsClient.jsx # Client Component dashboard with full interactive logic
│   │   ├── favicon.ico
│   │   ├── globals.css            # Tailwind CSS global styles
│   │   ├── layout.js              # Root application layout
│   │   └── page.js                # Root page redirect
│   ├── components/                # Reusable UI components
│   │   ├── ConfirmModal.jsx       # Modal for confirming product deletions
│   │   ├── Pagination.jsx         # Page navigation component
│   │   ├── ProductCardList.jsx    # Mobile view product cards grid
│   │   ├── ProductFormModal.jsx   # Modal for adding and editing products
│   │   └── ProductTable.jsx       # Desktop product table view
│   └── services/                  # API service layer
│       ├── api.js                 # Centralized Axios client setup
│       ├── authService.js         # Authentication handling services
│       └── productService.js      # Product CRUD operations and search
├── public/                        # Static assets and icons
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json                   # Project dependencies and scripts
├── postcss.config.mjs             # PostCSS configuration for Tailwind
└── README.md

---

## 📂 Project Structure (Behind the Scenes)

- **`src/services/api.js`**: Centralized connection setup that automatically handles security tokens and error checking for all requests.
- **`src/services/productService.js`**: Manages all communication with the product database (fetching, searching, categories, adding, updating, deleting).
- **`src/app/products/page.jsx`**: The main dashboard screen that controls what you see, filters, sorting, page numbers, and popups.
- **`src/components/ProductFormModal.jsx`**: A clean popup form window used for adding or editing products, handling image uploads, prices, stock, and ratings.
- **`src/components/ConfirmModal.jsx`**: A quick confirmation message popup to make sure you really want to delete a product before it's removed.

---

## 🛠️ Tech Stack

- **Frontend Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **API Client:** Axios
- **Data Source:** DummyJSON API

---

## 🚀 Getting Started & Running Locally

Want to run this app on your computer? Just follow these simple steps:

1. **Clone the Repository:**

git clone [https://github.com/maazzafar1234/product-admin-dashboard.git](https://github.com/maazzafar1234/product-admin-dashboard.git)
cd product-admin-dashboard

2. **Install dependencies:**

npm install

3.**run the development server:**

npm run dev
