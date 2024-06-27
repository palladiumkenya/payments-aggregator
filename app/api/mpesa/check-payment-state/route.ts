import { db } from "@/app/db/drizzle-client";
import { payments } from "@/app/db/schema";
import { allowedOrigins, corsOptions } from "@/utils/cors";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const body: { requestId: number } = await req.json();

  try {
    const paymentRequests = await db
      .select()
      .from(payments)
      .where(eq(payments.id, body.requestId));

    let response: NextResponse<{
      status: "INITIATED" | "COMPLETE" | "FAILED" | "NOT-FOUND";
    }>;

    if (paymentRequests.length > 0) {
      response = NextResponse.json(
        { status: paymentRequests.at(0)!.status },
        {
          status: 200,
        }
      );
    } else {
      response = NextResponse.json(
        { status: "NOT-FOUND" },
        {
          status: 200,
        }
      );
    }

    const origin = req.headers.get("origin") ?? "";
    const isAllowedOrigin = allowedOrigins.includes(origin);

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
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const preflightHeaders = {
    ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
    ...corsOptions,
  };
  return NextResponse.json({}, { headers: preflightHeaders });
};
