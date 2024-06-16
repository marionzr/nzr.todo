import { NextResponse } from 'next/server';
import { todos } from '../../todos-store';

// GET a specific todo by ID
export async function GET(request, { params }) {
  const todoId = params.todoId;
  const todo = todos[todoId];

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  return NextResponse.json(todo);
}

// PUT update an existing todo
export async function PUT(request, { params }) {
  const todoId = params.todoId;
  const todo = todos[todoId];

  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  try {
    const data = await request.json();

    // Update fields if provided
    if (data.title !== undefined) {
      if (data.title === "") {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }

      todo.title = data.title;
    }

    if (data.description !== undefined) {
      todo.description = data.description;
    }

    if (data.completed !== undefined) {
      todo.completed = data.completed;
    }

    todo.updated_at = new Date().toISOString();

    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(request, { params }) {
  const todoId = params.todoId;

  if (!todos[todoId]) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }

  delete todos[todoId];

  return NextResponse.json({ message: "Todo deleted successfully" }, { status: 200 });
}