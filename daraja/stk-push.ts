import axios from "axios";
import { generateTimestamp, generatePassword } from "./utils";
import { BASE_URL, ENVIRONMENT } from "../config/env";
import { generateAccessToken } from "./access-token";

import {
  PhoneNumber,
  Amount,
  CallBackURL,
  TransactionDesc,
  AccountReference,
  STKPushBody,
  TransactionType,
  STKPushResponse,
  BusinessShortCode,
} from "daraja-kit";
import { MPESA_CONFIG } from "@/config/mpesa-config";

export type STKPushRequestParam = {
  phoneNumber: PhoneNumber;
  amount: Amount;
  callbackURL: CallBackURL;
  transactionDesc: TransactionDesc;
  accountReference: AccountReference;
};

export const stkPushRequest = async (
  {
    phoneNumber,
    amount,
    callbackURL,
    transactionDesc,
    accountReference,
  }: STKPushRequestParam,
  mpesaConfig: MPESA_CONFIG
) => {
  const { MPESA_BUSINESS_SHORT_CODE } = mpesaConfig;

  try {
    const timestamp = generateTimestamp();

    const password = generatePassword(mpesaConfig, timestamp);

    const stkPushBody: STKPushBody = {
      BusinessShortCode: MPESA_BUSINESS_SHORT_CODE,
      PartyB: MPESA_BUSINESS_SHORT_CODE,
      Timestamp: timestamp,
      Password: password,
      PartyA: phoneNumber,
      PhoneNumber: phoneNumber,
      Amount: ENVIRONMENT === "production" ? amount : "1",
      CallBackURL: callbackURL,
      TransactionDesc: transactionDesc,
      TransactionType: process.env
        .MPESA_TRANSACTION_TYPE as unknown as TransactionType,
      AccountReference: accountReference,
    };

    const accessTokenResponse = await generateAccessToken(mpesaConfig);

    const res = await axios.post<STKPushResponse>(
      `${BASE_URL}/mpesa/stkpush/v1/processrequest`,
      stkPushBody,
      {
        headers: {
          Authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    return res.data;
  } catch (err: any) {
    throw new Error(
      `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
    );
  }
};
