import crypto from "crypto";

export function generateRandomTokenHex(bytes = 32) {
  const token = crypto.randomBytes(bytes).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hashed };
}
