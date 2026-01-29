import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';

// Admin settings collection name
const SETTINGS_COLLECTION = 'adminSettings';

// Default admin emails - these are fallback if database doesn't have any
// Update these with your admin emails for local development
const DEFAULT_ADMIN_EMAILS = [
  'neerajkushwaha0401@gmail.com',
];

// Function to get admin emails from database
async function getAdminEmails(): Promise<string[]> {
  // Always include default admin emails
  const defaultEmails = DEFAULT_ADMIN_EMAILS.map(email => email.toLowerCase().trim());

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection(SETTINGS_COLLECTION).findOne({ _id: 'main' } as any);

    if (settings?.settings?.adminEmails && Array.isArray(settings.settings.adminEmails)) {
      // Normalize all emails to lowercase and trim whitespace
      const dbEmails = settings.settings.adminEmails.map((email: string) =>
        email.toLowerCase().trim()
      ).filter((email: string) => email.length > 0);

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

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/admin/signin',
    error: '/admin/signin',
  },
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the admin list
      const adminEmails = await getAdminEmails();
      const userEmail = user.email?.toLowerCase().trim();

      console.log('Sign in attempt - User email:', userEmail);
      console.log('Sign in attempt - Admin emails:', adminEmails);

      if (!userEmail) {
        console.log('Sign in failed - No user email provided');
        return false;
      }

      const isAdmin = adminEmails.some(
        (email) => email.toLowerCase().trim() === userEmail
      );

      console.log('Sign in attempt - Is admin:', isAdmin);

      if (!isAdmin) {
        console.log('Sign in failed - Access denied for email:', userEmail);
        return '/admin/signin?error=AccessDenied';
      }

      console.log('Sign in successful - Access granted for email:', userEmail);
      return true;
    },
    async session({ session, token }) {
      // Add isAdmin flag to session
      if (session.user?.email) {
        const adminEmails = await getAdminEmails();
        session.user.isAdmin = adminEmails.some(
          (email) => email.toLowerCase() === session.user?.email?.toLowerCase()
        );
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
