const UPSTREAM_HOME = 'https://grailpulse-diecast.pages.dev/';
const CSP = "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com; form-action 'self' mailto:; upgrade-insecure-requests";

export default {
  async fetch(request: Request): Promise<Response> {
    const incoming = new URL(request.url);
    const upstream = new URL(UPSTREAM_HOME);
    upstream.search = incoming.search;

    const response = await fetch(new Request(upstream, request));
    const headers = new Headers(response.headers);
    headers.set('Content-Security-Policy', CSP);
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
