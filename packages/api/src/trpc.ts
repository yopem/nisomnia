import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { getServerAuthSession } from "@nisomnia/auth"
import { db } from "@nisomnia/db"

export const createInnerTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession()

  return {
    session,
    ...opts,
    db,
  }
}

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return await createInnerTRPCContext({ ...opts })
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const enforceUserIsAuthor = t.middleware(({ ctx, next }) => {
  if (ctx.session?.user?.role !== "author") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an author",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  if (ctx.session?.user?.role !== "admin") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an admin",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

const enforceUserIsAuthorOrAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user?.role?.includes("author" || "admin")) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be an author or admin",
    })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
export const authorProtectedProcedure = t.procedure.use(enforceUserIsAuthor)
export const adminProtectedProcedure = t.procedure.use(enforceUserIsAdmin)
export const authorOrAdminProtectedProcedure = t.procedure.use(
  enforceUserIsAuthorOrAdmin,
)
