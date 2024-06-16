import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { todos } from '../todos-store';

// Helper function to validate todo data
function validateTodo(data) {
  // Check if required fields exist
  if (!data || typeof data !== 'object') {
    return { valid: false, error: "Invalid data format" };
  }

  if (!data.title) {
    return { valid: false, error: "Title is required" };
  }

  if (data.title === "") {
    return { valid: false, error: "Title cannot be empty" };
  }

  return { valid: true, error: "" };
}

// GET all todos or filter by completed status
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const completedParam = searchParams.get('completed');

  if (completedParam !== null) {
    const completed = completedParam.toLowerCase() === 'true';
    const filteredTodos = Object.values(todos).filter(todo => todo.completed === completed);

    return NextResponse.json(filteredTodos);
  }

  return NextResponse.json(Object.values(todos));
}

// POST create a new todo
export async function POST(request) {
  try {
    const data = await request.json();
    const validation = validateTodo(data);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const todoId = uuidv4();
    const now = new Date().toISOString();

    const newTodo = {
      id: todoId,
      title: data.title,
      description: data.description || '',
      completed: data.completed || false,
      created_at: now,
      updated_at: now
    };

    todos[todoId] = newTodo;

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}