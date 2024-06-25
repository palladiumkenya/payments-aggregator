export const MPESA_APP_BASE_URL = assertValue(
  process.env.MPESA_APP_BASE_URL,
  "Missing environment variable: MPESA_APP_BASE_URL"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
