A modern employee file management system with role-based access, file uploads, and detailed compliance reports.

 # Features
 - Role-based authentication (Admin & Employee)
 - Secure file uploads with metadata
 - Monthly file submission reports (uploaded, pending)
 - Admin dashboard with filtering by department, month, and file type
 - JWT-based authentication with protected routes
 - Download uploaded files directly from the reports panel

 # This project is built with:
Frontend:
 - React (with TypeScript + Vite)
 - shadcn-ui
 - Tailwind CSS

Backend:
 - Node.js + Express
 - PostgreSQL
 - Multer (file uploads)
 - JWT Authentication

 # Prerequisites
  Before starting the app, ensure the following are installed and configured:
 
 - Node.js (v18+ recommended)

 - PostgreSQL is running locally or remotely

 - A database must be created

 - Your database credentials should be set in .env

 - Admin user must exist in the database

 - You can insert an admin user manually:
    INSERT INTO users (username, email, password, role, user_status, department, join_date)
    VALUES ('admin', 'admin@example.com', '<hashed_password>', 'admin', 'active', 'HR', CURRENT_DATE);
 
 - Make sure the uploads/ folder exists in the root of the project (or it will be created automatically by Multer on file upload).

To run the app
 # Backend
 - cd server
 - node server.js or npm start

 # Frontend (in another terminal)
 - cd src
 - npm run dev

API Endpoints
 # Authentication
 - POST /api/auth/register

 - POST /api/auth/login

 # Admin
 - GET /api/admin/employees

 - PUT /api/admin/employees/:id

 - PUT /api/admin/employees/:id/status

 # Files
 - POST /api/files/upload

 - GET /api/files/:id/download

 - GET /api/files/mine

 # Reports
 - GET /api/reports/uploaded?month=2025-06&fileType=...&department=...