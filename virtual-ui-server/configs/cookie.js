/* Client and server are deployed on different domains in production, so the
   auth cookie has to be cross-site (SameSite=None requires Secure=true).
   Locally both run on localhost over http, where strict/insecure is fine. */
const isProd = process.env.NODE_ENV === "production" || !!process.env.VERCEL;

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "strict",
};

export const authCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
