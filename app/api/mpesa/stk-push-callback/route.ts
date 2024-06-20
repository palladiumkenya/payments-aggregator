import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import {
  STKPushErrorCallbackBody,
  STKPushSuccessfulCallbackBody,
} from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  console.log("stk-push-callback-request", req);

  const received: STKPushSuccessfulCallbackBody | STKPushErrorCallbackBody =
    await req.json();

  if (received.Body.stkCallback.ResultCode === 0) {
    await db
      .update(payments)
      .set({ status: "COMPLETE", receiptNumber: "SOME" })
      .where(
        eq(payments.merchantReqId, received.Body.stkCallback.MerchantRequestID)
      );
  } else {
    await db
      .update(payments)
      .set({ status: "FAILED" })
      .where(
        eq(payments.merchantReqId, received.Body.stkCallback.MerchantRequestID)
      );
  }
};
