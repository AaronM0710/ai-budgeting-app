# AI Budgeting App - Complete Setup Guide

This guide will walk you through setting up and running the application from scratch.

## Prerequisites

Before you begin, make sure you have these installed:

### 1. Node.js (v18 or higher)
Check if you have it:
```bash
node --version
```

If not installed, download from: https://nodejs.org/

### 2. PostgreSQL (v14 or higher)
Check if you have it:
```bash
psql --version
```

If not installed:
- **Mac**: `brew install postgresql@14`
- **Windows**: Download from https://www.postgresql.org/download/
- **Linux**: `sudo apt-get install postgresql-14`

### 3. Git
Check if you have it:
```bash
git --version
```

If not installed, download from: https://git-scm.com/

## Step-by-Step Setup

### Step 1: Navigate to the Project

```bash
cd ai-budgeting-app
```

### Step 2: Set Up the Database

#### Start PostgreSQL (if it's not running)

**Mac:**
```bash
brew services start postgresql@14
```

**Linux:**
```bash
sudo service postgresql start
```

**Windows:**
PostgreSQL should auto-start. If not, use Services app.

#### Create the Database

```bash
# Open PostgreSQL shell
psql postgres

# In the psql shell, run:
CREATE DATABASE budgeting_app;

# Exit psql
\q
```

### Step 3: Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

#### Edit the .env file

Open `backend/.env` and update these values:

```env
# Update with your PostgreSQL credentials
DATABASE_URL=postgresql://your-username:your-password@localhost:5432/budgeting_app

# Generate a random secret (just type random characters)
JWT_SECRET=your-super-secret-random-string-change-this-to-something-long-and-random

PORT=3001
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

**How to find your PostgreSQL username/password:**
- Default username is usually your computer username
- If you just installed PostgreSQL, the default user is often `postgres` with no password
- Try: `postgresql://postgres@localhost:5432/budgeting_app`

#### Run Database Migrations

This creates all the tables:

```bash
npm run migrate
```

You should see: ✅ Database migration completed successfully!

### Step 4: Set Up the Frontend

Open a NEW terminal window (keep the first one open):

```bash
# Navigate to frontend folder (from the project root)
cd frontend

# Install dependencies
npm install
```

The frontend `.env` is already configured and should work as-is.

### Step 5: Start the Application

#### Terminal 1: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
🚀 Server running on port 3001
```

#### Terminal 2: Start the Frontend

```bash
cd frontend
npm start
```

Your browser should automatically open to `http://localhost:3000`

## Testing the Application

### 1. Create an Account

1. Click "Create one" to go to the register page
2. Fill out the form:
   - First Name: Your Name
   - Last Name: Your Last Name
   - Email: test@example.com
   - Password: Test1234 (must have uppercase, lowercase, and number)
   - Confirm Password: Test1234
   - ✅ Check "I agree to the Terms of Service"
3. Click "Create Account"

You should be redirected to the dashboard!

### 2. Upload a Test File

1. Create a simple test CSV file on your desktop named `test-statement.csv`:
   ```csv
   Date,Description,Amount
   2024-01-15,Starbucks,-5.50
   2024-01-16,Salary,3000.00
   2024-01-17,Grocery Store,-85.20
   ```

2. On the dashboard, click "Choose a file" and select your test CSV
3. Click "Upload"
4. You should see "File uploaded successfully!"
5. The file should appear in "Your Uploaded Files" with status "PENDING"

### 3. Test Logout/Login

1. Click "Logout" in the top right
2. You'll be redirected to the login page
3. Login with your credentials
4. You should see your uploaded file still there!

## Troubleshooting

### "Database connection failed"

**Solution:**
1. Make sure PostgreSQL is running
2. Check your DATABASE_URL in `backend/.env`
3. Try connecting manually:
   ```bash
   psql postgresql://your-username@localhost:5432/budgeting_app
   ```
4. If that works, copy that exact URL to your .env file

### "Port 3000 is already in use"

**Solution:**
Kill the process using that port:
```bash
# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Module not found" errors

**Solution:**
Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

### "Cannot find module 'typescript'"

**Solution:**
Install TypeScript globally:
```bash
npm install -g typescript ts-node
```

## Project Structure

```
ai-budgeting-app/
├── backend/               # Node.js API
│   ├── src/
│   │   ├── config/        # Database, migrations
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   └── server.ts      # Main server file
│   └── package.json
│
├── frontend/              # React app
│   ├── src/
│   │   ├── components/
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── services/      # API calls
│   │   └── App.tsx        # Main app component
│   └── package.json
│
└── README.md
```

## API Endpoints

Once running, your API will have these endpoints:

### Public
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Protected (requires authentication)
- `GET /api/auth/me` - Get current user
- `POST /api/upload` - Upload file
- `GET /api/upload/files` - Get user's files
- `DELETE /api/upload/:fileId` - Delete file

You can test these with tools like Postman or curl.

## Next Steps

Congratulations! Phase 1 is complete. You now have:
- ✅ User registration and login
- ✅ Secure authentication with JWT
- ✅ File upload functionality
- ✅ PostgreSQL database

### Phase 2 (Coming Next):
- OCR integration (extract data from PDFs)
- AI categorization with OpenAI
- Budget generation

## Need Help?

If you get stuck:
1. Check the error messages carefully
2. Make sure both backend and frontend are running
3. Check the browser console (F12) for frontend errors
4. Check the terminal where you ran `npm run dev` for backend errors

Common issues:
- Forgot to run migrations: `cd backend && npm run migrate`
- Wrong database credentials in `.env`
- Port already in use (kill the process)
- Node modules not installed (run `npm install`)
