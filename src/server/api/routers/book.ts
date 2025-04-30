import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  books,
  bookAuthors,
  authors,
  bookCategories,
  categories,
  bookCopies,
  reviews,
} from "~/server/db/schema";
import { eq, like, and, not, sql, or } from "drizzle-orm";

export const bookRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(books)
      .orderBy(sql`RAND()`)
      .limit(9);
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
            eq(bookCopies.status, "available"),
          ),
        );
      const available = availableCopies.length > 0;
      // Fetch reviews for this book
      const reviewRows = await ctx.db
        .select({
          userId: reviews.userId,
          rating: reviews.rating,
          reviewText: reviews.reviewText,
        })
        .from(reviews)
        .where(eq(reviews.bookId, input.id));
      // Compute average rating
      const avgRating =
        reviewRows.length > 0
          ? reviewRows.reduce((sum, r) => sum + r.rating, 0) / reviewRows.length
          : null;
      // Fetch random book suggestions
      const suggestionRows = await ctx.db
        .select({ id: books.id, title: books.title })
        .from(books)
        .where(not(eq(books.id, input.id)))
        .orderBy(sql`RAND()`)
        .limit(3);
      const suggestions = suggestionRows;
      // Return combined data (no coverImagePath)
      return {
        ...book,
        authors: authorsList,
        categories: categoriesList,
        available,
        reviews: reviewRows,
        avgRating,
        suggestions,
      };
    }),

  // Advanced search: multi-field, all filters
  search: publicProcedure
    .input(
      z.object({
        q: z.string().optional(),
        availableOnly: z.boolean().optional(),
        newArrivals: z.boolean().optional(),
        fiction: z.boolean().optional(),
        nonFiction: z.boolean().optional(),
        ebooks: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        q,
        availableOnly,
        newArrivals,
        fiction,
        nonFiction,
        ebooks: _ebooks, // eslint-ignore-unused
      } = input;

      // start in dynamic mode so each .where() merges instead of clobbering
      let query = ctx.db
        .select({
          id: books.id,
          title: books.title,
          series: books.series,
          description: books.description,
        })
        .from(books)
        .$dynamic();

      if (q) {
        query = query.where(
          or(
            like(books.title, `%${q}%`),
            like(books.series, `%${q}%`),
            like(books.description, `%${q}%`),
            like(books.isbn, `%${q}%`),
          ),
        );
      }

      if (availableOnly) {
        query = query.where(
          sql`EXISTS (
            SELECT 1
            FROM book_copies
            WHERE book_copies.book_id = books.id
              AND book_copies.status = 'available'
          )`,
        );
      }

      if (newArrivals) {
        query = query.where(
          sql`books.created_at > DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)`,
        );
      }

      if (fiction) {
        query = query.where(
          sql`EXISTS (
            SELECT 1
            FROM book_categories bc
            JOIN categories c
              ON c.id = bc.category_id
            WHERE bc.book_id = books.id
              AND c.name LIKE '%Fiction%'
          )`,
        );
      }

      if (nonFiction) {
        query = query.where(
          sql`EXISTS (
            SELECT 1
            FROM book_categories bc
            JOIN categories c
              ON c.id = bc.category_id
            WHERE bc.book_id = books.id
              AND c.name LIKE '%Non-Fiction%'
          )`,
        );
      }

      // finally, actually run the built query
      const results = await query.execute();
      return results;
    }),
});
