# DevTrail-backend

# 🔐 Authentication System (Node.js + Express + MongoDB + Clerk)

This project implements a **complete authentication system** with both **traditional email/password login** and **GitHub OAuth via Clerk**.  
It’s beginner-friendly, well-structured, and uses **secure practices** like JWT in cookies, bcrypt for hashing, and rate limiting.

---

## 📂 Project Overview

- **Register & Login with Email/Password**  
- **GitHub OAuth login** (via Clerk)  
- **JWT-based authentication** stored in **HTTP-only cookies**  
- **MongoDB persistence** (users saved in database)  
- **Secure password hashing** with bcrypt  
- **Rate limiting** to prevent brute force attacks  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/warrior-site/DevTrail-backend.git
cd DevTrail-backend
flowchart TD
    A[User Registers / Logs In] --> B{Valid?}
    B -- No --> X[Error Response]
    B -- Yes --> C[Hash Password / Verify Password]
    C --> D[Save/Find User in MongoDB]
    D --> E[Generate JWT Token]
    E --> F[Set HTTP-only Cookie]
    F --> G[User Authenticated]

    A2[GitHub OAuth via Clerk] --> H[Verify Clerk Session Token]
    H --> D2[Check User in MongoDB]
    D2 -->|If Not Found| C2[Create New User]
    D2 --> E2[Generate JWT Token]
    E2 --> F2[Set HTTP-only Cookie]
    F2 --> G2[User Authenticated]

