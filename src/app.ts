import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import products from "@/routes/products/products.index";
import reviews from "@/routes/reviews/reviews.index";
const app = createApp();

configureOpenAPI(app);

const routes = [index, products, reviews] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = (typeof routes)[number];

export default app;
