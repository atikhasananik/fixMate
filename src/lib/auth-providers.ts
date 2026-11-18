/**
 * Google sign-in is optional: it is enabled only when both OAuth credentials
 * are present. Register `${BETTER_AUTH_URL}/api/auth/callback/google` in the
 * Google Cloud Console after adding them to `.env`.
 */
export function isGoogleAuthEnabled() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );
}
