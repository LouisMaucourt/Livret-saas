import jwt from "jsonwebtoken";

export const verifyApiKey = (req: Request): boolean => {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const base = process.env.BASE_URL ?? "http://localhost:3000";

  return (
    origin === base ||
    (referer?.startsWith(base) ?? false)
  );
};

export const verifyAuth = (req: Request) => {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};