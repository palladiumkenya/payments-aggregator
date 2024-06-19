import { payments } from "@/db/schema";
import { db } from "@/drizzle.config";
import {
  STKPushErrorCallbackBody,
  STKPushSuccessfulCallbackBody,
} from "daraja-kit";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const text: STKPushSuccessfulCallbackBody | STKPushErrorCallbackBody =
    req.body;

  // TODO update the payment record here
  await db
    .update(payments)
    .set({ status: "COMPLETE" })
    .where(eq(payments.id, 1));

  console.log("stk-push-callback-request", req);
};

export default POST;
