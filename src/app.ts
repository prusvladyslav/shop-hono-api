import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import products from "@/routes/products/products.index";
import reviews from "@/routes/reviews/reviews.index";
import categories from "@/routes/categories/categories.index";
const app = createApp();

configureOpenAPI(app);

const routes = [products, reviews, categories] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;
