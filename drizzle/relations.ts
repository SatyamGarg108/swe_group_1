import { relations } from "drizzle-orm/relations";
import { books, bookAuthors, authors, bookCategories, categories, bookCopies, publishers, languages, borrowTransactions, cartItems, reservations, reviews, wishlists } from "./schema";

export const bookAuthorsRelations = relations(bookAuthors, ({one}) => ({
	book: one(books, {
		fields: [bookAuthors.bookId],
		references: [books.id]
	}),
	author: one(authors, {
		fields: [bookAuthors.authorId],
		references: [authors.id]
	}),
}));

export const booksRelations = relations(books, ({one, many}) => ({
	bookAuthors: many(bookAuthors),
	bookCategories: many(bookCategories),
	bookCopies: many(bookCopies),
	publisher: one(publishers, {
		fields: [books.publisherId],
		references: [publishers.id]
	}),
	language: one(languages, {
		fields: [books.languageId],
		references: [languages.id]
	}),
	cartItems: many(cartItems),
	reservations: many(reservations),
	reviews: many(reviews),
	wishlists: many(wishlists),
}));

export const authorsRelations = relations(authors, ({many}) => ({
	bookAuthors: many(bookAuthors),
}));

export const bookCategoriesRelations = relations(bookCategories, ({one}) => ({
	book: one(books, {
		fields: [bookCategories.bookId],
		references: [books.id]
	}),
	category: one(categories, {
		fields: [bookCategories.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	bookCategories: many(bookCategories),
}));

export const bookCopiesRelations = relations(bookCopies, ({one, many}) => ({
	book: one(books, {
		fields: [bookCopies.bookId],
		references: [books.id]
	}),
	borrowTransactions: many(borrowTransactions),
}));

export const publishersRelations = relations(publishers, ({many}) => ({
	books: many(books),
}));

export const languagesRelations = relations(languages, ({many}) => ({
	books: many(books),
}));

export const borrowTransactionsRelations = relations(borrowTransactions, ({one}) => ({
	bookCopy: one(bookCopies, {
		fields: [borrowTransactions.copyId],
		references: [bookCopies.id]
	}),
}));

export const cartItemsRelations = relations(cartItems, ({one}) => ({
	book: one(books, {
		fields: [cartItems.bookId],
		references: [books.id]
	}),
}));

export const reservationsRelations = relations(reservations, ({one}) => ({
	book: one(books, {
		fields: [reservations.bookId],
		references: [books.id]
	}),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	book: one(books, {
		fields: [reviews.bookId],
		references: [books.id]
	}),
}));

export const wishlistsRelations = relations(wishlists, ({one}) => ({
	book: one(books, {
		fields: [wishlists.bookId],
		references: [books.id]
	}),
}));