# 📘 Readook - AI-Powered Book Marketplace

Readook is a full-stack MERN marketplace that blends modern e-commerce with AI and ML based recommendation systems. It features intelligent book discovery powered by Google Gemini, personalized recommendations,role-based multi-vendor management, secure delivery verification and password change feature.
---

# 🚀 Key Features

## 🤖 AI-Powered Discovery & Recommendation System

Readook combines traditional ML based recommendation engine using weighted scoring technique with Generative AI to create an intelligent book discovery experience.

### AI Discovery Assistant

Powered by **Google Gemini 2.5 Flash**

Users can search naturally using queries such as:

```text
Books about habit building
Hindi motivational books
Books similar to Atomic Habits
Finance books for beginners
```

Gemini extracts:

* Author preferences
* Language preferences
* Categories
* Search keywords

The extracted data is then used to search marketplace inventory intelligently.

---

### AI Description Generator

Sellers can only provide:

```text
Book Title
Author Name
```

for Gemini to automatically generate:

* Professional marketplace description
* Book category

This significantly reduces listing effort and improves listing quality.

---

### AI Keyword Generation

For every book, Gemini-API generates searchable metadata:

```text
Author Keywords
Category Keywords
Search Keywords
Discovery Keywords
```

Example:

```text
Atomic Habits

Keywords:
habits
discipline
productivity
self improvement
james clear
success
```

---

### Hybrid Recommendation Engine

Readook does not directly return AI responses.

Instead:

```text
Gemini extracts intent
↓
Keywords generated
↓
Books filtered
↓
Weighted scoring applied
↓
Best matches returned
```

This produces faster, explainable, and inventory-aware recommendations.

---

## 🎯 Personalized Recommendation Engine

Readook learns user preferences over time.

### Interest Profiling

Uses **Mongoose Maps** to maintain user affinity vectors for:

* Categories
* Authors

Based on:

* Ratings
* Favourites
* Orders

---

### Weighted Scoring

Recommendation Score:

```text
Score = (InterestWeight × 10) + GlobalRating
```

Books are ranked according to both:

* User preference
* Platform-wide quality

---

### Multi-Tier Learning

#### High Impact Actions

* Orders
* Ratings

These provide strong positive signals.

#### Medium Impact Actions

* Adding books to favourites

Provides intent signals without dominating recommendations.

---

### Cold Start Support

Guest users receive:

```text
Global Trending Books
```

Authenticated users receive:

```text
Personalized Recommendations
```

using soft-auth recommendation middleware.

---

## 🔐 Secure Handshake Delivery System

Prevents fraudulent delivery confirmations.

### Delivery Verification Code

Every order generates a unique:

```text
6-Digit Delivery Verification Code
```

---

### Delivery Flow

#### 1. Order Placement

System generates:

```text
deliveryCode
```

and stores it securely.

#### 2. Customer Access

The code is visible only inside the user's order section.

#### 3. Physical Delivery

Seller requests the code from the customer.

#### 4. Verification

Backend validates:

```js
req.body.deliveryCode === order.deliveryCode
```

before updating order status.

---

### Security Benefits

* Prevents fake deliveries
* Protects buyers
* Prevents seller abuse
* Creates a verified delivery handshake

---

# 🔒 Authentication & Security

## JWT Authentication

* Access Token Architecture
* Refresh Token Architecture
* Refresh Token Rotation
* Protected Routes

---

## Password Security

* bcrypt Password Hashing
* Secure Password Storage
* Password Reset Flow

---

## Email Verification

Implemented using:

```text
Nodemailer + OTP Verification
```

Features:

* Mandatory email verification before registration
* Expiring OTPs
* Duplicate account prevention

Flow:

```text
Enter Email
↓
Receive OTP
↓
Verify OTP
↓
Account Created
```

---

## Forgot Password System

Secure OTP-based password reset.

Flow:

```text
Forgot Password
↓
Enter Email
↓
Receive OTP
↓
Verify OTP
↓
Set New Password
↓
Redirect To Login
```

---

## Authorization

Role-Based Access Control:

```text
User
Seller
Admin
```

Backend-enforced authorization protects:

* Admin Routes
* Seller Actions
* Ownership-based operations

---

# 📦 Marketplace Features

## User Features

* Browse books
* View book details
* Add favourites
* Place orders
* View order history
* Rate purchased books
* Manage profile

---

## Seller Features

* Add books
* Edit books
* Delete books
* AI-generated descriptions
* AI-generated keywords

---

## Admin Features

* Manage sellers
* Manage orders
* Handle complaints
* Blacklist malicious users
* Platform moderation

---

# ⭐ Interactive Rating System

Users can rate books after successful delivery.

Features:

* Dynamic star rating UI
* Real-time feedback
* Recommendation profile updates
* Global rating recalculation

---

# 📜 Snapshot-Based Order Storage

When an order is placed:

```text
Book Snapshot Stored
```

Benefits:

* Preserves order history
* Prevents broken orders
* Supports deleted books safely

---

# 🛡️ Security Highlights

* JWT Authentication
* Refresh Tokens
* bcrypt Password Hashing
* OTP Email Verification
* Forgot Password OTP Flow
* Protected Backend Routes
* Ownership Verification
* Role-Based Authorization
* HTTP-Only Refresh Token Cookies
* Delivery Verification Codes
* Request Validation

---

# 🛠️ Tech Stack

## Frontend

```text
React.js
Redux Toolkit
React Router
Tailwind CSS
Axios
```

## Backend

```text
Node.js
Express.js
JWT
bcrypt
Nodemailer
Google Gemini API
```

## Database

```text
MongoDB
Mongoose
```

## AI

```text
Google Gemini 2.5 Flash
```

---

# 🏗️ Architecture Highlights

* RESTful API Architecture
* Role-Based Access Control
* Recommendation Engine
* AI-Powered Search Layer
* Snapshot Order System
* Refresh Token Authentication
* Multi-Vendor Marketplace Architecture

---

# 🚦 Installation

## Clone Repository

```bash
git clone https://github.com/Venu4i/Readook.git
```

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔮 Future Enhancements

* Seller Analytics Dashboard
* Book Reviews with sentiment analysis
* Wishlist Notifications
* Payment Gateway Integration

---

# 👨‍💻 Author

**Venu Verma**

Readook demonstrates practical implementation of:

* Full Stack MERN Development
* Authentication & Security
* Recommendation Systems
* AI Integration
* REST API Design
* MongoDB Data Modeling
* Marketplace Architecture
* Role-Based Authorization
