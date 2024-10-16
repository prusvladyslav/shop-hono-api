import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND);
export const unAuthorizedSchema = createMessageObjectSchema(HttpStatusPhrases.UNAUTHORIZED);

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key' as const

export const cookieOptions = {
  path: '/',
  secure: true,
  maxAge: 60 * 60,
  sameSite: 'Strict',
} as const

export const AUTH_TOKEN_COOKIE_NAME = 'auth_token' as const