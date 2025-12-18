# 📘 Readook - AI-Powered Book Marketplace

Readook is a full-stack e-commerce multiseller-admin platform that goes beyond simple buying and selling. It features a sophisticated **Personalized Recommendation Engine** and a **Secure Handshake Delivery System** to ensure high-quality user experience and transaction security.

---

## 🚀 Key Features

### 1. Smart Recommendation Engine
Readook learns user preferences to provide a tailored browsing experience.
* **Interest Profiling:** Utilizes **Mongoose Maps** to track user affinity for specific categories and authors based on ratings and favorites.
* **Weighted Scoring:** Implements a custom algorithm that calculates a "Recommendation Score" using:
  $Score = (InterestWeight \times 10) + GlobalRating$
* **Cold Start Support:** Features "Soft-Auth" middleware to provide guest users with global trends while instantly switching to personalized vectors upon login.

### 2. Secure Handshake Delivery (DVC)
Eliminates fraudulent "delivered" status updates by sellers.
* **Verification Code:** Every order generates a unique **6-digit Delivery Verification Code (DVC)**.
* **Handshake Protocol:** Sellers are restricted from closing an order unless they input the specific code provided by the customer at the point of physical delivery.
* **Backend Validation:** Enforces strict code matching between the request payload and the database before committing status changes.

### 3. Interactive UX & Feedback
* **Dynamic Rating:** Users can rate books post-delivery, which triggers immediate updates to both the global book average and the user's personal interest profile.
* **Real-time Feedback:** Interactive star-rating systems with state-driven UI updates.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Axios, Lucide React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens) with Optional Middleware

---

## 🏗️ Architecture & Logic

### Recommendation Workflow
The engine dynamically generates a personalized feed by filtering out books already in the user's collection and applying a weighted scoring system to the rest:

* **String Normalization:** Converts all category and author keys to lowercase to prevent duplicates (e.g., treating "Self-help" and "Self-Help" as a single interest).
* **Multi-Tiered Weighting:** * **High Impact (Orders/Ratings):** Books ordered and rated 4+ stars provide a significant "booster" to that category in the interest profile.
    * **Moderate Impact (Favorites):** Adding a book to "Favorites" signals intent and increases the category weight, though with a smaller multiplier than a confirmed purchase, allowing the feed to evolve without being dominated by a single click.
* **Score Calculation:**
  $$Score = (InterestWeight \times 10) + GlobalRating$$



### Order Security Flow
1. **Placement:** System generates and stores `deliveryCode`.
2. **Customer View:** The code is displayed exclusively in the User's "Orders" section.
3. **Delivery:** Seller requests the code from the customer.
4. **Verification:** Backend validates `req.body.deliveryCode === order.deliveryCode`.

---

## 🚦 Installation

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/yourusername/readook.git](https://github.com/yourusername/readook.git)

# Navigate to backend
cd backend

# Install dependencies
npm install

# Start the server
npm run dev

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the application
npm run dev
