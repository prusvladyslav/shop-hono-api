import { AppRouteHandler } from "@/lib/types";
import { CreateRoute, LoginRoute } from "./auth.routes";
import { and, eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import db from "@/db";
import * as HttpStatusCodes from "stoker/http-status-codes";
import  {sign}  from 'hono/jwt'
import {setSignedCookie} from 'hono/cookie'
import { AUTH_TOKEN_COOKIE_NAME, cookieOptions, JWT_SECRET } from "@/lib/constants";


export const login: AppRouteHandler<LoginRoute> = async (c) => {
 const credentials = c.req.valid("json");
  const user = await db.query.usersTable.findFirst({
    where: and(eq(usersTable.email, credentials.email), eq(usersTable.password, credentials.password)),
  })
  if (!user) {
    return c.json(
    false,
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const token = await sign({id: user.id},JWT_SECRET)

  await setSignedCookie(c, AUTH_TOKEN_COOKIE_NAME, token, JWT_SECRET, cookieOptions)

  return c.json(
    true,
    HttpStatusCodes.OK,
  );
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const credentials = c.req.valid("json");

    try {

    const id = await db.insert(usersTable).values(credentials).returning({id: usersTable.id});

    const token = await sign({id},JWT_SECRET)
    
      await setSignedCookie(c, AUTH_TOKEN_COOKIE_NAME, token, JWT_SECRET, cookieOptions)
    } 
    catch (error) {

    return c.json('User already exists', HttpStatusCodes.CONFLICT);

    }

    return c.json(true, HttpStatusCodes.OK);    
}