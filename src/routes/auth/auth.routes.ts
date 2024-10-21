import { createRoute,  z  } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { loginSchema, registerSchema } from "./schema";
import { insertUsersSchema, selectUsersSchema } from "@/db/schema";
import { createErrorSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";

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
export const logout = createRoute({
  path: "/auth/logout",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.boolean(),
      "Logged out",
    ),
}
  })

  export const create = createRoute({
    path: "/auth/register",
    method: "post",
    request: {
      body: jsonContentRequired(
        registerSchema,
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
        createErrorSchema(registerSchema),
        "The validation error(s)",
      ),
      [HttpStatusCodes.CONFLICT]: jsonContent(
        z.string(),
        "User already exists",
      ),
    },
  });

 export const verify = createRoute({
  path: "/auth/verify",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
     selectUsersSchema.omit({password: true}),
      "User is verified",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found/not verified",
    ),
  }
 }) 

 export type LoginRoute = typeof login;
 export type CreateRoute = typeof create;
 export type LogoutRoute = typeof logout;
 export type VerifyRoute = typeof verify;