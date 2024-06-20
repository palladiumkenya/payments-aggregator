import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import {
  STKPushErrorCallbackBody,
  STKPushSuccessfulCallbackBody,
} from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const received: STKPushSuccessfulCallbackBody = await req.json();

  console.log("received", received);

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
        message: "An error occurred",
      },
      {
        status: 500,
      }
    );
  }
};
