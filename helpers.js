/*
This template uses a basic authentication implementation for simplicity. 
But if you are deploying in a production environment you should implement a more robust authentication method,
such as OAuth 2.0 or JSON Web Tokens (JWT).
*/

function validateRequest(apiKey, apiSecret) {
  if (apiKey === process.env.VCR_API_ACCOUNT_ID
    && apiSecret === process.env.VCR_API_ACCOUNT_SECRET) {
    return true;
  }
  return false;
}

const validateRequestMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  const apiSecret = req.headers["x-api-secret"] || req.query.api_secret;
  const validReq = validateRequest(apiKey, apiSecret);

  if (!validReq) {
      res.sendStatus(401);
      return;
  }

  next();
};

export { validateRequest, validateRequestMiddleware }