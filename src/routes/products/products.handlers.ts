import { AppRouteHandler } from "@/lib/types";
import {
  GetProductRoute,
  GetProductsRoute,
  PostProductRoute,
} from "./products.routes";
import db from "@/db";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { eq, isNotNull } from "drizzle-orm";
import { products as productsSchema, productsImages } from "@/db/schema";
import Cloudflare from "cloudflare";
import env from "@/env";
export const getProductsHandler: AppRouteHandler<GetProductsRoute> = async (
  c
) => {
  const { flashSales } = c.req.valid("query");

  const products = await db.query.products.findMany({
    where: flashSales ? isNotNull(productsSchema.previousPrice) : undefined,
    with: {
      images: {
        columns: {
          imageUrl: true,
        },
      },
    },
  });

  const mappedProducts = products.map((product) => ({
    ...product,
    images: product.images.map((image) => image.imageUrl),
  }));

  return c.json(mappedProducts, HttpStatusCodes.OK);
};

export const getProductHandler: AppRouteHandler<GetProductRoute> = async (
  c
) => {
  const { id } = c.req.valid("param");

  const product = await db.query.products.findFirst({
    where: eq(productsSchema.id, id),
    with: {
      images: {
        columns: {
          imageUrl: true,
        },
      },
    },
  });

  if (!product) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { ...product, images: product.images.map((image) => image.imageUrl) },
    HttpStatusCodes.OK
  );
};

export const postProductHandler: AppRouteHandler<PostProductRoute> = async (
  c
) => {
  const data = c.req.valid("form");

  const { name, categoryId, price, description, previousPrice, file } = data;

  const product = await db
    .insert(productsSchema)
    .values({
      name,
      categoryId: Number(categoryId),
      price: Number(price),
      description,
      previousPrice: previousPrice ? Number(previousPrice) : null,
    })
    .returning({ insertedId: productsSchema.id });

  const insertedId = product[0].insertedId;

  const client = new Cloudflare({
    apiEmail: env.CLOUDFLARE_EMAIL,
    apiToken: env.CLOUDFLARE_TOKEN,
  });

  try {
    const image = await client.images.v1.create({
      account_id: env.CLOUDFLARE_ACCOUNT_ID,
      file,
    });

    image?.variants?.forEach(async (imageUrl) => {
      await db
        .insert(productsImages)
        .values({ productId: insertedId, imageUrl });
    });
  } catch (error) {
    return c.json(false, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

  return c.json(true, HttpStatusCodes.OK);
};
