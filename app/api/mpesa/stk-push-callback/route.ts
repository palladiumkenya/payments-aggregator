import {
  STKPushErrorCallbackBody,
  STKPushSuccessfulCallbackBody,
} from "daraja-kit";
import { NextApiRequest, NextApiResponse } from "next";

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const text: STKPushSuccessfulCallbackBody | STKPushErrorCallbackBody =
    req.body;

  console.log("stk-push-callback-request", req);
};

export default POST;
