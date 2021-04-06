﻿const express = require("express");
const schema = require("./schema");
const message = require("./message");
const { log } = require("../../logger")("/api/sms");

const router = express.Router();

const requestCode = async (request: any, response: any) => {
  const { error, value } = schema.put.validate(request.body);

  const sendError = (code: number, error: Error) => {
    response.status(code);
    response.send({ error });
  };

  if (error != null) return sendError(400, error);

  try {
    const data = await message.sendVerification(value.number);
    log(`received SMS request for ${value.number} -- code:`, data.code);
  } catch (smsError) {
    return sendError(500, smsError);
  }

  response.send({ success: true, error: null });
};

const verifyCode = async (request: any, response: any) => {
  const { error, value } = schema.post.validate(request.body);

  const sendError = (code: number, error: Error) => {
    response.status(code);
    response.send({ error });
  };

  if (error != null) return sendError(400, error);

  const isValid = message.checkVerification(value.number, value.code);
  log(
    `received SMS verification for ${value.number} with input code ${value.code} [` +
      (!isValid ? "IN" : "") +
      "VALID]"
  );

  response.send({
    success: isValid,
    error: isValid ? null : "invalid code"
  });
};

router.put("/sms", requestCode);
router.post("/sms", verifyCode);

export default router;