import configData from "../mpesa-config.json";

export type MPESA_CONFIG = {
  MPESA_BUSINESS_SHORT_CODE: string;
  MPESA_CONSUMER_KEY: string;
  MPESA_CONSUMER_SECRET: string;
  MPESA_API_PASS_KEY: string;
};

export const getHealthFacilityMpesaConfig = (
  mfl: string
): MPESA_CONFIG | undefined => {
  if (!configData) {
    throw new Error("Config data not found.");
  }
  const config = configData.find((c) => c.mfl === mfl);
  return config;
};
