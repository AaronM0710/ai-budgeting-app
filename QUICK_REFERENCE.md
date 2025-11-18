# Quick Reference Guide

## Common Commands

### Start the Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

### Database Commands

```bash
# Create database
createdb budgeting_app

# Run migrations
cd backend
npm run migrate

# Connect to database
psql budgeting_app

# In psql:
\dt                    # List tables
SELECT * FROM users;   # View users
\q                     # Quit
```

### Useful npm Commands

```bash
npm install           # Install dependencies
npm run dev           # Start development server
npm run build         # Build for production
npm start             # Start production server
```

## Project File Map

### Backend Files You'll Edit Often

| File | Purpose |
|------|---------|
| `backend/src/server.ts` | Main server configuration |
| `backend/src/controllers/authController.ts` | Login/register logic |
| `backend/src/controllers/uploadController.ts` | File upload logic |
| `backend/src/routes/authRoutes.ts` | API endpoints for auth |
| `backend/src/middleware/auth.ts` | JWT verification |
| `backend/src/models/User.ts` | Database operations |
| `backend/.env` | Configuration & secrets |

### Frontend Files You'll Edit Often

| File | Purpose |
|------|---------|
| `frontend/src/App.tsx` | Main app & routing |
| `frontend/src/pages/LoginPage.tsx` | Login UI |
| `frontend/src/pages/RegisterPage.tsx` | Registration UI |
| `frontend/src/pages/DashboardPage.tsx` | Main dashboard UI |
| `frontend/src/services/api.ts` | API calls to backend |
| `frontend/src/context/AuthContext.tsx` | Global auth state |

## API Endpoints Reference

### Authentication

```bash
# Register
POST http://localhost:3001/api/auth/register
Body: {
  "email": "user@example.com",
  "password": "Test1234",
  "first_name": "John",
  "last_name": "Doe",
  "agreed_to_terms": true
}

# Login
POST http://localhost:3001/api/auth/login
Body: {
  "email": "user@example.com",
  "password": "Test1234"
}

# Get Current User (Protected)
GET http://localhost:3001/api/auth/me
Headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

### File Upload

```bash
# Upload File (Protected)
POST http://localhost:3001/api/upload
Headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
Body: FormData with 'file' field

# Get User Files (Protected)
GET http://localhost:3001/api/upload/files
Headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}

# Delete File (Protected)
DELETE http://localhost:3001/api/upload/:fileId
Headers: {
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

## Database Schema Quick View

### Users Table
- `id` (UUID) - Primary key
- `email` (String) - Unique
- `password_hash` (String)
- `first_name` (String)
- `last_name` (String)
- `agreed_to_terms` (Boolean)
- `terms_agreed_at` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Uploaded Files Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `original_filename` (String)
- `file_path` (String)
- `file_size` (Integer)
- `mime_type` (String)
- `status` (String) - pending/processing/completed/error
- `uploaded_at` (Timestamp)
- `processed_at` (Timestamp)
- `deleted_at` (Timestamp)

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/budgeting_app
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Debugging Tips

### Check if Backend is Running
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Check Database Connection
```bash
psql budgeting_app
\dt  # Should show all tables
```

### View Backend Logs
Look at the terminal where you ran `npm run dev`

### View Frontend Errors
Press F12 in browser → Console tab

### Test API with curl

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234","agreed_to_terms":true}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}'
```

## Git Commands

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Phase 1 complete"

# Create .gitignore (already done!)
# Never commit .env files!

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

## Port Reference

- `3000` - Frontend (React)
- `3001` - Backend (Express API)
- `5432` - PostgreSQL Database

## Keyboard Shortcuts

### VSCode
- `Cmd/Ctrl + P` - Quick file search
- `Cmd/Ctrl + Shift + F` - Search in all files
- `Cmd/Ctrl + B` - Toggle sidebar
- `Cmd/Ctrl + `` ` `` - Toggle terminal

### Browser DevTools
- `F12` or `Cmd/Ctrl + Shift + I` - Open DevTools
- `Cmd/Ctrl + Shift + C` - Inspect element
- `Cmd/Ctrl + R` - Refresh page
- `Cmd/Ctrl + Shift + R` - Hard refresh (clear cache)

## NPM Package Reference

### Backend Dependencies
- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT creation/verification
- `dotenv` - Environment variables
- `multer` - File upload handling
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-validator` - Input validation

### Frontend Dependencies
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP requests

## Common Error Messages

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| "ECONNREFUSED" | Database not running | Start PostgreSQL |
| "Port already in use" | Server already running | Kill the process |
| "Module not found" | Package not installed | Run `npm install` |
| "Unauthorized" | No/invalid token | Login again |
| "Validation failed" | Bad input data | Check error details |
| "Cannot find module 'typescript'" | TypeScript not installed | `npm install -g typescript` |

## File Size Limits

- Max upload: 10 MB
- Allowed formats: PDF, CSV

## Default Ports

If you need to change ports:

**Backend:** Edit `backend/.env`
```env
PORT=3001  # Change this
```

**Frontend:** Create `frontend/.env`
```env
PORT=3000  # Change this
```

## Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can register new user
- [ ] Can login
- [ ] Can logout
- [ ] Can upload file
- [ ] Can view uploaded files
- [ ] Protected routes require login
- [ ] Invalid credentials show error
- [ ] File type validation works

## Phase 2 Preview

Coming soon:
- AWS Textract integration
- OpenAI GPT-4 integration
- Transaction categorization
- Budget generation
- Data visualization with charts

---

**Pro Tip:** Bookmark this file! You'll reference it often.
