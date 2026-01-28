import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const SETTINGS_COLLECTION = 'adminSettings';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection(SETTINGS_COLLECTION).findOne({ _id: 'main' } as any);
    
    const adminEmails = settings?.settings?.adminEmails || [];
    
    return NextResponse.json({
      success: true,
      adminEmails: adminEmails,
      source: settings ? 'database' : 'default (no database entry found)',
      message: `Found ${adminEmails.length} admin email(s) configured`,
    });
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch admin emails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

