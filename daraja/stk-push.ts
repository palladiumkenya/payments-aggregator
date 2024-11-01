import axios from "axios";
import { generateTimestamp, generatePassword } from "./utils";
import {
  COOP_BASE_URL,
  ENVIRONMENT,
  KCB_BASE_URL,
  SAFARICOM_BASE_URL,
} from "../config/env";

import {
  PhoneNumber,
  Amount,
  CallBackURL,
  TransactionDesc,
  AccountReference,
  STKPushBody,
  STKPushResponse,
} from "daraja-kit";
import { COOP_CONFIG, KCB_CONFIG, MPESA_CONFIG } from "@/config/mpesa-config";
import {
  generateCoopAccessToken,
  generateKCBAccessToken,
  generateSafaricomAccessToken,
} from "./access-token";
import {
  CoopSTKPushBody,
  COOPSTKPushResponse,
  KCBStkPushBody,
  KCBStkPushResponse,
} from "@/types";

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
  config: MPESA_CONFIG | KCB_CONFIG | COOP_CONFIG
) => {
  // FOR NATIVE MPESA HEALTH FACILITIES
  if ("MPESA_BUSINESS_SHORT_CODE" in config) {
    const {
      MPESA_BUSINESS_SHORT_CODE,
      MPESA_TILL_OR_PAYBILL_NO,
      MPESA_TRANSACTION_TYPE,
    } = config;

    try {
      const timestamp = generateTimestamp();

      const password = generatePassword(config, timestamp);

      const stkPushBody: STKPushBody = {
        BusinessShortCode: MPESA_BUSINESS_SHORT_CODE,
        PartyB: MPESA_TILL_OR_PAYBILL_NO,
        Timestamp: timestamp,
        Password: password,
        PartyA: phoneNumber,
        PhoneNumber: phoneNumber,
        Amount: ENVIRONMENT === "production" ? amount : "1",
        CallBackURL: callbackURL,
        TransactionDesc: transactionDesc,
        TransactionType:
          MPESA_TRANSACTION_TYPE === "BUY-GOODS"
            ? "CustomerBuyGoodsOnline"
            : "CustomerPayBillOnline",
        AccountReference: accountReference,
      };

      const accessTokenResponse = await generateSafaricomAccessToken(config);

      const res = await axios.post<STKPushResponse>(
        `${SAFARICOM_BASE_URL}/mpesa/stkpush/v1/processrequest`,
        stkPushBody,
        {
          headers: {
            Authorization: `Bearer ${accessTokenResponse.access_token}`,
          },
        }
      );

      return res.data;
    } catch (err: any) {
      // TODO. Find some sort of logging service.
      console.error("stk-push-error", err);
      throw new Error(
        `Error occurred with status code ${err.response?.status}, ${err.response?.statusText}`
      );
    }
  }

  // FOR COOP MPESA HEALTH FACILITIES
  if ("COOP_CONSUMER_KEY" in config) {
    const coopAccessTokenResponse = await generateCoopAccessToken(config);

    const coopSTKPushBody: CoopSTKPushBody = {
      // TODO find out the correct message reference once the correct documentation is provided
      MessageReference: "SOME MESSAGE REFERENCE",
      TargetMSISDN: phoneNumber,
      CallBackUrl: callbackURL,
      TransactionAmount: amount,
      TransactionNarration: transactionDesc,
    };

    const res = await axios.post<COOPSTKPushResponse>(
      `${COOP_BASE_URL}`,
      coopSTKPushBody,
      {
        headers: {
          Authorization: `Bearer ${coopAccessTokenResponse.access_token}`,
        },
      }
    );

    return res.data;
  }

  // FOR KCB HEALTH FACILITIES
  const kcbAccessTokenResponse = await generateKCBAccessToken(config);
  const kcbStkPushBody: KCBStkPushBody = {
    phoneNumber: phoneNumber,
    amount: amount,
    invoiceNumber: `${config.KCB_SHORT_CODE}-${config.ACCOUNT_REFERENCE}`,
    sharedShortCode: true,
    orgShortCode: "",
    orgPassKey: "",
    callbackUrl: callbackURL,
    transactionDescription: transactionDesc,
  };

  const res = await axios.post<KCBStkPushResponse>(
    `${KCB_BASE_URL}/mm/api/request/1.0.0/stkpush`,
    kcbStkPushBody,
    {
      headers: {
        Authorization: `Bearer ${kcbAccessTokenResponse.access_token}`,
      },
    }
  );

  return res.data.response;
};
