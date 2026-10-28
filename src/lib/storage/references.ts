import { randomInt } from "node:crypto";

/** No 0/O, 1/I: references are read out over the phone. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Human-friendly reference, e.g. FR-261029-K7Q2M (prefix, India date, code). Contains no personal data. */
export function makeReference(prefix: string, now = new Date()) {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const date = ist.toISOString().slice(2, 10).replace(/-/g, "");
  let code = "";
  for (let i = 0; i < 5; i++) code += ALPHABET[randomInt(ALPHABET.length)];
  return `${prefix}-${date}-${code}`;
}
