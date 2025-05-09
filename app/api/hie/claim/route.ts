import { db } from "@/app/db/drizzle-client";
import { claims } from "@/app/db/schema";
import { eq, desc } from "drizzle-orm";
import { setCorsHeaders } from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET all claims
 */
export const GET = async (req: NextRequest) => {
  const origin = req.headers.get("origin") ?? "";

  try {
    // Parse query parameters
    const url = new URL(req.url);
    const claimId = url.searchParams.get("claimId");
    const status = url.searchParams.get("status");
    const all = url.searchParams.get("all") === "true";
    let result;

    // Get claim by ID
    if (claimId) {
      result = await db
        .select()
        .from(claims)
        .where(eq(claims.claimId, claimId));

      if (result.length === 0) {
        const response = NextResponse.json(
          { message: `Claim with ID ${claimId} not found` },
          { status: 404 }
        );
        return setCorsHeaders(response, origin);
      }

      const response = NextResponse.json(result[0], { status: 200 });
      return setCorsHeaders(response, origin);
    }

    // Get claims by status with optional all parameter
    if (status) {
      if (all) {
        // Get all claims with specified status
        result = await db
          .select()
          .from(claims)
          .where(eq(claims.status, status));
      } else {
        // Get only latest claim with specified status
        result = await db
          .select()
          .from(claims)
          .where(eq(claims.status, status))
          .orderBy(desc(claims.createdAt))
          .limit(1);
      }
    } else if (all) {
      // Get all claims explicitly requested
      result = await db.select().from(claims);
    } else {
      // Default: Get only the latest claim
      result = await db
        .select()
        .from(claims)
        .orderBy(desc(claims.createdAt))
        .limit(1);
    }

    const response = NextResponse.json(result, { status: 200 });
    return setCorsHeaders(response, origin);
  } catch (error) {
    console.error("Error fetching claims:", error);
    const response = NextResponse.json(
      { message: "An error occurred while fetching claims." },
      { status: 500 }
    );

    return setCorsHeaders(response, origin);
  }
};

/**
 * GET a specific claim by ID from route parameters
 */
export const OPTIONS = async (
  req: NextRequest,
  { params }: { params: { claimId: string } }
) => {
  const origin = req.headers.get("origin") ?? "";
  const { claimId } = params;

  try {
    const result = await db
      .select()
      .from(claims)
      .where(eq(claims.claimId, claimId));

    if (result.length === 0) {
      const response = NextResponse.json(
        { message: `Claim with ID ${claimId} not found` },
        { status: 404 }
      );
      return setCorsHeaders(response, origin);
    }

    const response = NextResponse.json(result[0], { status: 200 });
    return setCorsHeaders(response, origin);
  } catch (error) {
    console.error(`Error fetching claim ${claimId}:`, error);
    const response = NextResponse.json(
      { message: "An error occurred while fetching the claim." },
      { status: 500 }
    );

    return setCorsHeaders(response, origin);
  }
};
