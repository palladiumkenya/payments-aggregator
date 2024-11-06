import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { corsOptions } from "@/utils/cors";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body: { billId: string } = await req.json();

  try {
    const paymentRequests = await db
      .select()
      .from(payments)
      .where(eq(payments.billId, body.billId));

    let response: NextResponse<
      Array<{
        requestStatus: string;
        referenceNumber: string | null;
        amount: string;
      }>
    >;

    response = NextResponse.json(
      paymentRequests.map((req) => {
        return {
          requestStatus: req.status,
          referenceNumber: req.receiptNumber,
          amount: req.amount,
        };
      }),
      {
        status: 200,
      }
    );

    const origin = req.headers.get("origin") ?? "";
    // const isAllowedOrigin = allowedOrigins.includes(origin);
    const isAllowedOrigin = true;

    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
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

export const OPTIONS = async (request: NextRequest) => {
  const origin = request.headers.get("origin") ?? "";
  // const isAllowedOrigin = allowedOrigins.includes(origin);
  const isAllowedOrigin = true;

  const preflightHeaders = {
    ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
    ...corsOptions,
  };
  return NextResponse.json({}, { headers: preflightHeaders });
};
