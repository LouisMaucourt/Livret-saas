import jwt from "jsonwebtoken";

export const verifyAuth = (req: Request) => {
  const cookie = req.headers.get("cookie");

  if (!cookie) {
    return null;
  }

  const token = cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    );

    return decoded;
  } catch {
    return null;
  }
};