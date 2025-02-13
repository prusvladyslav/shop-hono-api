import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema } from "stoker/openapi/schemas";
import {
  insertCategoriesSchema,
  selectCategoriesSchema,
  selectProductsSchema,
} from "@/db/schema";

const tags = ["Categories"];

export const postCategoryRoute = createRoute({
  method: "post",
  path: "/categories",
  request: {
    body: jsonContentRequired(insertCategoriesSchema, "The category to create"),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), "Category is created"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCategoriesSchema),
      "The validation error(s)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.boolean(),
      "Internal server error"
    ),
  },
});

export type PostCategoryRoute = typeof postCategoryRoute;

export const getCategoriesRoute = createRoute({
  method: "get",
  path: "/categories",
  tags,
  request: {
    query: z.object({
      withProducts: z.coerce.string().openapi({
        param: {
          name: "withProducts",
          required: false,
          in: "query",
        },
        default: "false",
      }),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectCategoriesSchema),
      "Categories list without products"
    ),
    [HttpStatusCodes.ACCEPTED]: jsonContent(
      z.array(
        selectCategoriesSchema.extend({
          products: z.array(selectProductsSchema),
        })
      ),
      "Categories list with products"
    ),
  },
});

export type GetCategoriesRoute = typeof getCategoriesRoute;
