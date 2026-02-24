require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'https://loanbazaar.onrender.com',
    'https://loanbaazaar.com',
    'https://www.loanbaazaar.com',
    'https://ssolutions.in',
    'https://www.ssolutions.in',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Application-Source'],
};

app.use(cors(corsOptions));

// Session configuration - require SESSION_SECRET in production
const sessionSecret = process.env.SESSION_SECRET;
if (process.env.NODE_ENV === 'production' && !sessionSecret) {
  console.error('FATAL: SESSION_SECRET must be set in production.');
  process.exit(1);
}
app.use(session({
  secret: sessionSecret || 'dev-only-fallback',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const adminRoutes = require('./routes/admin');
const consultancyRoutes = require('./routes/consultancy');
const galleryRoutes = require('./routes/gallery');
const loanProductsRoutes = require('./routes/loanProducts');

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LoanBazaar Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultancy', consultancyRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/loan-products', loanProductsRoutes);

// Static file serving for uploads
app.use('/uploads', express.static('public/uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
