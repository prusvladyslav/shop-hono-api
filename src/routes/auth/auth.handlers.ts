import { AppRouteHandler } from "@/lib/types"
import { CreateRoute, LoginRoute, LogoutRoute, VerifyRoute } from "./auth.routes";
import { and, eq } from "drizzle-orm";
import { usersTable } from "@/db/schema";
import db from "@/db";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

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


  let session = c.get('session')
  session.set("userId", user.id)
  
  return c.json(
    true,
    HttpStatusCodes.OK,
  );
}

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  c.get('session').deleteSession()
  return c.json(true, HttpStatusCodes.OK)
}

export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const credentials = c.req.valid("json");

    try {

    const id = await db.insert(usersTable).values(credentials).returning({id: usersTable.id});
    let session = c.get('session')
    session.set("userId", id)
    } 
    catch (error) {

    return c.json('User already exists', HttpStatusCodes.CONFLICT);

    }

    return c.json(true, HttpStatusCodes.OK);    
}

export const verify: AppRouteHandler<VerifyRoute> = async (c) => {
  const session = c.get('session')
  const userId = session.get('userId')

  if (typeof userId !== "number") {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const user = await db.query.usersTable.findFirst({ where(fields, operators) {
    return operators.eq(fields.id, userId);
  }, columns: {password: false}})

  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(user, HttpStatusCodes.OK)
}