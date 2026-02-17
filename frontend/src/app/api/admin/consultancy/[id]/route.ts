import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { CONSULTANCY_REQUESTS_COLLECTION, ConsultancyRequest } from '@/models/ConsultancyRequest';

// GET /api/admin/consultancy/[id] - Get single consultancy request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Note: Add proper admin authentication if needed

  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const resolvedParams = await Promise.resolve(params);
    const requestId = resolvedParams.id;

    const collection = db.collection<ConsultancyRequest>(CONSULTANCY_REQUESTS_COLLECTION);
    const consultancyRequest = await collection.findOne({ requestId });

    if (!consultancyRequest) {
      return NextResponse.json(
        { success: false, error: 'Consultancy request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      request: consultancyRequest,
    });
  } catch (error) {
    console.error('Error fetching consultancy request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/consultancy/[id] - Update consultancy request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Note: Admin authentication is handled in the admin layout

  try {
    const body = await request.json();
    const { status, notes } = body;
    const resolvedParams = await Promise.resolve(params);
    const requestId = resolvedParams.id;

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('loan-sarathi');

    const statusEntry = {
      status,
      updatedAt: new Date(),
      updatedBy: 'Admin',
      updatedByEmail: 'admin@loansarathi.com',
      notes: notes || '',
    };

    const collection = db.collection<ConsultancyRequest>(CONSULTANCY_REQUESTS_COLLECTION);
    const result = await collection.updateOne(
      { requestId },
      {
        $set: { status, updatedAt: new Date() },
        $push: { statusHistory: statusEntry as any },
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        success: true,
        message: 'Consultancy request status updated successfully',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Consultancy request not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error updating consultancy request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

