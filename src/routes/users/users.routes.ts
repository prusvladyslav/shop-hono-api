import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import {  selectUsersSchema } from "@/db/schema";
import { notFoundSchema, unAuthorizedSchema } from "@/lib/constants";

const tags = ["Users"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "The list of users",
    ),
  },
});

export const getOne = createRoute({
  path: "/users/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
   
    [HttpStatusCodes.OK]: jsonContent(
      selectUsersSchema.omit({password: true}),
      "The requested user",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "User not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unAuthorizedSchema,
      "not authorized for this request",
    ),
  },
});

// export const patch = createRoute({
//   path: "/users/{id}",
//   method: "patch",
//   request: {
//     params: IdParamsSchema,
//     body: jsonContentRequired(
//       patchUsersSchema,
//       "The users updates",
//     ),
//   },
//   tags,
//   responses: {
//     [HttpStatusCodes.OK]: jsonContent(
//       selectUsersSchema,
//       "The updated user",
//     ),
//     [HttpStatusCodes.NOT_FOUND]: jsonContent(
//       notFoundSchema,
//       "User not found",
//     ),
//     [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
//       createErrorSchema(patchUsersSchema)
//         .or(createErrorSchema(IdParamsSchema)),
//       "The validation error(s)",
//     ),
//     [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
//       unAuthorizedSchema,
//       "not authorized for this request",
//     ),
//   },
// });

// export type PatchRoute = typeof patch;


export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
