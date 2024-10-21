import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";
import { pinoLogger } from "@/middlewares/pino-logger";
import { cors } from 'hono/cors'
import type { AppBindings, AppOpenAPI } from "./types";
import {CookieStore, sessionMiddleware} from "hono-sessions";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

const sessionStore = new CookieStore()

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon("📝"));
  // app.use(pinoLogger());
  app.use('*', cors({
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposeHeaders: ['Content-Length', 'X-Requested-With'],
    origin: ["http://127.0.0.1:5500", "http://127.0.0.1:3000"],
    credentials: true
  }))
  app.use("*", sessionMiddleware({
    store: sessionStore,
    encryptionKey: 'iV1uHr7EvsVjBODZ4faxWwVAqYg2ltmo',
    expireAfterSeconds: 900,
    cookieOptions: {
      path: '/',
      httpOnly: false,
      sameSite: "none",
      secure: true
  },
  }))
  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route("/", router);
}
