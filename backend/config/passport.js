const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const clientPromise = require('./database');

// Admin settings collection name
const SETTINGS_COLLECTION = 'adminSettings';

// Default admin emails - these are fallback if database doesn't have any
const DEFAULT_ADMIN_EMAILS = process.env.ADMIN_EMAILS 
  ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
  : ['neerajkushwaha0401@gmail.com'];

// Function to get admin emails from database
async function getAdminEmails() {
  // Always include default admin emails
  const defaultEmails = DEFAULT_ADMIN_EMAILS;

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection(SETTINGS_COLLECTION).findOne({ _id: 'main' });

    if (settings?.settings?.adminEmails && Array.isArray(settings.settings.adminEmails)) {
      // Normalize all emails to lowercase and trim whitespace
      const dbEmails = settings.settings.adminEmails
        .map(email => email.toLowerCase().trim())
        .filter(email => email.length > 0);

      // Merge default emails with database emails (remove duplicates)
      const allEmails = [...new Set([...defaultEmails, ...dbEmails])];
      console.log('Admin emails (merged from defaults + database):', allEmails);
      return allEmails;
    }

    console.log('Using default admin emails:', defaultEmails);
    return defaultEmails;
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return defaultEmails;
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value.toLowerCase().trim();
        const adminEmails = await getAdminEmails();

        console.log('Google OAuth - User email:', email);
        console.log('Google OAuth - Admin emails:', adminEmails);

        const isAdmin = adminEmails.includes(email);

        if (!isAdmin) {
          console.log('Google OAuth - Access denied for email:', email);
          return done(null, false, { message: 'Access denied' });
        }

        const user = {
          id: profile.id,
          email: email,
          name: profile.displayName,
          picture: profile.photos[0]?.value,
          isAdmin: true,
        };

        console.log('Google OAuth - Access granted for email:', email);
        return done(null, user);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
