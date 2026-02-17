const express = require('express');
const router = express.Router();
const passport = require('../config/passport');

// Google OAuth login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/admin/signin?error=AccessDenied',
    successRedirect: '/admin'
  })
);

// Get session user
router.get('/session', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user
    });
  } else {
    res.status(401).json({
      user: null,
      error: 'Not authenticated'
    });
  }
});

// Logout
router.post('/signout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

// Check admin middleware
function requireAdmin(req, res, next) {
  if (!req.isAuthenticated() || !req.user?.isAdmin) {
    return res.status(403).json({
      error: 'Access denied. Admin privileges required.'
    });
  }
  next();
}

module.exports = router;
module.exports.requireAdmin = requireAdmin;
