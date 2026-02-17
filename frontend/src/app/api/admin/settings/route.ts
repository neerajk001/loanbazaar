import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const SETTINGS_COLLECTION = 'adminSettings';
const DEFAULT_SETTINGS = {
  emailNotifications: {
    newApplication: true,
    newConsultancy: true,
    statusUpdate: true,
  },
  adminEmails: ['neerajkushwaha0401@gmail.com'],
  systemSettings: {
    maintenanceMode: false,
    allowPublicApplications: true,
  },
};

interface AdminSettings {
  _id: string;
  settings: typeof DEFAULT_SETTINGS;
  updatedAt?: Date;
  updatedBy?: string;
}

// GET /api/admin/settings - Get current settings
export async function GET(request: NextRequest) {
  // Note: Add proper admin authentication if needed

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<AdminSettings>(SETTINGS_COLLECTION);

    const settings = await collection.findOne({ _id: 'main' } as any);

    const currentSettings = settings?.settings || DEFAULT_SETTINGS;

    // Normalize admin emails to lowercase
    if (currentSettings.adminEmails && Array.isArray(currentSettings.adminEmails)) {
      currentSettings.adminEmails = currentSettings.adminEmails.map((email: string) =>
        email.toLowerCase().trim()
      );
    }

    return NextResponse.json({
      success: true,
      settings: currentSettings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings - Update settings
export async function POST(request: NextRequest) {
  // Note: Add proper admin authentication if needed

  try {
    const body = await request.json();
    console.log('Received settings update request:', JSON.stringify(body, null, 2));
    console.log('Admin emails in request:', body.adminEmails);

    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const collection = db.collection<AdminSettings>(SETTINGS_COLLECTION);

    // Validate admin emails
    if (body.adminEmails && Array.isArray(body.adminEmails)) {
      console.log('Processing admin emails:', body.adminEmails);
      // Ensure at least one admin email
      if (body.adminEmails.length === 0) {
        return NextResponse.json(
          { success: false, error: 'At least one admin email is required' },
          { status: 400 }
        );
      }

      // Validate email format and normalize to lowercase
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const normalizedEmails: string[] = [];
      for (const email of body.adminEmails) {
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { success: false, error: `Invalid email format: ${email}` },
            { status: 400 }
          );
        }
        // Normalize to lowercase
        normalizedEmails.push(email.toLowerCase().trim());
      }
      // Replace with normalized emails
      body.adminEmails = normalizedEmails;
    }

    // Get existing settings
    const existing = await collection.findOne({ _id: 'main' } as any);
    const existingSettings = existing?.settings || DEFAULT_SETTINGS;

    // Merge settings - body values take precedence, especially for adminEmails
    const mergedSettings = {
      ...DEFAULT_SETTINGS,
      ...existingSettings,
      ...body,
    };

    // If adminEmails is provided in body, use it directly (don't merge)
    if (body.adminEmails && Array.isArray(body.adminEmails)) {
      mergedSettings.adminEmails = body.adminEmails;
      console.log('Final admin emails to save:', mergedSettings.adminEmails);
    }

    // Update or insert settings
    const updateResult = await collection.updateOne(
      { _id: 'main' } as any,
      {
        $set: {
          settings: mergedSettings,
          updatedAt: new Date(),
          updatedBy: 'admin@localhost',
        },
      },
      { upsert: true }
    );

    console.log('Database update result:', {
      matchedCount: updateResult.matchedCount,
      modifiedCount: updateResult.modifiedCount,
      upsertedCount: updateResult.upsertedCount,
    });

    // Verify the save by reading it back
    const verifySettings = await collection.findOne({ _id: 'main' } as any);
    console.log('Verified saved admin emails:', verifySettings?.settings?.adminEmails);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: mergedSettings,
      savedAdminEmails: verifySettings?.settings?.adminEmails,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

