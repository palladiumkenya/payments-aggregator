export const ENVIRONMENT = assertValue<"production" | "development">(
  process.env.ENVIRONMENT as "production" | "development",
  "Missing environment variable: ENVIRONMENT"
);

export const BASE_URL =
  ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

export const MPESA_TRANSACTION_TYPE = assertValue(
  process.env.MPESA_TRANSACTION_TYPE,
  "Missing environment variable: MPESA_TRANSACTION_TYPE"
);

export const MPESA_APP_BASE_URL = assertValue(
  process.env.MPESA_APP_BASE_URL,
  "Missing environment variable: MPESA_APP_BASE_URL"
);

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
