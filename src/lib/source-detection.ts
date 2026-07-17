import { NextRequest } from 'next/server';

/**
 * Source detection utility
 * For local development - defaults to 'web' source
 * Can be customized per client by using x-application-source header
 */
export function detectSource(request: NextRequest): 'loan-sarathi' | 'smartmumbaisolutions' {
  // Check for explicit source header (highest priority)
  const explicitSource = request.headers.get('x-application-source')?.toLowerCase();
  if (explicitSource === 'smartmumbaisolutions' || explicitSource === 'smartmumbai') {
    console.log('[Source Detection] Using explicit header: smartmumbaisolutions');
    return 'smartmumbaisolutions';
  }
  if (explicitSource === 'loan-sarathi' || explicitSource === 'loansarathi') {
    console.log('[Source Detection] Using explicit header: loan-sarathi');
    return 'loan-sarathi';
  }
  
  // For localhost development, default to loan-sarathi
  // This can be changed per client by updating the default or using headers
  console.log('[Source Detection] Localhost detected - defaulting to loan-sarathi');
  return 'loan-sarathi';
}

/**
 * Check if source is allowed for a specific endpoint
 */
export function isSourceAllowed(
  source: 'loan-sarathi' | 'smartmumbaisolutions',
  endpoint: string
): boolean {
  // Consultancy endpoint is only for loan-sarathi
  if (endpoint.includes('/api/consultancy')) {
    return source === 'loan-sarathi';
  }
  
  // All other endpoints are allowed for both sources
  return true;
}



