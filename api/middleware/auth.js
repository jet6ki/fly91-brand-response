/**
 * Simple admin auth middleware.
 *
 * For the demo, admin routes are protected by a static bearer token set
 * in ADMIN_TOKEN env var. In production this would be JWT-based with
 * proper user management (Auth0, Clerk, or rolled-your-own).
 *
 * Header format: Authorization: Bearer <ADMIN_TOKEN>
 */

export function requireAdmin(req, res, next) {
  const expectedToken = process.env.ADMIN_TOKEN;

  if (!expectedToken) {
    return res.status(500).json({
      error: 'Server misconfigured: ADMIN_TOKEN not set in environment',
    });
  }

  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Missing or malformed Authorization header. Use: Bearer <token>',
    });
  }

  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Invalid admin token' });
  }

  next();
}
