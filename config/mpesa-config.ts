import configData from "../mpesa-config.json";
import { ENVIRONMENT, assertValue } from "./env";

export type MPESA_CONFIG = {
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_API_PASS_KEY: string;
  MPESA_TILL_OR_PAYBILL_NO: string;
  MPESA_TRANSACTION_TYPE: "BUY-GOODS" | "PAYBILL";
};

// HASHMAP
const mpesaConfigMap: { [key: string]: MPESA_CONFIG } = assertValue(
  configData as { [key: string]: MPESA_CONFIG },
  "MISSING MPESA CONFIGURATION FILE"
);

export const getHealthFacilityMpesaConfig = (
  mfl: string
): MPESA_CONFIG | undefined => {
  if (ENVIRONMENT === "development") {
    return mpesaConfigMap["DEV"];
  }

  const config = mpesaConfigMap[mfl];
  return config;
};
