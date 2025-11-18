# Getting Started - Step by Step

Follow these steps to get your app running. Check off each item as you complete it!

## ✅ Prerequisites Checklist

### Install Required Software

- [ ] **Node.js** installed (v18+)
  ```bash
  node --version  # Should show v18.x.x or higher
  ```
  ❌ Not installed? Download: https://nodejs.org/

- [ ] **PostgreSQL** installed (v14+)
  ```bash
  psql --version  # Should show 14.x or higher
  ```
  ❌ Not installed?
  - Mac: `brew install postgresql@14`
  - Windows: https://www.postgresql.org/download/
  - Linux: `sudo apt-get install postgresql-14`

- [ ] **Git** installed
  ```bash
  git --version
  ```
  ❌ Not installed? Download: https://git-scm.com/

## 🚀 Setup Steps

### Step 1: Database Setup

- [ ] Start PostgreSQL
  ```bash
  # Mac
  brew services start postgresql@14

  # Linux
  sudo service postgresql start

  # Windows - should start automatically
  ```

- [ ] Create the database
  ```bash
  # Open PostgreSQL terminal
  psql postgres

  # In psql, type:
  CREATE DATABASE budgeting_app;

  # Verify it was created:
  \l

  # Exit psql:
  \q
  ```

- [ ] Test connection
  ```bash
  psql budgeting_app
  # If this works, you're connected! Type \q to exit
  ```

### Step 2: Backend Setup

- [ ] Navigate to backend folder
  ```bash
  cd /Users/aaronmccullough/ai-budgeting-app/backend
  ```

- [ ] Install dependencies (this takes ~1 minute)
  ```bash
  npm install
  ```
  ✅ You should see: "added XXX packages"

- [ ] Create your `.env` file
  ```bash
  cp .env.example .env
  ```

- [ ] Edit the `.env` file
  ```bash
  # Open in any text editor
  nano .env  # or use VSCode
  ```

  **Update these lines:**
  ```env
  # Replace 'username' with your computer username
  # If unsure, try: postgres (no password) or your-username:your-password
  DATABASE_URL=postgresql://postgres@localhost:5432/budgeting_app

  # Make this a random string (just type random characters)
  JWT_SECRET=my-super-secret-random-string-abc123xyz789

  # Leave these as-is
  PORT=3001
  NODE_ENV=development
  FRONTEND_URL=http://localhost:3000
  ```

  💡 **Tip:** If `postgres@localhost` doesn't work, try:
  - `postgresql://your-mac-username@localhost:5432/budgeting_app`
  - Check your username: `whoami`

- [ ] Run database migrations
  ```bash
  npm run migrate
  ```
  ✅ You should see: "✅ Database migration completed successfully!"

  ❌ Error? Check your DATABASE_URL in `.env`

- [ ] Start the backend server
  ```bash
  npm run dev
  ```
  ✅ You should see:
  ```
  ✅ Connected to PostgreSQL database
  🚀 Server running on port 3001
  ```

  🎯 **Keep this terminal open!**

### Step 3: Frontend Setup

- [ ] Open a **NEW terminal window** (keep backend running!)

- [ ] Navigate to frontend folder
  ```bash
  cd /Users/aaronmccullough/ai-budgeting-app/frontend
  ```

- [ ] Install dependencies (this takes ~2 minutes)
  ```bash
  npm install
  ```
  ✅ You should see: "added XXX packages"

- [ ] Start the frontend server
  ```bash
  npm start
  ```
  ✅ Your browser should automatically open to http://localhost:3000

  ✅ You should see a login page!

  🎯 **Keep this terminal open too!**

## 🎉 Test Your App

### Create Your First Account

- [ ] Click "Create one" to go to register page

- [ ] Fill out the form:
  - First Name: **Your Name**
  - Last Name: **Your Last Name**
  - Email: **test@example.com**
  - Password: **Test1234** (must have uppercase, lowercase, number)
  - Confirm Password: **Test1234**
  - ✅ Check "I agree to the Terms of Service"

- [ ] Click "Create Account"

✅ **Success!** You should be redirected to the dashboard!

### Upload a Test File

- [ ] Create a test CSV file on your desktop:

  **File name:** `test-bank-statement.csv`

  **Contents:**
  ```csv
  Date,Description,Amount
  2024-01-15,Starbucks,-5.50
  2024-01-16,Salary,3000.00
  2024-01-17,Whole Foods,-85.20
  2024-01-18,Netflix,-15.99
  2024-01-19,Gas Station,-45.00
  ```

