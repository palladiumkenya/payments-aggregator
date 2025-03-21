import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { MPESA_APP_BASE_URL } from "@/config/env";
import { getHealthFacilityMpesaConfig } from "@/config/mpesa-config";
import { stkPushRequest } from "@/daraja/stk-push";
import { corsOptions, setCorsHeaders } from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  accountReference: string;
  amount: string;
  phoneNumber: string;
  transactionDesc: string;
  callbackURL: string;
};

export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = true;

  const preflightHeaders = {
    ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
    ...corsOptions,
  };
  return NextResponse.json({}, { headers: preflightHeaders });
};

export const POST = async (request: NextRequest) => {
  const { phoneNumber, amount, accountReference } = await request.json();

  const requestBody: RequestBody = {
    accountReference,
    amount,
    callbackURL: `${MPESA_APP_BASE_URL}/api/stk-push-callback`,
    phoneNumber,
    transactionDesc: "HMIS Payment",
  };

  const origin = request.headers.get("origin") ?? "";

  const mfl = requestBody.accountReference.substring(0, 5);
  const billId = requestBody.accountReference.split("#").at(-1)!;
  const healthFacilityMpesaConfig = getHealthFacilityMpesaConfig(mfl);

  if (!healthFacilityMpesaConfig) {
    const res = NextResponse.json(
      { message: "Health facility payment data not configured." },
      { status: 403 }
    );

    return setCorsHeaders(res, origin);
  }

  try {
    const stkPushRes = await stkPushRequest(
      requestBody,
      healthFacilityMpesaConfig
    );

    const dbRes = await db.insert(payments).values({
      mfl,
      billId,
      status: "INITIATED",
      amount: requestBody.amount,
      phoneNumber: requestBody.phoneNumber,
      merchantReqId: stkPushRes.MerchantRequestID,
    });

    const response = NextResponse.json(
      { requestId: dbRes[0].insertId },
      {
        status: 200,
      }
    );

    return setCorsHeaders(response, origin);
  } catch (err: any) {
    console.error("Error inserting payment or processing request:", err);

    const response = NextResponse.json(
      { message: "An error occurred while processing the request." },
      { status: 500 }
    );

    return setCorsHeaders(response, origin);
  }
};
