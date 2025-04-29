import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  primaryKey,
  int,
  varchar,
  index,
  foreignKey,
  mysqlEnum,
  text,
  timestamp,
  datetime,
  char,
  tinyint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const authors = mysqlTable(
  "authors",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "authors_id" })],
);

export const bookAuthors = mysqlTable(
  "book_authors",
  {
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    authorId: int("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("author_id").on(table.authorId),
    primaryKey({
      columns: [table.bookId, table.authorId],
      name: "book_authors_book_id_author_id",
    }),
  ],
);

export const bookCategories = mysqlTable(
  "book_categories",
  {
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    categoryId: int("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("category_id").on(table.categoryId),
    primaryKey({
      columns: [table.bookId, table.categoryId],
      name: "book_categories_book_id_category_id",
    }),
  ],
);

export const bookCopies = mysqlTable(
  "book_copies",
  {
    id: int().autoincrement().notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    copyNumber: int("copy_number").notNull(),
    status: mysqlEnum([
      "available",
      "checked_out",
      "reserved",
      "lost",
      "maintenance",
    ])
      .default("available")
      .notNull(),
  },
  (table) => [
    index("book_id").on(table.bookId),
    primaryKey({ columns: [table.id], name: "book_copies_id" }),
  ],
);

export const books = mysqlTable(
  "books",
  {
    id: int().autoincrement().notNull(),
    title: varchar({ length: 255 }).notNull(),
    series: varchar({ length: 255 }),
    isbn: varchar({ length: 20 }),
    publisherId: int("publisher_id").references(() => publishers.id, {
      onDelete: "set null",
    }),
    publicationYear: int("publication_year"),
    languageId: int("language_id").references(() => languages.id, {
      onDelete: "set null",
    }),
    description: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .onUpdateNow(),
  },
  (table) => [
    index("publisher_id").on(table.publisherId),
    index("language_id").on(table.languageId),
    primaryKey({ columns: [table.id], name: "books_id" }),
  ],
);

export const borrowTransactions = mysqlTable(
  "borrow_transactions",
  {
    id: int().autoincrement().notNull(),
    copyId: int("copy_id")
      .notNull()
      .references(() => bookCopies.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 }).notNull(),
    borrowDate: datetime("borrow_date", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    dueDate: datetime("due_date", { mode: "string" }).notNull(),
    returnDate: datetime("return_date", { mode: "string" }),
    renewalCount: int("renewal_count").default(0).notNull(),
  },
  (table) => [
    index("copy_id").on(table.copyId),
    primaryKey({ columns: [table.id], name: "borrow_transactions_id" }),
  ],
);

export const cartItems = mysqlTable(
  "cart_items",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    addedAt: datetime("added_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    index("book_id").on(table.bookId),
    primaryKey({
      columns: [table.userId, table.bookId],
      name: "cart_items_user_id_book_id",
    }),
  ],
);

export const categories = mysqlTable(
  "categories",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 100 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "categories_id" })],
);

export const languages = mysqlTable(
  "languages",
  {
    id: int().autoincrement().notNull(),
    code: char({ length: 5 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "languages_id" })],
);

export const notifications = mysqlTable(
  "notifications",
  {
    id: int().autoincrement().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    type: varchar({ length: 50 }).notNull(),
    message: text().notNull(),
    isRead: tinyint("is_read").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "notifications_id" })],
);

export const publishers = mysqlTable(
  "publishers",
  {
    id: int().autoincrement().notNull(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "publishers_id" })],
);

export const reservations = mysqlTable(
  "reservations",
  {
    id: int().autoincrement().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    reservedAt: datetime("reserved_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
    status: mysqlEnum(["active", "fulfilled", "canceled"])
      .default("active")
      .notNull(),
    fulfilledAt: datetime("fulfilled_at", { mode: "string" }),
  },
  (table) => [
    index("book_id").on(table.bookId),
    primaryKey({ columns: [table.id], name: "reservations_id" }),
  ],
);

export const reviews = mysqlTable(
  "reviews",
  {
    id: int().autoincrement().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    rating: tinyint({ unsigned: true }).notNull(),
    reviewText: text("review_text"),
    createdAt: datetime("created_at", { mode: "string" }),
    updatedAt: datetime("updated_at", { mode: "string" }),
  },
  (table) => [
    index("book_id").on(table.bookId),
    primaryKey({ columns: [table.id], name: "reviews_id" }),
  ],
);

export const wishlists = mysqlTable(
  "wishlists",
  {
    userId: varchar("user_id", { length: 255 }).notNull(),
    bookId: int("book_id")
      .notNull()
      .references(() => books.id, { onDelete: "cascade" }),
    addedAt: datetime("added_at", { mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP)`)
      .notNull(),
  },
  (table) => [
    index("book_id").on(table.bookId),
    primaryKey({
      columns: [table.userId, table.bookId],
      name: "wishlists_user_id_book_id",
    }),
  ],
);
