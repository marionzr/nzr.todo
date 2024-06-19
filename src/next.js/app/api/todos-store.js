import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// This is a singleton pattern to reuse the database connection
let db = null;

export async function getDb() {
  if (db) return db;

  // Open the database
  db = await open({
    filename: path.join(process.cwd(), '../../../todos.db'),
    driver: sqlite3.Database
  });

  // Create todos table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )`);

  return db;
}

// Utility function to convert SQLite row to Todo object
export function rowToTodo(row) {
  return {
    ...row,
    completed: Boolean(row.completed) // Convert 0/1 to boolean
  };
}