import { AppRouteHandler } from "@/lib/types";
import { GetCategoriesRoute, PostCategoryRoute } from "./categories.routes";
import db from "@/db";
import { categories } from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
export const postCategoryHandler: AppRouteHandler<PostCategoryRoute> = async (
  c
) => {
  const { name, parentId } = c.req.valid("json");

  try {
    await db.insert(categories).values({
      name,
      parentId,
    });
    return c.json(true, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(false, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }
};

export const getCategoriesHandler: AppRouteHandler<GetCategoriesRoute> = async (
  c
) => {
  const { withProducts } = c.req.valid("query");

  if (withProducts === "true") {
    const categories = await db.query.categories.findMany({
      with: {
        products: true,
      },
    });

    return c.json(categories, HttpStatusCodes.ACCEPTED);
  }
  const categories = await db.query.categories.findMany();

  return c.json(categories, HttpStatusCodes.OK);
};
