import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "express-jwt";
import logger from "./logger";

export default function generalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.debug("Starting - generalErrorHandler");
  logger.debug(`Handling error ${err.name}`);
  // Se if authorization failed
  if (err instanceof UnauthorizedError) {
    switch (err.code) {
      case "credentials_required":
        logger.debug("Authorization token not found.");
        return res.sendStatus(401);
      case "credentials_bad_scheme":
        logger.debug("Authorization with bad scheme.");
        return res.sendStatus(400);
      case "invalid_token":
        logger.debug("Authorization token invalid.");
        return res.sendStatus(400);
      default:
        logger.error(`Unhandled UnauthorizedError with code ${err.code}`);
        return next(err);
    }
  }
  // Se if body is not a valid JSON parse.
  try {
    JSON.parse(req.body);
  } catch (error) {
    logger.debug("Body is not a valid JSON.");
    return res.status(422).json({ errors: { body: ["not a valid json"] } });
  }
  logger.error(`Unhandled error ${err.name}`);
  return next(err);
}
