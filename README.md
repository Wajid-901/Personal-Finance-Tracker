# Personal Finance Tracker (MERN Stack)

A modern, full-stack personal finance tracker built with the MERN stack (MongoDB, Express, React, Node.js). Features secure authentication, data visualization, and comprehensive expense management.

## 🚀 Features

-   **Authentication**: Secure JWT-based login, registration, and password reset.
-   **Dashboard**: Real-time overview of balance, income, expenses, and visual charts (Pie, Bar, Area).
-   **Transactions**: Add, edit, delete, and filter transactions by type and category.
-   **Categories**: Manage custom categories with icons and colors.
-   **Profile Management**: Update profile details, change password, and upload profile picture.
-   **Settings**: Dark/Light mode, currency selection (USD, EUR, INR), and PDF export.
-   **Responsive Design**: Fully responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB (Atlas)
-   **Authentication**: JWT, bcryptjs
-   **Email**: Nodemailer (Brevo/SMTP)

## 📦 Installation & Setup

### Prerequisites

-   Node.js (v16+)
-   MongoDB Atlas Account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/Wajid-901/Personal-Finance-Tracker.git
cd Personal-Finance-Tracker
```

### 2. Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory with the following variables:
    ```env
    NODE_ENV=development
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_jwt_secret
    
    # Email Configuration (Brevo/SMTP)
    SMTP_HOST=smtp-relay.brevo.com
    SMTP_PORT=587
    SMTP_EMAIL=your_smtp_email
    SMTP_PASSWORD=your_smtp_password
    FROM_EMAIL=your_sender_email
    FROM_NAME=Expense Tracker
    ```
4.  Start the backend server:
    ```bash
    npm run dev
    ```

### 3. Frontend Setup

1.  Open a new terminal and navigate to the root directory:
    ```bash
    cd ..
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4.  Start the frontend development server:
    ```bash
    npm run dev
    ```

## 🚀 Deployment

### Backend (Railway/Render)
1.  Push code to GitHub.
2.  Connect repository to Railway/Render.
3.  Set environment variables in the dashboard.
4.  Deploy!

### Frontend (Vercel/Netlify)
1.  Push code to GitHub.
2.  Connect repository to Vercel/Netlify.
3.  Set `VITE_API_URL` environment variable to your deployed backend URL.
4.  Deploy!

## 📄 License

This project is licensed under the MIT License.
