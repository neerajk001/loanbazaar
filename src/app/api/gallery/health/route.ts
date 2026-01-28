import { NextRequest, NextResponse } from 'next/server';
import { detectSource } from '@/lib/source-detection';

/**
 * Health check endpoint for gallery API 
 * GET /api/gallery/health
 * 
 * Use this to verify:
 * 1. The gallery API routes are deployed
 * 2. Source detection is working
 * 3. Server is responding with JSON
 */
export async function GET(request: NextRequest) {
  try {
    const source = detectSource(request);
    const headers = {
      origin: request.headers.get('origin') || 'none',
      referer: request.headers.get('referer') || 'none',
      host: request.headers.get('host') || 'none',
      'x-application-source': request.headers.get('x-application-source') || 'none',
    };

    return NextResponse.json({
      success: true,
      message: 'Gallery API is working!',
      timestamp: new Date().toISOString(),
      detectedSource: source,
      requestHeaders: headers,
      endpoints: {
        getAllEvents: '/api/gallery/events',
        getFeaturedEvents: '/api/gallery/events?featured=true',
        getSingleEvent: '/api/gallery/events/:id',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}



