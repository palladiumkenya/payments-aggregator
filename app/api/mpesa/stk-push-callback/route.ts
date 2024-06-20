import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { STKPushSuccessfulCallbackBody } from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("stk-push-callback-request", req);

  const text: STKPushSuccessfulCallbackBody = req.body;

  // TODO update the payment record here
  await db
    .update(payments)
    .set({ status: "COMPLETE", receiptNumber: "SOME" })
    .where(eq(payments.id, 1));
};

export default POST;
