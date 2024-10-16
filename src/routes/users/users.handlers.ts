import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { usersTable } from "@/db/schema";
import { AUTH_TOKEN_COOKIE_NAME, ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "@/lib/constants";
import  {decode}  from 'hono/jwt'
import type {  GetOneRoute,  } from "./users.routes";
import { getCookie } from "hono/cookie";

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
   
  if (jwtID !== id) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED,
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }
  
  const user = await db.query.usersTable.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    columns: {
      password: false
    }
  });

  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  return c.json(user, HttpStatusCodes.OK);
};

// export const patch: AppRouteHandler<PatchRoute> = async (c) => {
//   const { id } = c.req.valid("param");
//   const updates = c.req.valid("json");

//   const idCookie = getCookie(c, AUTH_TOKEN_COOKIE_NAME);

//   if (!idCookie) {
//     return c.json(
//       {
//       message: HttpStatusPhrases.UNAUTHORIZED,
//       },
//      HttpStatusCodes.UNAUTHORIZED)
//   }

//   const {payload} = decode(idCookie)

//   const jwtID = payload.id
   
//   if (jwtID !== id) {
//     return c.json(
//       {
//         message: HttpStatusPhrases.UNAUTHORIZED,
//       },
//       HttpStatusCodes.UNAUTHORIZED,
//     );
//   }

//   if (Object.keys(updates).length === 0) {
//     return c.json(
//       {
//         success: false,
//         error: {
//           issues: [
//             {
//               code: ZOD_ERROR_CODES.INVALID_UPDATES,
//               path: [],
//               message: ZOD_ERROR_MESSAGES.NO_UPDATES,
//             },
//           ],
//           name: "ZodError",
//         },
//       },
//       HttpStatusCodes.UNPROCESSABLE_ENTITY,
//     );
//   }

//   const [user] = await db.update(usersTable)
//     .set(updates)
//     .where(eq(usersTable.id, id))
//     .returning();

//   if (!user) {
//     return c.json(
//       {
//         message: HttpStatusPhrases.NOT_FOUND,
//       },
//       HttpStatusCodes.NOT_FOUND,
//     );
//   }

//   return c.json(user, HttpStatusCodes.OK);
// };

