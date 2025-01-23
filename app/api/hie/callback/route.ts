import { db } from "@/app/db/drizzle-client";
import { claims } from "@/app/db/schema";
import { setCorsHeaders } from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const origin = req.headers.get("origin") ?? "";

  const claim = (await req.json()) as {
    mfl: string;
    claimCode: string;
    status: "SUBMITTED" | "COMPLETED" | "REJECTED";
    comment: string | null;
    notes: string | null;
    approvedAmount: number;
  };

  console.log("claim", claim);

  if (
    !claim.mfl ||
    !claim.claimCode ||
    !claim.status ||
    claim.approvedAmount === null
  ) {
    const response = NextResponse.json(
      { message: "Missing required fields." },
      { status: 400 }
    );
    return setCorsHeaders(response, origin);
  }

  try {
    await db.insert(claims).values(claim);
    const response = NextResponse.json(
      { message: "received" },
      {
        status: 200,
      }
    );

    return setCorsHeaders(response, origin);
  } catch (error) {
    const response = NextResponse.json(
      { message: "An error occurred while processing the request." },
      { status: 500 }
    );

    return setCorsHeaders(response, origin);
  }
};
