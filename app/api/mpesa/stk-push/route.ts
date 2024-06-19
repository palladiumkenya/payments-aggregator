import { NextRequest, NextResponse } from "next/server";
import { stkPushRequest } from "daraja-kit";
import { db } from "@/drizzle.config";
import { payments } from "@/db/schema";

const appBaseURL = process.env.APP_BASE_URL;

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { phoneNumber, amount, accountReference } = await req.json();

  const requestBody = {
    accountReference,
    amount,
    callbackURL: `${appBaseURL}/api/mpesa/stk-push-callback`,
    phoneNumber,
    transactionDesc: "SOME DESCRIPTION",
  };

  console.log(requestBody);
  try {
    // TODO Save the data here to a db
    await db.insert(payments).values({
      billId: "some bill id",
      mfl: "some mfl",
      status: "INITIATED",
    });

    const stkPushRes = await stkPushRequest(requestBody);

    return NextResponse.json({ data: stkPushRes }, { status: 200 });
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
