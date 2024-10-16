import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { AUTH_TOKEN_COOKIE_NAME} from "@/lib/constants";
import  {decode}  from 'hono/jwt'
import type {  CreateRoute, GetOneRoute, ListRoute,  } from "./todos.routes";
import { getCookie } from "hono/cookie";
import { insertTodosSchema, todosSchema } from "@/db/schema";

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const idCookie = getCookie(c, AUTH_TOKEN_COOKIE_NAME);

  if (!idCookie) {
    return c.json(
      {
      message: HttpStatusPhrases.UNAUTHORIZED,
      },
     HttpStatusCodes.UNAUTHORIZED)
  }

  const {payload} = decode(idCookie)

  const jwtID = payload.id
   
  if (typeof jwtID !== "number") {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }
  
  const todo = await db.query.todosSchema.findFirst({
    where(fields, operators) {
      return operators.and(operators.eq(fields.id, id), operators.eq(fields.userId, jwtID));
    },
  });

  if (!todo) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(todo, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const todo = c.req.valid("json");

    const idCookie = getCookie(c, AUTH_TOKEN_COOKIE_NAME);

    if (!idCookie) {
      return c.json(
        {
        message: HttpStatusPhrases.UNAUTHORIZED,
        },
       HttpStatusCodes.UNAUTHORIZED)
    }
  
    const {payload} = decode(idCookie)
  
    const jwtID = payload.id

    if (!jwtID || typeof jwtID !== "number") {
      return c.json(
        {
          message: HttpStatusPhrases.UNAUTHORIZED,
        },
        HttpStatusCodes.UNAUTHORIZED,
      );
    }


    const createdTodo = await db.insert(todosSchema).values({userId: jwtID, ...todo}).returning()

    return c.json(createdTodo, HttpStatusCodes.OK)

  
}
export const list: AppRouteHandler<ListRoute> = async (c) => {

  const idCookie = getCookie(c, AUTH_TOKEN_COOKIE_NAME);

  if (!idCookie) {
    return c.json(
      {
      message: HttpStatusPhrases.UNAUTHORIZED,
      },
     HttpStatusCodes.UNAUTHORIZED)
  }

  const {payload} = decode(idCookie)

  const jwtID = payload.id
   
  if (!jwtID || typeof jwtID !== "number") {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }
  
  const todos = await db.query.todosSchema.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, jwtID);
    },
  });


  return c.json(todos, HttpStatusCodes.OK);
};
