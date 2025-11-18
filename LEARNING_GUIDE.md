# Learning Guide: Understanding Your AI Budgeting App

This guide explains how everything works together - perfect for a junior developer!

## The Big Picture

Think of your app like a restaurant:

- **Frontend (React)** = The dining room where customers interact
- **Backend (Node.js)** = The kitchen where food is prepared
- **Database (PostgreSQL)** = The pantry where ingredients are stored
- **API** = The waiters who take orders and deliver food

## How Authentication Works

### Registration Flow

```
User fills form → Frontend sends data → Backend validates
                                      ↓
                                   Hash password (security!)
                                      ↓
                                   Save to database
                                      ↓
                                   Create JWT token
                                      ↓
Frontend receives token ← Backend sends token + user data
         ↓
  Store in localStorage
         ↓
   Redirect to dashboard
```

**Key Files:**
- Frontend: [frontend/src/pages/RegisterPage.tsx](frontend/src/pages/RegisterPage.tsx)
- Backend: [backend/src/controllers/authController.ts](backend/src/controllers/authController.ts:17)
- Database: [backend/src/models/User.ts](backend/src/models/User.ts:15)

### Login Flow

```
User enters email/password → Frontend sends to backend
                                       ↓
                                  Find user in database
                                       ↓
                                  Compare password hash
                                       ↓
                                  Password correct?
                                  ↙️          ↘️
                               Yes            No
                                ↓              ↓
                          Create token    Return error
                                ↓
                    Frontend stores token
                                ↓
                    Redirect to dashboard
```

### What is JWT?

**JWT (JSON Web Token)** is like a VIP badge:

1. When you log in, the backend creates a badge (token)
2. The badge has your user ID encoded in it
3. Every time you make a request, you show your badge
4. The backend verifies the badge is real
5. If valid, it lets you through

**Example JWT:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMifQ.signature
```

It's stored in your browser's localStorage.

## How File Upload Works

### Upload Flow

```
User selects file → Click Upload
                        ↓
                 FormData created
                        ↓
            POST to /api/upload with file
                        ↓
          Backend: Multer middleware catches file
                        ↓
               File saved to uploads/
                        ↓
            Metadata saved to database
                        ↓
            Response sent to frontend
                        ↓
         Frontend refreshes file list
```

**Key Concepts:**

1. **Multer**: Library that handles file uploads
2. **FormData**: Special format for sending files
3. **Multipart/form-data**: The encoding type for files

**Security:**
- Only PDF and CSV allowed
- Max 10MB file size
- User must be authenticated
- Files are linked to user ID

## Understanding the Code Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          ← Database connection
│   │   ├── schema.sql            ← Table definitions
│   │   └── runMigrations.ts      ← Creates tables
│   │
│   ├── models/
│   │   └── User.ts               ← User database operations
│   │
│   ├── controllers/
│   │   ├── authController.ts     ← Auth logic
│   │   └── uploadController.ts   ← Upload logic
│   │
│   ├── middleware/
│   │   ├── auth.ts               ← JWT verification
│   │   └── validation.ts         ← Input validation
│   │
│   ├── routes/
│   │   ├── authRoutes.ts         ← /api/auth/* endpoints
│   │   └── uploadRoutes.ts       ← /api/upload/* endpoints
│   │
│   └── server.ts                 ← Main entry point
```

### Frontend Structure

```
frontend/
├── src/
│   ├── context/
│   │   └── AuthContext.tsx       ← Global auth state
│   │
│   ├── services/
│   │   └── api.ts                ← API calls to backend
│   │
│   ├── pages/
│   │   ├── RegisterPage.tsx      ← Registration UI
│   │   ├── LoginPage.tsx         ← Login UI
│   │   └── DashboardPage.tsx     ← Main app UI
│   │
│   ├── types/
│   │   └── index.ts              ← TypeScript types
│   │
│   └── App.tsx                   ← Routing & app structure
```