- [ ] On the dashboard, click "Choose a file"

- [ ] Select your test CSV file

- [ ] Click "Upload"

✅ **Success!** You should see "File uploaded successfully!"

✅ The file should appear in "Your Uploaded Files" list

### Test Logout/Login

- [ ] Click "Logout" in the top right

✅ You should be redirected to the login page

- [ ] Login with:
  - Email: **test@example.com**
  - Password: **Test1234**

- [ ] Click "Login"

✅ You should see your dashboard again!

✅ Your uploaded file should still be there!

## 🐛 Troubleshooting

### Problem: "Database connection failed"

**Solution:**
1. Is PostgreSQL running?
   ```bash
   # Mac
   brew services list | grep postgresql

   # Linux
   sudo service postgresql status
   ```

2. Can you connect manually?
   ```bash
   psql budgeting_app
   ```
   - ✅ If yes: Copy the connection string you used
   - ❌ If no: Check PostgreSQL is installed and running

3. Update your `.env` DATABASE_URL with the correct credentials

### Problem: "Port 3001 already in use"

**Solution:**
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port in backend/.env
PORT=3002
```

### Problem: "Module not found"

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: "Cannot find module 'typescript'"

**Solution:**
```bash
# Install TypeScript globally
npm install -g typescript ts-node

# Then try again
npm run dev
```

### Problem: Frontend shows "Cannot connect to server"

**Solution:**
1. Is the backend running? Check Terminal 1
2. Is it running on port 3001?
   ```bash
   curl http://localhost:3001/health
   ```
3. Check frontend/.env has correct API URL:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

## 📚 What to Do Next

### Option 1: Explore the Code
- [ ] Read [LEARNING_GUIDE.md](LEARNING_GUIDE.md) - Understand how everything works
- [ ] Read [ARCHITECTURE.md](ARCHITECTURE.md) - See the system design
- [ ] Open files in VSCode and read the comments

### Option 2: Test Everything
- [ ] Try creating multiple accounts
- [ ] Upload different file types (try a PDF!)
- [ ] Try uploading a file > 10MB (should be rejected)
- [ ] Open browser DevTools (F12) and watch the network requests
- [ ] Check the database: `psql budgeting_app` then `SELECT * FROM users;`

### Option 3: Customize It
- [ ] Change the color scheme in the CSS files
- [ ] Add a "Forgot Password" link on login page
- [ ] Add user profile editing
- [ ] Add file deletion functionality
- [ ] Add a dark mode toggle

### Option 4: Learn More
- [ ] Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands and tips
- [ ] Learn about JWT: https://jwt.io/introduction
- [ ] Learn about bcrypt: https://en.wikipedia.org/wiki/Bcrypt
- [ ] Learn React: https://react.dev/learn

### Option 5: Get Ready for Phase 2
- [ ] Create an AWS account: https://aws.amazon.com/
- [ ] Create an OpenAI account: https://platform.openai.com/
- [ ] Read about AWS Textract
- [ ] Read about GPT-4 API

## 🎯 Your Current Progress

You've completed:
- ✅ Full-stack application setup
- ✅ User authentication system
- ✅ Secure file upload
- ✅ Database with proper relationships
- ✅ Frontend with React
- ✅ Backend with Node.js
- ✅ Security best practices

**Phase 1: 100% Complete! 🎉**

## 🚀 Ready to Move On?

When you're ready for Phase 2, you'll add:
- AWS Textract (extract text from PDFs)
- OpenAI GPT-4 (categorize transactions)
- Budget generation AI
- Data visualization with charts

**But first:** Make sure you understand Phase 1!
- Can you explain how JWT works?
- Do you know why we hash passwords?
- Can you trace the flow of a file upload?

## 📝 Notes Section

Use this space for your own notes:

```
Things I learned:
-
-
-

Things I'm confused about:
-
-
-

Ideas for improvements:
-
-
-
```

## ✅ Final Checklist

Before you're done with Phase 1:

- [ ] Both servers start without errors
- [ ] Can register a new user
- [ ] Can login and logout
- [ ] Can upload a file
- [ ] Data persists after page refresh
- [ ] Understand the file structure
- [ ] Read at least SETUP_GUIDE.md and LEARNING_GUIDE.md
- [ ] Tested at least 3 different scenarios

**All checked?** Congratulations! You're a full-stack developer now! 🎉

---

**Need Help?**
- Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Check [LEARNING_GUIDE.md](LEARNING_GUIDE.md) for explanations
- Use [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for commands

**Having fun?**
Star this project, share it with friends, add it to your portfolio!
