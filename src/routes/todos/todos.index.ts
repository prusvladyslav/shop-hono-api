import { createRouter } from "@/lib/create-app";

import * as routes from "./todos.routes";
import * as handlers from "./todos.handlers";

const router = createRouter().openapi(routes.getOne, handlers.getOne).openapi(routes.list, handlers.list).openapi(routes.create, handlers.create);

export default router;
