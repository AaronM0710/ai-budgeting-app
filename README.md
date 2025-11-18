# AI Budgeting App

A secure, AI-powered personal budgeting application that analyzes bank statements and generates personalized budgets.

## Architecture Overview

This app uses a **modern, scalable architecture**:

- **Frontend**: React (Web) - User interface
- **Backend**: Node.js + TypeScript + Express - API server
- **Database**: PostgreSQL - Secure data storage
- **Cloud**: AWS (S3 for file storage, Textract for OCR)
- **AI**: OpenAI GPT-4 for transaction analysis and budget generation

## Project Structure

```
ai-budgeting-app/
├── backend/           # Node.js API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth, validation, etc.
│   │   └── config/        # Configuration files
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/          # React web app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
│   ├── package.json
│   └── public/
│
├── database/          # Database migrations & seeds
│   └── migrations/
│
└── docs/             # Documentation
    ├── API.md
    └── SETUP.md
```

## Prerequisites

Before you start, install these on your computer:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
3. **Git** - [Download here](https://git-scm.com/)
4. **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## Phase 1: Setup (Current Phase)

### What we're building in Phase 1:
- ✅ Project structure
- ✅ Backend API with TypeScript
- ✅ User authentication (signup/login)
- ✅ Secure file upload
- ✅ PostgreSQL database
- ✅ Basic React frontend

## Quick Start (After setup is complete)

### 1. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Set Up Database

```bash
# Create a new PostgreSQL database
createdb budgeting_app

# Run migrations (creates tables)
cd backend
npm run migrate
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=postgresql://localhost:5432/budgeting_app
JWT_SECRET=your-super-secret-key-change-this
PORT=3001
NODE_ENV=development
```

### 4. Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## Security Features

- 🔒 Password hashing with bcrypt
- 🔑 JWT-based authentication
- 🛡️ HTTPS in production
- 🔐 Environment variable protection
- 📝 Input validation and sanitization

## Next Phases

- **Phase 2**: OCR integration + AI transaction categorization
- **Phase 3**: Budget generation + data visualization

## Legal & Compliance

This app includes:
- Terms of Service acceptance (click-wrap)
- Privacy Policy
- "Not Financial Advice" disclaimers
- GDPR/CCPA compliant data deletion

---

**Status**: 🚧 Phase 1 - In Development
