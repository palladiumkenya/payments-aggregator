export const ENVIRONMENT = assertValue<"production" | "development">(
  process.env.ENVIRONMENT as "production" | "development",
  "Missing environment variable: ENVIRONMENT"
);

export const SAFARICOM_BASE_URL =
  ENVIRONMENT === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";

// TODO find out the production URL
export const KCB_BASE_URL =
  ENVIRONMENT === "production" ? "" : "https://uat.buni.kcbgroup.com";

// TODO find out the production URL
export const COOP_BASE_URL =
  ENVIRONMENT === "production"
    ? ""
    : "https://openapi-sandbox.co-opbank.co.ke/stkpush/safari";

export const MPESA_APP_BASE_URL = assertValue(
  process.env.MPESA_APP_BASE_URL,
  "Missing environment variable: MPESA_APP_BASE_URL"
);

export const DATABASE_NAME = assertValue(
  process.env.DATABASE_NAME,
  "Missing environment variable: DATABASE_NAME"
);

export const DATABASE_USER = assertValue(
  process.env.DATABASE_USER,
  "Missing environment variable: DATABASE_USER"
);

export const DATABASE_PASSWORD = assertValue(
  process.env.DATABASE_PASSWORD,
  "Missing environment variable: DATABASE_PASSWORD"
);

export const DATABASE_HOST = assertValue(
  process.env.DATABASE_HOST,
  "Missing environment variable: DATABASE_HOST"
);

export const DB_URL = assertValue(
  process.env.DB_URL,
  "Missing environment variable: DB_URL"
);

export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
