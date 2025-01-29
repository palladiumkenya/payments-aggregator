import { db } from "@/app/db/drizzle-client";
import { claims } from "@/app/db/schema";
import {
  ClaimResponse,
  PatientValidationFailureResponse,
  ProfessionalValidationFailureResponse,
} from "@/types";
import { setCorsHeaders } from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const origin = req.headers.get("origin") ?? "";
  const claim = (await req.json()) as
    | ClaimResponse
    | ProfessionalValidationFailureResponse
    | PatientValidationFailureResponse;

  if (claim.resourceType === "OperationOutcome") {
    // WE have cases where the callback will be hit for validation failures i.e patient validation and professional validation
    // since right now I do not know what to do with that info I just return a 200 status code
    const response = NextResponse.json(
      { message: "received" },
      { status: 200 }
    );
    return setCorsHeaders(response, origin);
  }

  const claimResponse: {
    claimId: string;
    status: string;
    comment: string | null;
    notes: string | null;
    approvedAmount: number;
  } = {
    claimId: claim.id,
    status: claim.outcome,
    approvedAmount: claim.total[0].amount.value,
    comment: null,
    notes: null,
  };

  console.log("claim", claim);

  try {
    await db.insert(claims).values(claimResponse);
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
