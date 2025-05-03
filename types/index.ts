import { claims } from "@/app/db/schema";
import { STKPushResponse } from "daraja-kit";
import { InferSelectModel } from "drizzle-orm";

export type KCBAccessTokenResponse = {
  access_token: string;
  token_type: "Bearer" | "Basic";
  //   Probably 3600 seconds
  expires_in: number;
};

export type KCBStkPushBody = {
  phoneNumber: string; // The phone number in the format 2547XXXXXXXX, must be a valid Safaricom M-PESA registered number.
  amount: string; // The amount to be sent, must be a whole number (no decimals).
  invoiceNumber: string; // A unique Alpha-Numeric identifier for the transaction, max 12 characters.
  sharedShortCode: boolean; // If true, orgShortCode and orgPassKey will be replaced with internal values.
  orgShortCode: string; // A 5 to 6 digit code for the organization receiving the funds.
  orgPassKey: string; // The password used for encrypting the request.
  callbackUrl: string; // A valid secure URL for receiving M-Pesa API notifications.
  transactionDescription: string; // Additional information/comment, max 13 characters.
};

export interface KCBStkPushResponse {
  response: STKPushResponse;
  header: Header;
}

export interface Header {
  statusDescription: string;
  statusCode: string;
}

export type Claim = InferSelectModel<typeof claims>;

export interface ProfessionalValidationFailureResponse {
  resourceType: "OperationOutcome";
  id: string;
  issue: Issue[];
}

export interface PatientValidationFailureResponse {
  resourceType: "OperationOutcome";
  id: string;
  issue: Issue[];
}

export interface Issue {
  severity: string;
  code: string;
  diagnostics: string;
}

export interface ClaimResponse {
  resourceType: "ClaimResponse";
  id: string;
  meta: Meta;
  extension: Extension[];
  status: string;
  use: string;
  request: Request;
  outcome: string;
  item?: Item[];
  total?: Total[];
}

export interface Extension {
  url: string;
  valueCodeableConcept: ValueCodeableConcept;
}

export interface ValueCodeableConcept {
  coding: Coding[];
}

export interface Coding {
  system: string;
  code: string;
  display: string;
}

export interface Item {
  itemSequence: number;
  adjudication: Adjudication[];
}

export interface Adjudication {
  category: Category;
  reason: Category;
  amount: AdjudicationAmount;
}

export interface AdjudicationAmount {
  value: number;
}

export interface Category {
  text: string;
}

export interface Meta {
  versionId: string;
  lastUpdated: Date;
  source: string;
}

export interface Request {
  reference: string;
}

export interface Total {
  amount: TotalAmount;
}

export interface TotalAmount {
  value: number;
  currency: string;
}

export interface ClaimResponseNew {
  resourceType: "Bundle";
  entry: Entry[];
}

export interface Entry {
  resource: Resource;
}

export type Resource = TaskResource | ClaimResource;

export interface TaskResource {
  resourceType: "Task";
  id: string;
  meta: Meta;
  status: string;
  intent: string;
  priority: string;
  code: CodeableConcept;
  focus: Reference;
  authoredOn: string;
  requester: Reference;
  output?: Array<{
    valueCodeableConcept: CodeableConcept;
  }>;
}

export interface ClaimResource {
  resourceType: "Claim";
  id: string;
  meta: Meta;
  extension?: Array<ExtensionNew>;
  identifier: Array<Identifier>;
  status: string;
  type: CodeableConcept;
  subType: CodeableConcept;
  use: string;
  patient: Reference;
  billablePeriod: {
    start: string;
    end: string;
  };
  created: string;
  provider: Reference;
  priority: CodeableConcept;
  careTeam: Array<CareTeam>;
  supportingInfo: Array<SupportingInfo>;
  diagnosis: Array<Diagnosis>;
  insurance: Array<Insurance>;
  item: Array<ItemNew>;
  total: AdjudicationAmount;
}

export interface ExtensionNew {
  url: string;
  valueDateTime?: string;
  valueString?: string;
}

export interface Identifier {
  use: string;
  type: CodeableConcept;
  value: string;
}

export interface CareTeam {
  sequence: number;
  provider: Reference;
  responsible: boolean;
  role: CodeableConcept;
}

export interface SupportingInfo {
  sequence: number;
  category: Category;
  valueString: string;
}

export interface Type {
  text: string;
}

export interface Diagnosis {
  id: string;
  sequence: number;
  diagnosisCodeableConcept: CodeableConcept;
  type: Array<Type>;
}

export interface ItemNew {
  sequence: number;
  productOrService: CodeableConcept;
  servicedDate: string;
  quantity: AdjudicationAmount;
  unitPrice: TotalAmount;
  factor: number;
  net: TotalAmount;
}

export interface Insurance {
  sequence: number;
  focal: boolean;
  coverage: Coverage;
}

export interface Coverage {
  coverage: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  id?: string;
  reference?: string;
  type?: string;
  identifier?: {
    use?: string;
    type?: CodeableConcept;
    system?: string;
    value: string;
  };
}
