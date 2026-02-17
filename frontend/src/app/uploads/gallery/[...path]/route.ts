
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;

        // Decode path segments to handle spaces and special characters
        const decodedSegments = pathSegments.map(segment => decodeURIComponent(segment));

        // Construct file path
        // The path segments correspond to the subdirectories and filename
        const filePath = path.join(process.cwd(), 'public', 'uploads', 'gallery', ...decodedSegments);

        // Security check: Ensure the path is within the allowed directory
        const allowedDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
        const resolvedPath = path.resolve(filePath);

        if (!resolvedPath.startsWith(allowedDir)) {
            console.error(`[Access Denied] Attempted access to: ${resolvedPath}`);
            return NextResponse.json(
                { success: false, error: 'Access denied' },
                { status: 403 }
            );
        }

        // Check if file exists
        if (!existsSync(filePath)) {
            console.warn(`[File Not Found] ${filePath}`);
            return NextResponse.json(
                { success: false, error: 'File not found' },
                { status: 404 }
            );
        }

        // Determine Content-Type
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'application/octet-stream';

        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        // Read and return file
        const fileBuffer = await fs.readFile(filePath);

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                // Cache for 1 hour locally, 1 year in CDNs (if applicable), validate if needed
                'Cache-Control': 'public, max-age=3600, must-revalidate',
            },
        });

    } catch (error) {
        console.error('Error serving image:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
