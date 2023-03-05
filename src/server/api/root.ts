import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { meetupRouter } from "~/server/api/routers/meetups";
import { commentRouter } from "~/server/api/routers/comments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  meetup: meetupRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
