/**
 * OTP Redis Key Factory — Email-Based OTP Login
 *
 * This module owns every Redis key and TTL used in the OTP login flow.
 * There are exactly FOUR keys per email address, each with a single, clear job:
 *
 *  aa:otp:code:<email>
 *    — The OTP payload (code + metadata) stored as JSON.
 *    — Created on every successful OTP request (overwrites any previous code).
 *    — TTL: OTP_CODE_TTL (10 min). After expiry the code is simply gone.
 *
 *  aa:otp:cooldown:<email>
 *    — Resend rate-limiter. Presence = "too soon, wait X more seconds".
 *    — Set immediately after an OTP email is dispatched.
 *    — TTL: OTP_RESEND_COOLDOWN_TTL (30 s).
 *    — The remaining TTL of this key is returned to the client so the
 *      frontend can show a live countdown ("Resend in 28 s…").
 *
 *  aa:otp:attempts:<email>
 *    — Integer counter incremented on every wrong code submission.
 *    — Reset (deleted) on a successful verification.
 *    — TTL: OTP_ATTEMPTS_WINDOW_TTL (15 min). If the user abandons
 *      the page for 15 min, the slate is wiped and they start fresh.
 *
 *  aa:otp:locked:<email>
 *    — Lock flag. Presence = "account locked, no verify allowed".
 *    — Set when attempts counter hits OTP_MAX_ATTEMPTS.
 *    — TTL: OTP_LOCK_TTL (15 min). Intentionally NOT extended on further
 *      bad requests — attackers cannot stretch the lock by hammering.
 *    — The remaining TTL is returned so the client can show
 *      "Try again in N minutes".
 */

// ─── Namespace ────────────────────────────────────────────────────────────────

/** Application prefix — keeps our keys isolated on a shared Upstash instance */
const NS = 'aa:otp';

// ─── TTLs (seconds) ───────────────────────────────────────────────────────────

export const OTP_TTL = {
  /**
   * How long the OTP code itself is valid.
   * After this the code simply ceases to exist in Redis — no extra cleanup needed.
   */
  CODE: 10 * 60,            // 10 minutes

  /**
   * Minimum gap between two OTP send requests for the same email.
   * The client should read the remaining TTL and show a live countdown.
   */
  RESEND_COOLDOWN: 30,      // 30 seconds

  /**
   * How long the wrong-attempt counter survives.
   * Matches the code TTL so counters don't outlive the code window.
   */
  ATTEMPTS_WINDOW: 10 * 60, // 10 minutes

  /**
   * How long an email is locked after too many failed attempts.
   * Long enough to deter brute-force, short enough to not infuriate real users.
   */
  LOCK: 15 * 60,            // 15 minutes
} as const;

// ─── Limits ───────────────────────────────────────────────────────────────────

/**
 * Maximum wrong OTP submissions before the email is locked.
 * After this the user must wait OTP_TTL.LOCK seconds before retrying.
 */
export const OTP_MAX_ATTEMPTS = 5;

/**
 * Maximum number of OTP send requests per email within one code window.
 * Prevents OTP-bombing (attacker spamming resend to run up your email bill).
 * On the (RESEND_COOLDOWN × OTP_MAX_SENDS) window the user hits a hard stop.
 */
export const OTP_MAX_SENDS = 5;

// ─── Key builders ─────────────────────────────────────────────────────────────

/**
 * Stores the OTP payload (code + metadata) as a JSON string.
 *
 * Set with: SET key <json> EX OTP_TTL.CODE
 * Delete:   DEL key  (after successful verification — optional, TTL handles it)
 *
 * @example otpCodeKey('alice@example.com') → "aa:otp:code:alice@example.com"
 */
export function otpCodeKey(email: string): string {
  return `${NS}:code:${email.toLowerCase().trim()}`;
}

/**
 * Resend rate-limiter flag.
 * Key exists  → still in cooldown window, return remaining TTL to client.
 * Key missing → allowed to send a new OTP.
 *
 * Set with: SET key 1 EX OTP_TTL.RESEND_COOLDOWN NX
 *   (NX so a concurrent second request can't reset the timer)
 */
export function otpCooldownKey(email: string): string {
  return `${NS}:cooldown:${email.toLowerCase().trim()}`;
}

/**
 * Wrong-attempt counter (Redis integer).
 * Incremented via INCR on each bad submission.
 * Deleted via DEL on successful verification.
 *
 * Set initial TTL with: EXPIRE key OTP_TTL.ATTEMPTS_WINDOW (after first INCR)
 */
export function otpAttemptsKey(email: string): string {
  return `${NS}:attempts:${email.toLowerCase().trim()}`;
}

/**
 * Account lock flag.
 * Key exists  → locked. Read remaining TTL to show "Try again in N min".
 * Key missing → not locked.
 *
 * Set with: SET key 1 EX OTP_TTL.LOCK
 * NOT extended on further bad requests — attacker can't stretch the lock.
 */
export function otpLockedKey(email: string): string {
  return `${NS}:locked:${email.toLowerCase().trim()}`;
}

// ─── Stored value shape ───────────────────────────────────────────────────────

/**
 * The JSON object stored under otpCodeKey().
 *
 * Store:   redis.set(otpCodeKey(email), JSON.stringify(payload), 'EX', OTP_TTL.CODE)
 * Retrieve: JSON.parse(await redis.get(otpCodeKey(email)))
 */
export interface OtpPayload {
  /**
   * The 6-digit code shown in the email.
   * Store as a bcrypt hash in production if you want to avoid plaintext codes
   * sitting in Redis (Upstash encrypts at rest, but defence-in-depth matters).
   */
  codeHash: string;

  /** ISO-8601 timestamp of when this code was generated — for audit logs */
  issuedAt: string;

  /**
   * Hard expiry as a Unix timestamp (ms).
   * Redundant with the Redis TTL but useful for the service layer to
   * double-check without querying TTL, and for logging purposes.
   */
  expiresAt: number;

  /** The normalised email this code was issued for */
  email: string;

  /**
   * How many times an OTP has been requested for this email in the current
   * window. Embedded in the payload so we can enforce OTP_MAX_SENDS without
   * a separate Redis key.
   */
  sendCount: number;
}
