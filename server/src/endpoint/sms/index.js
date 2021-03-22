﻿const express = require("express");
const router = express.Router();
const schema = require("./schema");
const message = require("./message");

router.put("/sms", async (request, response) => {
  const { error, value } = schema.validate(request.body);
  
  const sendError = (code, error) => {
    response.status(code);
    response.send({ error });
  };
  
  if (error != null)
    return sendError(400, error);
  
  try {
    await message.sendVerification(value.number);
  } catch(smsError) {
    return sendError(500, smsError);
  }
  
  response.send({ success: true, error: null });
});

module.exports = router;