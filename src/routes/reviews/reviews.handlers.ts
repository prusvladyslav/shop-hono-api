import { AppRouteHandler } from "@/lib/types";
import { PostProductReviewRoute } from "./reviews.routes";
import db from "@/db";
import { productsReviews } from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
export const postProductReviewHandler: AppRouteHandler<
  PostProductReviewRoute
> = async (c) => {
  const { productId, comment, rating, userId } = c.req.valid("json");

  await db.insert(productsReviews).values({
    productId,
    comment,
    rating,
    userId,
  });
  return c.json(true, HttpStatusCodes.OK);
};
