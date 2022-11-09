import { NextFunction, Response } from "express";
import { Request } from "express-jwt";

interface ValidationError {
  body?: Array<string>;
}

export default async function articlesCreateValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors: ValidationError = {};
  errors.body = [];

  if (!req.body) {
    errors.body.push("can't be empty");
    return res.status(400).json({ errors });
  }

  if (!req.body.article && typeof req.body.article != "object") {
    errors.body.push("article must be an object inside body");
    return res.status(400).json({ errors });
  }

  const { title, description, body, tagList } = req.body.article;

  // Checks if title description and body are present and non-empty strings.
  const requiredChecks = { title, description, body };
  for (const [variable, content] of Object.entries(requiredChecks)) {
    if (typeof content != "string" || content.length == 0) {
      errors.body.push(`${variable} field must be a non-empty string`);
    }
  }

  // Checks if tagList is an array of strings in case it is not undefined.
  if (tagList && !Array.isArray(tagList))
    errors.body.push("tagList must be an array of non-empty strings");
  else if (tagList) {
    let foundError = false;
    for (const tag of tagList) {
      if (typeof tag != "string" || tag.length == 0) {
        foundError = true;
      }
    }
    if (foundError)
      errors.body.push("tagList must be an array of non-empty strings");
  }

  if (errors.body.length) return res.status(400).json({ errors });
  next();
}
