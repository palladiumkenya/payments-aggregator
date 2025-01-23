import { db } from "@/app/db/drizzle-client";
import { claims } from "@/app/db/schema";
import { setCorsHeaders } from "@/utils/cors";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const origin = req.headers.get("origin") ?? "";
  const searchObject = (await req.json()) as {
    mflCode: string;
    claimCode: string;
  };

  if (!searchObject.mflCode || !searchObject.claimCode) {
    const response = NextResponse.json({
      status: 400,
      json: { message: "Missing required fields." },
    });

    return setCorsHeaders(response, origin);
  }

  const selectedClaims = await db
    .select()
    .from(claims)
    .where(
      and(
        eq(claims.mfl, searchObject.mflCode),
        eq(claims.claimCode, searchObject.claimCode)
      )
    );

  if (selectedClaims.length === 0) {
    const response = NextResponse.json(
      { message: "Claim not found." },
      { status: 404 }
    );
    return setCorsHeaders(response, origin);
  }

  const response = NextResponse.json(selectedClaims, { status: 200 });

  return setCorsHeaders(response, origin);
};
