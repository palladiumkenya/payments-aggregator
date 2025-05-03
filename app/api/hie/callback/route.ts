import { db } from "@/app/db/drizzle-client";
import { claims } from "@/app/db/schema";
import {
  ClaimResponseNew,
  ClaimResponse,
  PatientValidationFailureResponse,
  ProfessionalValidationFailureResponse,
  ClaimResource,
  TaskResource,
} from "@/types";
import { setCorsHeaders } from "@/utils/cors";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const origin = req.headers.get("origin") ?? "";
  try {
    const claim = (await req.json()) as
      | ClaimResponse
      | ProfessionalValidationFailureResponse
      | PatientValidationFailureResponse
      | ClaimResponseNew;

    let claimResponse: {
      claimId: string;
      status: string;
      comment: string | null;
      notes: string | null;
      approvedAmount: number;
    };

    if (claim.resourceType === "OperationOutcome") {
      // WE have cases where the callback will be hit for validation failures i.e patient validation and professional validation
      // since right now I do not know what to do with that info I just return a 200 status code
      const response = NextResponse.json(
        { message: "received" },
        { status: 200 }
      );
      return setCorsHeaders(response, origin);
    } else if (claim.resourceType === "ClaimResponse") {
      claimResponse = {
        claimId: claim.id,
        status: claim.outcome,
        approvedAmount: claim?.total?.[0]?.amount?.value ?? 0,
        comment: null,
        notes: null,
      };
      console.info(
        `Processing ClaimResponse with ID: ${claimResponse.claimId}`
      );
    } else if (claim.resourceType === "Bundle") {
      const claimResourceClaim = claim.entry.find(
        (entry) => entry.resource.resourceType === "Claim"
      )?.resource as ClaimResource | undefined;

      const claimResourceTask = claim.entry.find(
        (entry) => entry.resource.resourceType === "Task"
      )?.resource as TaskResource | undefined;

      if (!claimResourceTask) {
        console.error("No Claim resource found in the Bundle");
        const response = NextResponse.json(
          { message: "Invalid Bundle: No Claim resource found" },
          { status: 400 }
        );
        return setCorsHeaders(response, origin);
      }
      claimResponse = {
        claimId: claimResourceTask.id,
        status: claimResourceTask.status,
        approvedAmount: claimResourceClaim?.total?.value || 0,
        comment: null,
        notes: null,
      };
      console.info(`Processing Bundle claim with ID: ${claimResponse.claimId}`);
    } else {
      console.error("No Claim resource found in the Bundle");
      throw new Error("Invalid Bundle: No Claim resource found");
    }

    console.log("claim", claim);

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
