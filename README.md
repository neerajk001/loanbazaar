# LoanBazaar - Full Stack Next.js Application

LoanBazaar is a full-stack loan and insurance application platform built with **Next.js** (API routes + frontend).

## Architecture

- **Single Next.js App** — both frontend pages and API routes
- **Database**: MongoDB (via Mongodb driver)
- **Authentication**: NextAuth.js with Google OAuth
- **Deployment**: Vercel / Docker / any Node.js host

## Project Structure

```
loanbazaar/
├── frontend/              # Next.js Fullstack App
│   ├── src/
│   │   ├── app/          # Pages + API routes (single codebase)
│   │   │   ├── api/      # Next.js API route handlers
│   │   │   ├── admin/    # Admin dashboard pages
│   │   │   └── ...       # Public pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities (mongodb, email, upload, etc.)
│   │   └── models/       # TypeScript data models
│   └── public/           # Static files + uploads
│
└── backend/               # [LEGACY] Express server (no longer required)
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB connection string
- Google OAuth credentials

### Installation

```bash
cd frontend
npm install  # or: pnpm install
```

### Configuration

Create `frontend/.env.local`:

```env
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret
MONGO_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Running

```bash
cd frontend
npm run dev
```

App runs on `http://localhost:3001`.

### Production Build

```bash
cd frontend
npm run build
npm start
```

## API Endpoints

All endpoints live at `frontend/src/app/api/`.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/applications/loan` | POST | No | Submit loan application |
| `/api/applications/insurance` | POST | No | Submit insurance application |
| `/api/consultancy` | POST | No | Submit consultancy request |
| `/api/gallery/events` | GET | No | Get published gallery events |
| `/api/gallery/events/:id` | GET | No | Get single gallery event |
| `/api/loan-products` | GET | No | Get loan products |
| `/api/auth/[...nextauth]` | * | NextAuth | Google OAuth authentication |
| `/api/admin/applications` | GET | Admin | Admin: list applications |
| `/api/admin/applications/:id` | GET/PATCH/DELETE | Admin | Admin: manage application |
| `/api/admin/gallery/events` | GET/POST | Admin | Admin: manage gallery |
| `/api/admin/settings` | GET/POST | Admin | Admin: manage settings |

## Tech Stack

- Next.js 16 (React 19)
- TypeScript
- TailwindCSS 4
- NextAuth.js (Google OAuth)
- MongoDB
- Recharts (Analytics)
- jsPDF (PDF generation)
- Lucide Icons
