import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  books,
  bookAuthors,
  authors,
  bookCategories,
  categories,
  bookCopies,
} from "~/server/db/schema";
import { eq, like, and } from "drizzle-orm";

export const bookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // Fetch all books from the database
    return await ctx.db.select().from(books);
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      // Fetch the main book record
      const rows = await ctx.db
        .select()
        .from(books)
        .where(eq(books.id, input.id))
        .limit(1);
      const book = rows[0];
      if (!book) return null;
      // Fetch authors
      const authorRows = await ctx.db
        .select({ author: authors })
        .from(bookAuthors)
        .leftJoin(authors, eq(authors.id, bookAuthors.authorId))
        .where(eq(bookAuthors.bookId, input.id));
      const authorsList = authorRows.map((r) => r.author);
      // Fetch categories
      const categoryRows = await ctx.db
        .select({ name: categories.name })
        .from(bookCategories)
        .leftJoin(categories, eq(categories.id, bookCategories.categoryId))
        .where(eq(bookCategories.bookId, input.id));
      const categoriesList = categoryRows.map((r) => r.name);
      // Check availability
      const availableCopies = await ctx.db
        .select()
        .from(bookCopies)
        .where(
          and(
            eq(bookCopies.bookId, input.id),
            eq(bookCopies.status, "available")
          )
        );
      const available = availableCopies.length > 0;
      // Return combined data
      return { ...book, authors: authorsList, categories: categoriesList, available };
    }),

  // Simplified search: only title search
  search: publicProcedure
    .input(z.object({ q: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (input.q) {
        return await ctx.db
          .select()
          .from(books)
          .where(like(books.title, `%${input.q}%`));
      }
      return await ctx.db.select().from(books);
    }),
});
