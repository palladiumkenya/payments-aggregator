import { NextRequest, NextResponse } from "next/server";
import { stkPushRequest } from "daraja-kit";
import { payments } from "@/app/db/schema";
import { db } from "@/app/db/drizzle-client";

const MPESA_APP_BASE_URL = process.env.APP_BASE_URL;

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { phoneNumber, amount, accountReference } = await req.json();

  const requestBody: {
    accountReference: string;
    amount: string;
    phoneNumber: string;
    transactionDesc: string;
    callbackURL: string;
  } = {
    accountReference,
    amount,
    callbackURL: `${MPESA_APP_BASE_URL}/api/mpesa/stk-push-callback`,
    phoneNumber,
    transactionDesc: "SOME DESCRIPTION",
  };

  console.log(requestBody);

  const mfl = requestBody.accountReference.substring(0, 5);
  const billId = requestBody.accountReference.substring(
    6,
    requestBody.accountReference.indexOf("-")
  );

  try {
    const stkPushRes = await stkPushRequest(requestBody);

    const res = await db
      .insert(payments)
      .values({
        mfl,
        billId,
        status: "INITIATED",
        amount: requestBody.amount,
        phoneNumber: requestBody.phoneNumber,
        merchantReqId: stkPushRes.MerchantRequestID,
      })
      .returning({ requestId: payments.id });

    return NextResponse.json(
      { requestId: res.at(0)?.requestId },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err: any) {
    console.error(err);
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

export const OPTIONS = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
};
