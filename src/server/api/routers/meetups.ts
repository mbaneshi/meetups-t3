/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const meetupRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.meetup.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getOne: protectedProcedure
    .input(z.object({ meetupId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.meetup.findUnique({
        where: { id: input.meetupId },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        location: z.string(),
        description: z.string(),
        time: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.meetup.create({
        data: {
          title: input.title,
          location: input.location,
          description: input.description,
          time: input.time,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        location: z.string(),
        description: z.string(),
        time: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meetup.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          location: input.location,
          description: input.description,
          time: input.time,
          userId: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.meetup.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
