import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  //When this API is hit it does nothing for now. The use case of this API is not currently yet defined but some facilities may register this URL.
  return NextResponse.json({ message: "confirmed" }, { status: 200 });
};
