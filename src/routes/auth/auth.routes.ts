import { createRoute,  z  } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { loginSchema } from "./schema";
import { insertUsersSchema } from "@/db/schema";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Auth"];

export const login = createRoute({
  path: "/auth/login",
  method: "post",
  request: {
    body: jsonContentRequired(
      loginSchema,
      "The login credentials",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.boolean(),
      "Logged in",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.boolean(),
      "Invalid credentials",
    ),
}
  })

  export const create = createRoute({
    path: "/auth/register",
    method: "post",
    request: {
      body: jsonContentRequired(
        insertUsersSchema,
        "The users to create",
      ),
    },
    tags,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.boolean(),
        "User is created",
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(insertUsersSchema),
        "The validation error(s)",
      ),
      [HttpStatusCodes.CONFLICT]: jsonContent(
        z.string(),
        "User already exists",
      ),
    },
  });

 export type LoginRoute = typeof login;
 export type CreateRoute = typeof create;