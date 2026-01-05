Full-Stack Authentication and CRUD Application (Node.js)
==========================================================================================================================================================
Overview:
----------------------------------------------------------------------------------------------------------------------------------------------------------
This project is a full-stack Node.js application that combines a secure authentication system and a protected CRUD dashboard within a single codebase. 
It includes user signup, login with email verification, JWT-based authentication, and an admin dashboard for managing Data records. 
The application is built using Express, SQLite, and a frontend (HTML, CSS, JavaScript) 
and can also be packaged into a standalone Windows executable using pkg.


Project Highlights:
----------------------------------------------------------------------------------------------------------------------------------------------------------
1. Secure authentication and authorization using JWT.
2. Email verification flow during signup.
3. Protected CRUD operations for Data management.
4. SQLite database for lightweight persistence.
5. Frontend without frameworks.
6. Can be packaged into a Windows executable (.exe).
7. Automatic browser launch on application start (exe mode).


Authentication Features:
----------------------------------------------------------------------------------------------------------------------------------------------------------
1. User signup with email and password.
2. Email verification using Nodemailer and Gmail SMTP.
3. Login only allowed after email verification.
4. JWT token generation on successful login.
5. Token-based route protection using middleware.
6. Automatic redirect on unauthorized access.
7. Data Management (CRUD Dashboard).
8. Accessible only after successful authentication..


Features include:
----------------------------------------------------------------------------------------------------------------------------------------------------------
1. Create new Data records.
2. Read and display tenant data from SQLite database.
3. Update tenant information using a modal form.
4. Delete tenant records.
5. Automatic table refresh after create, update, and delete operations.
6. All CRUD routes protected using JWT authentication.


Tech Stack:
----------------------------------------------------------------------------------------------------------------------------------------------------------
Backend:
1. Node.js
2. Express.js
3. SQLite3
4. JSON Web Token (JWT)
5. UUID
6. Nodemailer

Frontend:
1. HTML
2. CSS
3. JavaScript

Desktop Packaging: 
----------------------------------------------------------------------------------------------------------------------------------------------------------
pkg (Windows executable support)


Project Structure
----------------------------------------------------------------------------------------------------------------------------------------------------------
project/

│

├── public/

│     ├── index.html----------------------Login and Signup UI

│     ├── dashboard.html------------------Admin dashboard with CRUD

│     ├── script.js-----------------------Frontend logic

│     └── style.css-----------------------Styling

│

├── server.js-------------Express server and routes

├── db.js-----------------SQLite database configuration

├── users.db--------------SQLite database file

├── .env------------------Environment variables

├── package.json



Running the Project Locally:
----------------------------------------------------------------------------------------------------------------------------------------------------------
Install dependencies:
      npm install

Start the server:
      node server.js

Open in browser:
      http://localhost:3000

Building Windows Executable:
Build the executable:
      pkg . --targets node18-win-x64 --output app.exe

Run:
      app.exe
      

Learning Outcomes Demonstrated:
----------------------------------------------------------------------------------------------------------------------------------------------------------
1. End-to-end authentication flow implementation.
2. Secure route protection using middleware.
3. Frontend and backend integration.
4. Database design and persistence using SQLite.
5. Handling real-world deployment constraints.
6. Packaging a Node.js application as a desktop executable.
