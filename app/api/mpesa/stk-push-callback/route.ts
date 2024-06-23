import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { allowedOrigins } from "@/utils/cors";
import { STKPushSuccessfulCallbackBody } from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const safaricomOrigins = [
  "http://196.201.214.200",
  "http://196.201.214.206",
  "http://196.201.213.114",
  "http://196.201.214.207",
  "http://196.201.214.208",
  "http://196.201.213.44",
  "http://196.201.212.127",
  "http://196.201.212.138",
  "http://196.201.212.129",
  "http://196.201.212.136",
  "http://196.201.212.74",
  "http://196.201.212.69",
  // with HTTPS
  "https://196.201.214.200",
  "https://196.201.214.206",
  "https://196.201.213.114",
  "https://196.201.214.207",
  "https://196.201.214.208",
  "https://196.201.213.44",
  "https://196.201.212.127",
  "https://196.201.212.138",
  "https://196.201.212.129",
  "https://196.201.212.136",
  "https://196.201.212.74",
  "https://196.201.212.69",
];

export const POST = async (req: NextRequest, res: NextResponse) => {
  const received: STKPushSuccessfulCallbackBody = await req.json();

  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = [...allowedOrigins, ...safaricomOrigins].includes(
    origin
  );

  if (!isAllowedOrigin) {
    return NextResponse.json({ message: "NOT-ALLOWED" }, { status: 401 });
  }

  if (received.Body.stkCallback.ResultCode === 0) {
    const receiptNumber = received.Body.stkCallback.CallbackMetadata.Item.find(
      // @ts-ignore
      (item) => item.Name === "MpesaReceiptNumber"
      // @ts-ignore
    )?.Value;

    await db
      .update(payments)
      .set({ status: "COMPLETE", receiptNumber })
      .where(
        eq(payments.merchantReqId, received.Body.stkCallback.MerchantRequestID)
      );

    return NextResponse.json({ message: "received" }, { status: 200 });
  } else {
    await db
      .update(payments)
      .set({ status: "FAILED" })
      .where(
        eq(payments.merchantReqId, received.Body.stkCallback.MerchantRequestID)
      );

    return NextResponse.json(
      {
        message: "received",
      },
      {
        status: 200,
      }
    );
  }
};
