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
    mfl: string;
    claimCode: string;
    status: string;
    comment: string | null;
    notes: string | null;
    approvedAmount: number;
  } = {
    //@ts-ignore TODO Temporarily as we wait for the mfl code to be passed
    mfl: claim.mfl,
    //@ts-ignore TODO Temporarily as we wait for the claim code to be passed
    claimCode: claim.claimCode,
    status: claim.outcome,
    comment: null,
    notes: null,
    approvedAmount: claim.total[0].amount.value,
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
