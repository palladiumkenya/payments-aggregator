import configData from "../mpesa-config.json";
import { ENVIRONMENT, assertValue } from "./env";

export type Config = {
  NATIVE: { [key: string]: MPESA_CONFIG };
  KCB: { [key: string]: KCB_CONFIG };
  COOP: { [key: string]: COOP_CONFIG };
};

export type MPESA_CONFIG = {
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_API_PASS_KEY: string;
  MPESA_TILL_OR_PAYBILL_NO: string;
  MPESA_TRANSACTION_TYPE: "BUY-GOODS" | "PAYBILL";
};

export type KCB_CONFIG = {
  ACCOUNT_REFERENCE: string;
  KCB_SHORT_CODE: string;
  KCB_CONSUMER_KEY: string;
  KCB_CONSUMER_SECRET: string;
};

export type COOP_CONFIG = {
  COOP_CONSUMER_KEY: string;
  COOP_CONSUMER_SECRET: string;
};

const config: Config = assertValue(
  configData as Config,
  "MISSING CONFIGURATION FILE"
);

export const getHealthFacilityMpesaConfig = (
  mfl: string
): MPESA_CONFIG | KCB_CONFIG | undefined | COOP_CONFIG => {
  const facilityConfig =
    config.NATIVE[mfl] ?? config.KCB[mfl] ?? config.COOP[mfl];
  return facilityConfig;
};
