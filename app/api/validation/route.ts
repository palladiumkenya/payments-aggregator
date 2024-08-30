import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  //When this API is hit it automatically completes the transaction.
  return NextResponse.json({
    ResultCode: "0",
    ResultDesc: "Accepted",
  });
};
