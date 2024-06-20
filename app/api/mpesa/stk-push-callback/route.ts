import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { STKPushSuccessfulCallbackBody } from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("stk-push-callback-request", req);

  const received: STKPushSuccessfulCallbackBody = req.body;

  await db
    .update(payments)
    .set({ status: "COMPLETE", receiptNumber: "SOME" })
    .where(
      eq(payments.merchantReqId, received.Body.stkCallback.MerchantRequestID)
    );
};
