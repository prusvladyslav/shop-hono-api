import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { insertReviewsSchema, selectProductsSchema } from "@/db/schema";

const tags = ["Reviews"];

export const postProductReviewRoute = createRoute({
  method: "post",
  path: "/products/reviews",
  request: {
    body: jsonContentRequired(insertReviewsSchema, "The review to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), "Review is created"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertReviewsSchema),
      "The validation error(s)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.boolean(),
      "Internal server error"
    ),
  },
});

export type PostProductReviewRoute = typeof postProductReviewRoute;
