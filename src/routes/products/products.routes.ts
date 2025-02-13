import { createRoute, z } from "@hono/zod-openapi";
import { jsonContent } from "stoker/openapi/helpers";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";
import { selectProductsReviewsSchema, selectProductsSchema } from "@/db/schema";

const tags = ["Products"];

const productWithImagesSchema = selectProductsSchema.extend({
  images: z.array(z.string()),
});

const productWithImagesAndReview = productWithImagesSchema.extend({
  rating: z.number(),
  reviewsCount: z.number(),
});

const getProductsParamsSchema = z.object({
  flashSales: z.coerce.boolean().openapi({
    param: {
      name: "flashSales",
      required: false,
      in: "query",
    },
  }),
});

export const getProductsRoute = createRoute({
  path: "/products",
  method: "get",
  tags,
  request: {
    query: getProductsParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(productWithImagesAndReview),
      "Products list"
    ),
  },
});

export type GetProductsRoute = typeof getProductsRoute;

export const getProductRoute = createRoute({
  path: "/products/{id}",
  method: "get",
  request: {
    params: z.object({
      id: z.coerce.number().openapi({
        param: {
          name: "id",
          required: true,
          in: "path",
        },
      }),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(productWithImagesAndReview, "Product"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Product not found"
    ),
  },
});

export type GetProductRoute = typeof getProductRoute;

export const postProductRoute = createRoute({
  path: "/products",
  method: "post",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: z.object({
            file: z.instanceof(File),
            name: z.string(),
            categoryId: z.string(),
            price: z.string(),
            previousPrice: z.string().optional(),
            description: z.string(),
          }),
        },
      },
      required: true,
    },
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.boolean(), "Product is created"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(
        z.object({
          name: z.string().optional(),
          categoryId: z.number().optional(),
          price: z.number().optional(),
        })
      ),
      "The validation error(s)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.boolean(),
      "Internal server error"
    ),
  },
});

export type PostProductRoute = typeof postProductRoute;
