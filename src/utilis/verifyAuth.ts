import jwt from "jsonwebtoken";

export const cookie = req.headers.get("cookie");
export const verifyAuth = (req) => {
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

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return decoded;
  } catch {
    return null;
  }
};