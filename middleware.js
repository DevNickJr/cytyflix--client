import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  console.log('Middleware triggered for URL:', hostname);

  // Split hostname to find the subdomain
  const parsedHost = hostname.split('.');
  console.log('Parsed host:', {parsedHost});
  
  // Check if a subdomain exists (e.g., duadei-nicholas.localhost:3000)
  if (parsedHost.length >= 2 && parsedHost[0] !== 'www' && parsedHost[0] !== 'localhost' && parsedHost[0] !== 'cytyflix') {
    const subdomain = parsedHost[0];
    
    console.log('Detected subdomain:', subdomain);
    // Only apply to the /agents route
    // if (url.pathname.startsWith('/agents')) {
      // Rewrite internally to your dynamic folder structure (e.g., /agents/[agentSlug])
      return NextResponse.rewrite(new URL(`/agents/${subdomain}`, req.url));
    // }
  }
}

// Add this at the very bottom of your middleware file
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files like CSS/JS)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