## Key Programming Concepts Used

### 1. Async/Await

Used for operations that take time (database queries, API calls):

```typescript
// ❌ BAD - This won't work!
const user = database.getUser(id);
console.log(user); // undefined! Query hasn't finished

// ✅ GOOD - Wait for the operation
const user = await database.getUser(id);
console.log(user); // User object
```

### 2. Middleware

Functions that run before your route handlers:

```typescript
// Request flow:
User Request
    ↓
authenticateToken (verify JWT)
    ↓
validateRegistration (check inputs)
    ↓
checkValidation (ensure no errors)
    ↓
authController.register (finally!)
    ↓
Response
```

### 3. Environment Variables

Secrets and config that change between environments:

```env
# Development
DATABASE_URL=localhost:5432

# Production
DATABASE_URL=production-server.com:5432
```

Never commit `.env` to git! That's why it's in `.gitignore`.

### 4. React Context

Allows sharing state across the app without prop drilling:

```typescript
// Instead of passing user through every component:
<App user={user}>
  <Header user={user}>
    <Navbar user={user}>
      <UserMenu user={user} />  ← Annoying!

// Use Context:
<AuthProvider>
  <App>
    <Header>
      <Navbar>
        <UserMenu />  ← Can access user via useAuth()
```

### 5. TypeScript

Adds types to JavaScript to catch errors early:

```typescript
// JavaScript (no safety)
function addNumbers(a, b) {
  return a + b;
}
addNumbers("5", "10"); // "510" - Oops!

// TypeScript (catches error before running)
function addNumbers(a: number, b: number): number {
  return a + b;
}
addNumbers("5", "10"); // ❌ Error: Strings are not numbers
```

## Database Schema Explained

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,              ← Unique ID
    email VARCHAR(255) UNIQUE,        ← Login email
    password_hash VARCHAR(255),       ← Encrypted password (never plain text!)
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    agreed_to_terms BOOLEAN,          ← Legal requirement!
    terms_agreed_at TIMESTAMP,        ← When they agreed
    created_at TIMESTAMP,             ← Account creation date
    updated_at TIMESTAMP              ← Last update
);
```

**Why UUID instead of auto-incrementing ID?**
- UUIDs are harder to guess (security)
- Work better in distributed systems
- Can be generated client-side if needed

### Uploaded Files Table

```sql
CREATE TABLE uploaded_files (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),  ← Links to user
    original_filename VARCHAR(255),      ← What user named it
    file_path VARCHAR(500),              ← Where we saved it
    file_size INTEGER,
    mime_type VARCHAR(100),              ← PDF, CSV, etc.
    status VARCHAR(50),                  ← pending/processing/completed/error
    uploaded_at TIMESTAMP,
    processed_at TIMESTAMP,
    deleted_at TIMESTAMP                 ← Soft delete (GDPR)
);
```

**Foreign Key (REFERENCES):**
When you delete a user, `ON DELETE CASCADE` automatically deletes all their files.

## Security Features Explained

### 1. Password Hashing (bcrypt)

```typescript
// NEVER store plain passwords!
❌ password: "MyPassword123"

// Always hash them:
✅ password_hash: "$2b$10$N9qo8uLOickgx2ZMRZoMye..."

// Even if someone steals the database, they can't use the passwords!
```

**How bcrypt works:**
1. Takes your password
2. Adds random "salt"
3. Runs it through a slow algorithm 10 times
4. Produces a hash that can't be reversed

### 2. JWT Authentication

```typescript
// Client stores token:
localStorage.setItem('token', 'eyJhbGc...')

// Sends it with every request:
headers: {
  'Authorization': 'Bearer eyJhbGc...'
}

// Server verifies it:
jwt.verify(token, SECRET_KEY)
```

### 3. Input Validation

Prevents SQL injection and XSS attacks:

```typescript
// ❌ Dangerous - SQL injection risk:
query(`SELECT * FROM users WHERE email = '${userInput}'`)

