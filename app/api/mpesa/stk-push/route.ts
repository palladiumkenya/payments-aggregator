import { NextRequest, NextResponse } from "next/server";
import { stkPushRequest } from "daraja-kit";
import { payments } from "@/app/db/schema";
import { db } from "@/app/db/drizzle-client";

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
    callbackURL: `${process.env.MPESA_APP_BASE_URL}/api/mpesa/stk-push-callback`,
    phoneNumber,
    transactionDesc: "SOME DESCRIPTION",
  };

  // {
  //   accountReference: '15339#0211-3',
  //   amount: '200',
  //   callbackURL: 'https://compass-tau.vercel.app/api/mpesa/stk-push-callback',
  //   phoneNumber: '254719428019',
  //   transactionDesc: 'SOME DESCRIPTION'
  // }

  console.log(requestBody);

  const mfl = requestBody.accountReference.substring(0, 5);
  const billId = requestBody.accountReference.substring(
    6,
    requestBody.accountReference.indexOf("-")
  );

  try {
    const stkPushRes = await stkPushRequest(requestBody);

    await db.insert(payments).values({
      mfl,
      billId,
      status: "INITIATED",
      amount: requestBody.amount,
      phoneNumber: requestBody.phoneNumber,
      merchantReqId: stkPushRes.MerchantRequestID,
    });

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
