import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import users from "@/routes/users/users.index";
import auth from "@/routes/auth/auth.index";
import todos from "@/routes/todos/todos.index";
const app = createApp();

configureOpenAPI(app);

const routes = [
  index,
  auth,
  todos,
  users,
] as const;

routes.forEach((route) => {
  app.route("/", route);
});

export type AppType = typeof routes[number];

export default app;
