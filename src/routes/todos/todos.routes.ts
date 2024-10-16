import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import {  insertTodosSchema, selectTodosSchema } from "@/db/schema";
import { notFoundSchema, unAuthorizedSchema } from "@/lib/constants";

const tags = ["Todos"]
export const list = createRoute({
    path: "/todos",
    method: "get",
    tags,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.array(selectTodosSchema),
        "The list of todos",
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        unAuthorizedSchema,
        "not authorized for this request",
      )
    },
  });
export type ListRoute = typeof list;

export const create = createRoute({
    path: "/todos",
    method: "post",
    request: {
      body: jsonContentRequired(
        insertTodosSchema.omit({userId: true}),
        "The todo to create",
      ),
    },
    tags,
    responses: {
      [HttpStatusCodes.OK]: jsonContent(
        z.array(selectTodosSchema),
        "The created todo",
      ),
      [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(insertTodosSchema),
        "The validation error(s)",
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        unAuthorizedSchema,
        "not authorized for this request",
      )
    },
  });

  export type CreateRoute = typeof create;

export const getOne = createRoute({
    path: "/todos/{id}",
    method: "get",
    request: {
      params: IdParamsSchema,
    },
    tags,
    responses: {
     
      [HttpStatusCodes.OK]: jsonContent(
        selectTodosSchema.omit({userId: true}),
        "The requested todo",
      ),
      [HttpStatusCodes.NOT_FOUND]: jsonContent(
        notFoundSchema,
        "Todo not found",
      ),
      [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
        unAuthorizedSchema,
        "not authorized for this request",
      )
    }
});

export type GetOneRoute = typeof getOne;