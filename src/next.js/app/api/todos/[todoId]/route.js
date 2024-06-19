import { NextResponse } from 'next/server';
import { getDb, rowToTodo } from '../../db';

// GET a specific todo by ID
export async function GET(request, { params }) {
  try {
    const todoId = params.todoId;
    const db = await getDb();

    const todo = await db.get('SELECT * FROM todos WHERE id = ?', todoId);

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    return NextResponse.json(rowToTodo(todo));
  } catch (error) {
    console.error('Error getting todo:', error);
    return NextResponse.json({ error: "Failed to get todo" }, { status: 500 });
  }
}

// PUT update an existing todo
export async function PUT(request, { params }) {
  try {
    const todoId = params.todoId;
    const db = await getDb();

    // Check if todo exists
    const existingTodo = await db.get('SELECT * FROM todos WHERE id = ?', todoId);
    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const data = await request.json();

    // Validate title if provided
    if (data.title !== undefined && data.title === "") {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const updates = [];
    const values = [];

    // Build dynamic update query
    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }

    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }

    if (data.completed !== undefined) {
      updates.push('completed = ?');
      values.push(data.completed ? 1 : 0);
    }

    // Always update the updated_at field
    updates.push('updated_at = ?');
    values.push(now);

    // Add todoId as the last value for WHERE clause
    values.push(todoId);

    // Execute the update
    await db.run(
      `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get the updated todo
    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', todoId);

    return NextResponse.json(rowToTodo(updatedTodo));
  } catch (error) {
    console.error('Error updating todo:', error);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(request, { params }) {
  try {
    const todoId = params.todoId;
    const db = await getDb();

    // Check if todo exists
    const existingTodo = await db.get('SELECT * FROM todos WHERE id = ?', todoId);

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    // Delete the todo
    await db.run('DELETE FROM todos WHERE id = ?', todoId);

    return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}