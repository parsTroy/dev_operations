/**
 * Normalizes domain to always use www version for consistency
 */
export function normalizeDomain(domain: string): string {
  // Remove protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, '');
  
  // Always use www version for consistency
  if (!cleanDomain.startsWith('www.')) {
    return `https://www.${cleanDomain}`;
  }
  
  return `https://${cleanDomain}`;
}

/**
 * Gets the current domain from the request
 */
export function getCurrentDomain(request: Request): string {
  const host = request.headers.get('host') || '';
  return normalizeDomain(host);
}

/**
 * Checks if the current request is using the non-www version
 */
export function isNonWwwRequest(request: Request): boolean {
  const host = request.headers.get('host') || '';
  return !host.startsWith('www.') && host.includes('devoperations.ca');
}
