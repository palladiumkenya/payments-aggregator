import { MPESA_CONFIG } from "@/config/mpesa-config";

/**
 * Generates a timestamp in the format of YEAR+MONTH+DATE+HOUR+MINUTE+SECOND (YYYYMMDDHHMMSS).
 * @returns {string} Timestamp in the specified format.
 * @example generateTimestamp(); // Returns "20230926124530" (for September 26, 2023, 12:45:30)
 */
export function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear().toString().padStart(4, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const date = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  return `${year}${month}${date}${hours}${minutes}${seconds}`;
}

export const generatePassword = (
  mpesaConfig: MPESA_CONFIG,
  timestamp: string
): string => {
  const { MPESA_BUSINESS_SHORT_CODE, MPESA_API_PASS_KEY } = mpesaConfig;

  const concatenatedString = `${MPESA_BUSINESS_SHORT_CODE}${MPESA_API_PASS_KEY}${timestamp}`;
  const encodedString = Buffer.from(concatenatedString).toString("base64");

  return encodedString;
};

// {
//   "BusinessShortCode": "174379",
//   "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",
//   "Password" : 'NzYxNzcyMGM0Njg3Yzc2NDU3NjAzYzU4OGY3NjFiYTZhZGMzYTNjYWRmMjZkODBmYWM3YTNiZjJjYjI1ZjhkYmNmYTIyNTYyMDI0MDYyNzE3MjE0Mw==',
//   "Timestamp":"20160216165627",
//   "TransactionType": "CustomerPayBillOnline",
//   "Amount": "1",
//   "PartyA":"254708374149",
//   "PartyB":"174379",
//   "PhoneNumber":"254708374149",
//   "CallBackURL": "https://mydomain.com/pat",
//   "AccountReference":"Test",
//   "TransactionDesc":"Test"
// }
