import { STKPushResponse } from "daraja-kit";

export type KCBAccessTokenResponse = {
  access_token: string;
  token_type: "Bearer" | "Basic";
  //   Probably 3600 seconds
  expires_in: number;
};

export type COOPAccessTokenResponse = {
  access_token: string;
  token_type: "Bearer" | "Basic";
  //   Probably 3600 seconds
  expires_in: number;
};

export type KCBStkPushBody = {
  phoneNumber: string; // The phone number in the format 2547XXXXXXXX, must be a valid Safaricom M-PESA registered number.
  amount: string; // The amount to be sent, must be a whole number (no decimals).
  invoiceNumber: string; // A unique Alpha-Numeric identifier for the transaction, max 12 characters.
  sharedShortCode: boolean; // If true, orgShortCode and orgPassKey will be replaced with internal values.
  orgShortCode: string; // A 5 to 6 digit code for the organization receiving the funds.
  orgPassKey: string; // The password used for encrypting the request.
  callbackUrl: string; // A valid secure URL for receiving M-Pesa API notifications.
  transactionDescription: string; // Additional information/comment, max 13 characters.
};

export type CoopSTKPushBody = {
  MessageReference: string;
  TargetMSISDN: string; // The phone number in the format 2547XXXXXXXX, must be a valid Safaricom M-PESA registered number
  CallBackUrl: string;
  TransactionAmount: string;
  TransactionNarration: string; // a description of some sort
};

export type COOPSTKPushResponse = {
  MessageReference: string;
  MessageDateTime: string;
  MessageCode: string;
  MessageDescription: string;
  TelcoRef: string;
};

export interface KCBStkPushResponse {
  response: STKPushResponse;
  header: Header;
}

export interface Header {
  statusDescription: string;
  statusCode: string;
}
