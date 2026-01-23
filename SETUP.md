# Getting Started with To-Do Manager

## Overview

This is the **frontend** of a task management app. The **backend** runs on Supabase (a backend-as-a-service platform).

## Setup

### Prerequisites

- Node.js 14+
- npm or yarn
- Supabase account (free at supabase.com)

### Backend Setup (Supabase)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Sign up free
   - Create a new project

2. **Create Database Tables**

   Run this SQL in Supabase SQL Editor:

   ```sql
   -- Users table (auto-created by Supabase Auth)

   -- Tasks table
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     description TEXT,
     status TEXT DEFAULT 'todo', -- 'todo', 'in-progress', 'done'
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Enable RLS (Row Level Security)
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

   -- Users can only see their own tasks
   CREATE POLICY "Users can read own tasks"
   ON tasks FOR SELECT
   USING (auth.uid() = user_id);

   CREATE POLICY "Users can create tasks"
   ON tasks FOR INSERT
   WITH CHECK (auth.uid() = user_id);

   CREATE POLICY "Users can update own tasks"
   ON tasks FOR UPDATE
   USING (auth.uid() = user_id);

   CREATE POLICY "Users can delete own tasks"
   ON tasks FOR DELETE
   USING (auth.uid() = user_id);
   ```

3. **Get Your API Keys**
   - In Supabase Project Settings → API
   - Copy `Project URL` and `anon public key`

### Frontend Setup

1. **Clone/Download**

   ```bash
   cd to-do-manager
   ```

2. **Create .env file**

   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

4. **Run Development Server**

   ```bash
   npm run dev
   ```

   Open `http://localhost:5173`

## How It Works

- **Authentication**: Supabase handles user signup/login
- **Tasks Storage**: All tasks saved in Supabase database
- **Real-time Updates**: Changes sync instantly
- **Auto-refresh**: Token refreshes automatically when expired

## Project Structure

```
src/
├── components/
│   ├── LoginForm.jsx      # Sign up / Login
│   ├── TaskForm.jsx       # Create/edit tasks
│   ├── TaskList.jsx       # Display all tasks
│   ├── TaskItem.jsx       # Single task card
│   └── ResetPassword.jsx  # Password reset
├── lib/
│   └── supabase.js        # Supabase client setup
├── App.jsx                # Main app
└── index.jsx              # Entry point
```

## API Calls Made

The app calls Supabase directly (no custom backend needed!):

- **Auth**: User signup, login, logout, password reset
- **Tasks**: CRUD operations (Create, Read, Update, Delete)

All requests include the user's auth token automatically.

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect repo to Vercel (https://vercel.com)
3. Add environment variables:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```
4. Deploy!

## Common Issues

**"Missing Supabase credentials"**

- Check your `.env` file has the right keys
- Keys must start with `VITE_` in frontend

**Tasks not saving**

- Check browser console for errors
- Verify Supabase project is active
- Check RLS policies are set up correctly

**Can't login**

- Make sure email confirmation is enabled in Supabase
- Or disable email confirmation in Auth settings

## Next Steps

- Add task categories/tags
- Add due dates and reminders
- Add task priority levels
- Share tasks with other users

---

**This is a learning project showing how to build a modern web app with React + Supabase.** 🎯
