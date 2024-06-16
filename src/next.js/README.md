# Next.js Todo API

A modern RESTful API for managing todo items built with Next.js and Node.js.

## Features

- Create, read, update, and delete todo items
- Filter todos by completion status
- Automatic timestamps for creation and updates
- Unique IDs for each todo item
- Built with Next.js App Router and Route Handlers

## Prerequisites

- Node.js 16.8 or higher
- npm (Node package manager)

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd nextjs-todo-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file for environment variables (optional):

```bash
# .env.local example
NODE_ENV=development
```

## Running the API

Start the development server with:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

For production:

```bash
npm run build
npm start
```

## API Endpoints

### Create a new todo

```bash
curl -X POST http://localhost:3000/api/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn Next.js", "description": "Practice building APIs with Next.js", "completed": false}'
```

Required fields:

- `title`: String

Optional fields:

- `description`: String
- `completed`: Boolean (defaults to false)

### Get all todos

```bash
curl -X GET http://localhost:3000/api/todos
```

Optional query parameters:

```bash
curl -X GET "http://localhost:3000/api/todos?completed=true"
```

### Get a specific todo

```bash
curl -X GET http://localhost:3000/api/todos/{todo_id}
```

### Update a todo

```bash
curl -X PUT http://localhost:3000/api/todos/{todo_id} \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn Next.js and React", "completed": true}'
```

### Delete a todo

```bash
curl -X DELETE http://localhost:3000/api/todos/{todo_id}
```

## Data Structure

Each todo item has the following structure:

```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "ISO-8601 timestamp",
  "updated_at": "ISO-8601 timestamp"
}
```

## Project Structure

```
/app
  /api
    /todos
      /[todoId]
        route.js     # GET, PUT, DELETE for specific todo
      route.js       # GET, POST for all todos
    todos-store.js   # Shared state between route handlers
/package.json        # Dependencies and scripts
```

## Important Notes

- This implementation uses an in-memory store for simplicity. In a production environment, you should use a proper database.
- The todos are stored in memory, so they will be lost when the server restarts.
- For persistence, consider integrating with MongoDB, PostgreSQL, or another database solution.