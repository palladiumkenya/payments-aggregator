import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  getHealthFacilityMpesaConfig,
  MPESA_CONFIG,
} from "@/config/mpesa-config";
import { RegisterUrlResponse } from "daraja-kit";
import { generateSafaricomAccessToken } from "@/daraja/access-token";
import { MPESA_APP_BASE_URL, SAFARICOM_BASE_URL } from "@/config/env";

// This is a one-time API call that registers your validation and confirmation URLs
export const POST = async (req: NextRequest) => {
  const requestBody = (await req.json()) as { mfl: string };

  const facilityMpesaConfig = getHealthFacilityMpesaConfig(
    requestBody.mfl
  ) as MPESA_CONFIG;

  if (!facilityMpesaConfig) {
    return NextResponse.json(
      { message: "Health Facility Mpesa Data not configured." },
      { status: 403 }
    );
  }

  const accessTokenResponse = await generateSafaricomAccessToken(
    facilityMpesaConfig
  );

  const res: RegisterUrlResponse = await axios.post(
    `${SAFARICOM_BASE_URL}/mpesa/c2b/v1/registerurl`,
    {
      ShortCode: parseInt(facilityMpesaConfig.MPESA_BUSINESS_SHORT_CODE),
      ResponseType: "Completed",
      ConfirmationURL: `${MPESA_APP_BASE_URL}/api/confirmation`,
      ValidationURL: `${MPESA_APP_BASE_URL}/api/validation`,
    },
    {
      headers: {
        Authorization: `Bearer ${accessTokenResponse.access_token}`,
      },
    }
  );

  if (res.ResponseCode === "0") {
    return NextResponse.json({ message: "success" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "an error might have occurred" },
      { status: 500 }
    );
  }
};
