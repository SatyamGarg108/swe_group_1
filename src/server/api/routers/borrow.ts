import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { borrowTransactions, bookCopies, books } from "~/server/db/schema";

export const borrowRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch borrow records with associated books
      const rows = await ctx.db
        .select({ borrow: borrowTransactions, book: books })
        .from(borrowTransactions)
        .leftJoin(bookCopies, eq(bookCopies.id, borrowTransactions.copyId))
        .leftJoin(books, eq(books.id, bookCopies.bookId))
        .where(
          and(
            eq(borrowTransactions.userId, input.userId),
            isNull(borrowTransactions.returnDate)
          )
        );
      // Filter out entries without book
      const valid = rows.filter((r) => r.book !== null);
      return valid.map(({ borrow, book }) => ({
        id: borrow.id,
        title: book!.title,
        coverImagePath: book!.coverImagePath ?? "",
        dueDate: borrow.dueDate,
        renewable: borrow.renewalCount < 2,
      }));
    }),
});