import { KCB_BASE_URL, SAFARICOM_BASE_URL } from "@/config/env";
import { KCB_CONFIG, MPESA_CONFIG } from "@/config/mpesa-config";
import { KCBAccessTokenResponse } from "@/types";
import axios from "axios";
import { AccessTokenResponse } from "daraja-kit";

export const generateSafaricomAccessToken = async (
  mpesaConfig: MPESA_CONFIG
): Promise<AccessTokenResponse> => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = mpesaConfig;
  const credentials = `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`;
  const encodedAuthString = Buffer.from(credentials).toString("base64");

  try {
    const res = await axios.get(
      `${SAFARICOM_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${encodedAuthString}`,
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

export const generateKCBAccessToken = async (
  KCBConfig: KCB_CONFIG
): Promise<KCBAccessTokenResponse> => {
  const { KCB_CONSUMER_KEY, KCB_CONSUMER_SECRET } = KCBConfig;
  const credentials = `${KCB_CONSUMER_KEY}:${KCB_CONSUMER_SECRET}`;
  const encodedAuthString = Buffer.from(credentials).toString("base64");

  try {
    const res = await axios.post(
      `${KCB_BASE_URL}/token?grant_type=client_credentials`,
      null,
      {
        headers: {
          Authorization: `Basic ${encodedAuthString}`,
          "Content-Type": "application/x-www-form-urlencoded",
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
