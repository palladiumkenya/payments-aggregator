import { NextRequest, NextResponse } from "next/server";
import { payments } from "@/app/db/schema";
import { db } from "@/app/db/drizzle-client";
import { stkPushRequest } from "@/daraja/stk-push";
import { allowedOrigins, corsOptions } from "@/utils/cors";
import { MPESA_APP_BASE_URL } from "@/config/env";
import { getHealthFacilityMpesaConfig } from "@/config/mpesa-config";

type RequestBody = {
  accountReference: string;
  amount: string;
  phoneNumber: string;
  transactionDesc: string;
  callbackURL: string;
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

  const mfl = requestBody.accountReference.substring(0, 5);
  const billId = requestBody.accountReference.substring(
    6,
    requestBody.accountReference.indexOf("-")
  );

  const healthFacilityMpesaConfig = getHealthFacilityMpesaConfig(mfl);

  if (!healthFacilityMpesaConfig) {
    const res = NextResponse.json(
      { message: "Health facility M-PESA data not configured." },
      { status: 403 }
    );

    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (isAllowedOrigin) {
      res.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      res.headers.set(key, value);
    });

    return res;
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

    const origin = request.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
};

export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const preflightHeaders = {
    ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
    ...corsOptions,
  };
  return NextResponse.json({}, { headers: preflightHeaders });
};
