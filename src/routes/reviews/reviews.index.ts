import { createRouter } from "@/lib/create-app";
import * as handlers from "./reviews.handlers";
import * as routes from "./reviews.routes";

const router = createRouter().openapi(
  routes.postProductReviewRoute,
  handlers.postProductReviewHandler
);

export default router;
