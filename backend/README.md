# LoanBazaar Backend

Express.js backend server for LoanBazaar application.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (copy and edit .env file)
# See .env for required variables

# Run development server with auto-reload
npm run dev

# Run production server
npm start
```

## API Documentation

Base URL: `http://localhost:5000/api`

### Health Check
- `GET /api/health` - Server health status

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/signout` - Logout

### Applications (Public)
- `POST /api/applications/loan` - Submit loan application
- `POST /api/applications/insurance` - Submit insurance application

### Consultancy (Public)
- `POST /api/consultancy` - Submit consultancy request

### Gallery (Public)
- `GET /api/gallery/events` - Get published events
- `GET /api/gallery/events/:id` - Get single event
- `GET /api/gallery/health` - Gallery health check

### Loan Products (Public)
- `GET /api/loan-products` - Get all loan products
- `GET /api/loan-products/:id` - Get single product

### Admin Routes (Authentication Required)
- `GET /api/admin/applications` - List all applications
- `GET /api/admin/applications/:id` - Get application details
- `PATCH /api/admin/applications/:id` - Update application status
- `GET /api/admin/consultancy` - Get consultancy requests
- `DELETE /api/admin/consultancy/:id` - Delete request
- `GET /api/admin/settings` - Get admin settings
- `POST /api/admin/settings` - Update settings
- `GET /api/admin/gallery/events` - Get all gallery events
- `POST /api/admin/gallery/events` - Create event (with image upload)
- `GET /api/admin/gallery/events/:id` - Get single event
- `DELETE /api/admin/gallery/events/:id` - Delete event

## Environment Variables

Required variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
SESSION_SECRET=...
FRONTEND_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

## Project Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   └── passport.js       # Google OAuth configuration
├── models/
│   ├── LoanApplication.js
│   ├── InsuranceApplication.js
│   ├── ConsultancyRequest.js
│   └── GalleryEvent.js
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── applications.js   # Application submission
│   ├── admin.js          # Admin management
│   ├── consultancy.js    # Consultancy requests
│   ├── gallery.js        # Gallery events
│   └── loanProducts.js   # Loan products
├── utils/
│   ├── email.js          # Email notifications
│   ├── fileUpload.js     # File upload handling
│   └── sourceDetection.js
├── public/
│   └── uploads/          # Uploaded files
├── server.js             # Express app entry point
└── package.json
```

## Development

```bash
# Watch mode with nodemon
npm run dev

# Production mode
npm start
```

## Features

- ✅ Express.js REST API
- ✅ MongoDB integration
- ✅ Google OAuth authentication
- ✅ Session management
- ✅ File uploads with Multer
- ✅ Email notifications
- ✅ CORS enabled
- ✅ Admin authentication middleware
- ✅ Application status tracking
- ✅ Gallery management

## Security

- Admin routes protected with `requireAdmin` middleware
- Google OAuth for authentication
- Session-based authentication
- CORS restricted to allowed origins
- Environment variables for sensitive data

## Database Collections

- `loanApplications` - Loan applications
- `insuranceApplications` - Insurance applications
- `consultancyRequests` - Consultancy requests
- `galleryEvents` - Gallery events and images
- `adminSettings` - Admin configuration
- `counters` - ID sequence generators