// ✅ Safe - Uses parameterized query:
query('SELECT * FROM users WHERE email = $1', [userInput])
```

### 4. CORS

Controls which websites can call your API:

```typescript
// Only allow your frontend:
cors({
  origin: 'http://localhost:3000'
})

// Blocks requests from evil.com
```

### 5. Helmet

Sets security HTTP headers automatically:

```typescript
// Prevents:
// - Clickjacking
// - XSS attacks
// - MIME sniffing
// - And more!
```

## Common Errors You Might See

### "Cannot find module"
**Cause:** Package not installed
**Fix:** `npm install`

### "Port already in use"
**Cause:** Server already running
**Fix:** Kill the process or use a different port

### "Database connection failed"
**Cause:** PostgreSQL not running or wrong credentials
**Fix:** Check `.env` DATABASE_URL

### "Unauthorized"
**Cause:** No token or invalid token
**Fix:** Check if you're logged in, token might be expired

### "Validation failed"
**Cause:** Form data doesn't meet requirements (e.g., password too short)
**Fix:** Read the error details, fix the input

## Testing Your App

### Manual Testing Checklist

- [ ] Register with invalid email → Should show error
- [ ] Register without agreeing to terms → Should show error
- [ ] Register with weak password → Should show error
- [ ] Register successfully → Should redirect to dashboard
- [ ] Logout → Should go to login
- [ ] Login with wrong password → Should show error
- [ ] Login successfully → Should go to dashboard
- [ ] Upload non-PDF/CSV file → Should reject
- [ ] Upload file > 10MB → Should reject
- [ ] Upload valid file → Should succeed
- [ ] Refresh page while logged in → Should stay logged in
- [ ] Try accessing /dashboard while logged out → Should redirect to login

### Using Browser DevTools

**Check API Calls:**
1. Press F12
2. Go to "Network" tab
3. Perform an action (e.g., login)
4. Click on the request
5. See request/response data

**Check LocalStorage:**
1. Press F12
2. Go to "Application" tab
3. Click "Local Storage"
4. See your JWT token

**Check Console Errors:**
1. Press F12
2. Go to "Console" tab
3. See any JavaScript errors

## Next Phase: What's Coming

In Phase 2, you'll add:

1. **AWS Textract** - Extracts text from PDFs
2. **OpenAI GPT-4** - Categorizes transactions
3. **Budget AI** - Generates personalized budgets

The flow will be:
```
Upload PDF
    ↓
Extract text (Textract)
    ↓
Parse transactions
    ↓
Categorize with AI (GPT-4)
    ↓
Generate budget
    ↓
Show to user
```

## Resources for Learning More

- **Node.js**: https://nodejs.dev/learn
- **React**: https://react.dev/learn
- **PostgreSQL**: https://www.postgresqltutorial.com/
- **TypeScript**: https://www.typescriptlang.org/docs/handbook/intro.html
- **JWT**: https://jwt.io/introduction
- **Express**: https://expressjs.com/en/guide/routing.html

## Questions to Test Your Understanding

1. What happens if you delete a user from the database?
2. Where is the JWT token stored in the frontend?
3. What does bcrypt do?
4. What is the difference between authentication and authorization?
5. What does the CASCADE in ON DELETE CASCADE mean?
6. Why do we use environment variables?
7. What is the purpose of middleware?
8. What happens if you send a request to a protected route without a token?

**Answers:**
1. All their files are also deleted (CASCADE)
2. Browser's localStorage
3. Hashes passwords securely
4. Authentication = who you are, Authorization = what you can do
5. When parent is deleted, children are also deleted
6. Keep secrets out of code, different configs per environment
7. Run code before route handlers (auth, validation, etc.)
8. You get a 401 Unauthorized error

---

Great job completing Phase 1! You now have a solid foundation in:
- Full-stack development
- Database design
- Authentication & security
- File uploads
- React & TypeScript

Keep building! 🚀
