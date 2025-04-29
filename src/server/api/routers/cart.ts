import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { cartItems, books } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const cartRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({ book: books })
        .from(cartItems)
        .leftJoin(books, eq(books.id, cartItems.bookId))
        .where(eq(cartItems.userId, input.userId));
      return rows.map((r) => r.book);
    }),
  add: publicProcedure
    .input(z.object({ userId: z.string(), bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(cartItems).values({ userId: input.userId, bookId: input.bookId });
      return { success: true };
    }),
  remove: publicProcedure
    .input(z.object({ userId: z.string(), bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(cartItems).where(
        and(
          eq(cartItems.userId, input.userId),
          eq(cartItems.bookId, input.bookId)
        )
      );
      return { success: true };
    }),
});