import { createRouter } from "@/lib/create-app";
import * as handlers from "./products.handlers";
import * as routes from "./products.routes";

const router = createRouter()
  .openapi(routes.getProductsRoute, handlers.getProductsHandler)
  .openapi(routes.getProductRoute, handlers.getProductHandler)
  .openapi(routes.postProductRoute, handlers.postProductHandler);

export default router;
