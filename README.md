# LoanBazaar - Full Stack Application

LoanBazaar is a full-stack loan and insurance application platform with a **Next.js frontend** and **Express backend**.

## Architecture

- **Frontend**: Next.js (React) - Port 3000
- **Backend**: Express.js (Node.js) - Port 5000
- **Database**: MongoDB
- **Authentication**: Google OAuth with Passport.js

## Project Structure

```
loanbazaar/
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities (including api-client.js)
│   └── public/           # Static files
│
└── backend/               # Express Backend
    ├── config/           # Database & Passport config
    ├── models/           # Data models
    ├── routes/           # API routes
    ├── utils/            # Utilities (email, file upload, etc.)
    └── server.js         # Express server entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB connection string
- Google OAuth credentials

### Installation

1. **Install Frontend Dependencies**

```bash
cd frontend
npm install
cd ..
```

2. **Install Backend Dependencies**

```bash
cd backend
npm install
cd ..
```

### Configuration

1. **Frontend Environment** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

2. **Backend Environment** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

### Running the Application

You need to run both the frontend and backend servers:

1. **Start Backend Server** (in one terminal):
```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

2. **Start Frontend Server** (in another terminal):
```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

### Production Build

**Backend**:
```bash
cd backend
npm start
```

**Frontend**:
```bash
cd frontend
npm run build
npm start
```

## API Endpoints

### Public Endpoints
- `POST /api/applications/loan` - Submit loan application
- `POST /api/applications/insurance` - Submit insurance application
- `POST /api/consultancy` - Submit consultancy request
- `GET /api/gallery/events` - Get published gallery events
- `GET /api/loan-products` - Get loan products

### Admin Endpoints (Require Authentication)
- `GET /api/admin/applications` - Get all applications
- `PATCH /api/admin/applications/:id` - Update application status
- `GET /api/admin/consultancy` - Get consultancy requests
- `GET /api/admin/gallery/events` - Manage gallery events
- `GET /api/admin/settings` - Get/update admin settings

### Authentication
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Logout

## Key Features

- ✅ **Loan Applications**: Personal, Business, Home, LAP
- ✅ **Insurance Quotes**: Health, Life, Vehicle, Loan Protection
- ✅ **Consultancy Requests**: Connect with financial advisors
- ✅ **Admin Dashboard**: Manage applications and requests
- ✅ **Gallery Management**: Event photos and media
- ✅ **Google OAuth**: Secure admin authentication
- ✅ **Email Notifications**: Application confirmations
- ✅ **File Uploads**: Gallery image management

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TailwindCSS 4
- Lucide Icons
- Recharts (Analytics)

### Backend
- Express.js
- MongoDB
- Passport.js (Google OAuth)
- Multer (File uploads)
- CORS enabled

## Development Notes

- Frontend uses the API client (`frontend/src/lib/api-client.js`) to communicate with backend
- All API routes are served from Express backend (not Next.js API routes)
- CORS is configured to allow frontend-backend communication
- Sessions are stored server-side with express-session
- File uploads are handled by Multer and stored in `backend/public/uploads/`

## Deployment

### Backend Deployment
- Deploy Express app to any Node.js hosting (Heroku, Railway, Render, etc.)
- Set environment variables in hosting platform
- Ensure MongoDB connection is accessible

### Frontend Deployment
- Deploy Next.js app to Vercel, Netlify, or similar
- Update `NEXT_PUBLIC_API_URL` to point to deployed backend URL
- Configure OAuth redirect URLs in Google Console

## License

Private - All Rights Reserved
