import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  borrowTransactions,
  bookCopies,
  books,
  cartItems,
} from "~/server/db/schema";

export const borrowRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch borrow records with associated books and copyId
      const rows = await ctx.db
        .select({ borrow: borrowTransactions, book: books, copy: bookCopies })
        .from(borrowTransactions)
        .leftJoin(bookCopies, eq(bookCopies.id, borrowTransactions.copyId))
        .leftJoin(books, eq(books.id, bookCopies.bookId))
        .where(
          and(
            eq(borrowTransactions.userId, input.userId),
            isNull(borrowTransactions.returnDate),
          ),
        );
      // Filter out entries without book and copy and narrow types
      const valid = rows.filter(
        (
          r,
        ): r is { borrow: typeof r.borrow; book: NonNullable<typeof r.book>; copy: NonNullable<typeof r.copy> } =>
          r.book !== null && r.copy !== null,
      );
      return valid.map(({ borrow, book, copy }) => ({
        id: borrow.id,
        title: book.title,
        dueDate: borrow.dueDate,
        renewable: borrow.renewalCount < 2,
        copyId: copy.id,
        bookId: book.id,
      }));
    }),
  borrowBook: publicProcedure
    .input(z.object({ userId: z.string(), bookId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Find an available copy
      const copy = await ctx.db
        .select()
        .from(bookCopies)
        .where(
          and(
            eq(bookCopies.bookId, input.bookId),
            eq(bookCopies.status, "available"),
          ),
        )
        .limit(1);
      if (!copy[0]) throw new Error("No available copy");
      // Create borrow transaction
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // 2 weeks
      await ctx.db.insert(borrowTransactions).values({
        copyId: copy[0].id,
        userId: input.userId,
        dueDate: dueDate.toISOString().slice(0, 19).replace("T", " "),
      });
      // Update copy status
      await ctx.db
        .update(bookCopies)
        .set({ status: "checked_out" })
        .where(eq(bookCopies.id, copy[0].id));
      // Remove from cart
      await ctx.db
        .delete(cartItems)
        .where(
          and(
            eq(cartItems.userId, input.userId),
            eq(cartItems.bookId, input.bookId),
          ),
        );
      return { success: true };
    }),
  returnBook: publicProcedure
    .input(z.object({ userId: z.string(), copyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Find the active borrow record for this user and copy
      const rows = await ctx.db
        .select({ borrow: borrowTransactions, copy: bookCopies })
        .from(borrowTransactions)
        .leftJoin(bookCopies, eq(bookCopies.id, borrowTransactions.copyId))
        .where(
          and(
            eq(borrowTransactions.userId, input.userId),
            eq(borrowTransactions.copyId, input.copyId),
            isNull(borrowTransactions.returnDate),
          ),
        )
        .limit(1);
      const rec = rows[0];
      if (!rec?.copy) throw new Error("No borrowed record found");
      // Update borrow record with return date
      await ctx.db
        .update(borrowTransactions)
        .set({
          returnDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        })
        .where(eq(borrowTransactions.id, rec.borrow.id));
      // Set copy status back to available
      await ctx.db
        .update(bookCopies)
        .set({ status: "available" })
        .where(eq(bookCopies.id, rec.copy.id));
      return { success: true };
    }),
});
