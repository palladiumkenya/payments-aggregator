import configData from "../mpesa-config.json";
import { assertValue } from "./env";

export type MPESA_CONFIG = {
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_API_PASS_KEY: string;
};

// HASHMAP
const mpesaConfigMap: { [key: string]: MPESA_CONFIG } = assertValue(
  configData,
  "MISSING MPESA CONFIGURATION FILE"
);

export const getHealthFacilityMpesaConfig = (
  mfl: string
): MPESA_CONFIG | undefined => {
  const config = mpesaConfigMap[mfl];
  return config;
};
