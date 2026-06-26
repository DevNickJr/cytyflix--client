import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host');

  console.log('Middleware triggered for URL:', hostname);

  // Split hostname to find the subdomain
  // const parsedHost = hostname.split('.');
  // console.log('Parsed host:', {parsedHost});

  // if (url.pathname.startsWith('/agents')) {
  //   return NextResponse.next();
  // }
  
  // 2. Safely parse out the subdomain depending on the environment
  let subdomain = '';

  console.log('Hostname:', hostname, 'Pathname:', url.pathname);
  
  // if (hostname.includes('localhost')) {
  //   // Local development (e.g., duadei-nicholas.localhost:3000)
  //   const pieces = hostname.split('.');
  //   if (pieces.length > 1) subdomain = pieces[0];
  // } else {
    // Production (e.g., duadei-nicholas.cytyflix.vercel.app or duadei-nicholas.cytyflix.app)
    // Replace root production domains to leave only the subdomain behind
    const rootDomain = hostname
      ?.replace('.cytyflix.vercel.app', '')
      ?.replace('.cytyflix.com', '')
      ?.replace('.cytyflix.app', '')
      ?.replace('.localhost:3000', '')
      ?.replace('www.', ''); // Remove www prefix if present


  if (rootDomain !== hostname && rootDomain !== 'cytyflix' && rootDomain !== 'www' && rootDomain.split('.').length === 1) {
    subdomain = rootDomain;
  }


  
  if (subdomain) {
    if (url?.pathname && url.pathname !== '/') {
      console.log(`Rewriting to pathname - "${url.pathname}"`);
      return NextResponse.rewrite(new URL(`${url.pathname}`, req.url));
    }
    // 3. Perform the internal rewrite if a valid subdomain is found
    console.log(`Rewriting subdomain "${subdomain}" to /agents/${subdomain}`);
  
    // This retains the trailing URL path (e.g. ://subdomain.com -> /agents/subdomain/settings)
    return NextResponse.rewrite(new URL(`/agents/${subdomain}`, req.url));
  }

  return NextResponse.next();


  // // Check if a subdomain exists (e.g., duadei-nicholas.localhost:3000)
  // if (parsedHost.length >= 2 && parsedHost[0] !== 'www' && parsedHost[0] !== 'localhost' && parsedHost[0] !== 'cytyflix') {
  //   const subdomain = parsedHost[0];
    
  //   console.log('Detected subdomain:', subdomain);
  //   // Only apply to the /agents route
  //   // if (url.pathname.startsWith('/agents')) {
  //     // Rewrite internally to your dynamic folder structure (e.g., /agents/[agentSlug])
  //     return NextResponse.rewrite(new URL(`/agents/${subdomain}`, req.url));
  //   // }
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

