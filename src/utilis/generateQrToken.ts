import crypto from "crypto"

export const generateQrToken = () => crypto.randomBytes(8).toString("base64url")