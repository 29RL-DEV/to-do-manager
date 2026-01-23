✅ To-Do Manager Application

A simple task management application that allows users to manage their personal tasks after logging in.

This project focuses on authentication, state management, and CRUD operations using a real backend service.

📌 What This App Does

Users can sign up and log in

Each user has their own private task list

Users can:

add new tasks

update existing tasks

delete tasks

Tasks are stored securely in a backend database

✨ Key Features

User authentication with Supabase

Protected task management area

Full CRUD functionality for tasks

Persistent data storage

Clean and simple UI

🛠 Tech Stack
Frontend

React

Vite

React Router

Tailwind CSS

Backend / Services

Supabase (Authentication & Database)

📂 Project Structure
to-do-manager/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   └── TaskList.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── api.jsx
│   │   └── supabase.js
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md

🔐 Environment Variables

⚠️ Do not commit .env

Create a local .env file using the example below:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

⚙️ How It Works

Users authenticate via Supabase

Authentication state is managed globally

Authenticated users access the task manager

Tasks are stored and retrieved from the database

UI updates automatically when tasks change

▶️ Run Locally
npm install
npm run dev


The app will be available at:

http://localhost:5173

📊 Project Status

Fully functional

Stable for local use

Built for learning and portfolio purposes

Not intended as a commercial product

🔒 Security Notes

Environment variables are excluded via .gitignore

Authentication is handled by Supabase

No sensitive data is exposed in the client code

🚀 Possible Improvements

Task priorities and due dates

Task categories or labels

UI/UX refinements

Better error handling

📄 License

MIT License