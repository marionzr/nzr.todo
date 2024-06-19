import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb, rowToTodo } from '../todos-store';

// Helper function to validate todo data
function validateTodo(data) {
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
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const completedParam = searchParams.get('completed');

    let todos;

    if (completedParam !== null) {
      const completed = completedParam.toLowerCase() === 'true' ? 1 : 0;
      todos = await db.all('SELECT * FROM todos WHERE completed = ?', completed);
    } else {
      todos = await db.all('SELECT * FROM todos');
    }

    // Convert SQLite rows to Todo objects (convert completed from 0/1 to boolean)
    const formattedTodos = todos.map(rowToTodo);

    return NextResponse.json(formattedTodos);

  } catch (error) {
    console.error('Error getting todos:', error);
    return NextResponse.json({ error: "Failed to get todos" }, { status: 500 });
  }
}

// POST create a new todo
export async function POST(request) {
  try {
    const data = await request.json();
    const validation = validateTodo(data);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const db = await getDb();
    const todoId = uuidv4();
    const now = new Date().toISOString();

    const newTodo = {
      id: todoId,
      title: data.title,
      description: data.description || '',
      completed: data.completed ? 1 : 0,
      created_at: now,
      updated_at: now
    };

    await db.run(
      'INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [newTodo.id, newTodo.title, newTodo.description, newTodo.completed, newTodo.created_at, newTodo.updated_at]
    );

    // Convert the SQLite row format back to the API format
    return NextResponse.json({
      ...newTodo,
      completed: Boolean(newTodo.completed) // Convert back to boolean for the response
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}