# C# Minimal API Todo Application

A simple RESTful API for managing todo items.

## Features

- Create, read, update, and delete todo items
- Filter todos by completion status
- Automatic timestamps for creation and updates
- Unique IDs for each todo item

## Prerequisites

- .NET 8.0 SDK or later

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd csharp-minimal-todo-api
   ```

2. Restore dependencies:

   ```bash
   dotnet restore
   ```

## Running the API

Start the development server with:

```bash
dotnet run
```

The API will be available at:

- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

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

## API Endpoints

### Create a new todo

```bash
curl -X POST https://localhost:5001/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn C# Minimal API", "description": "Study the new minimal API pattern in .NET", "completed": false}'
```

Required fields:

- `title`: String

Optional fields:

- `description`: String
- `completed`: Boolean (defaults to false)

### Get all todos

```bash
curl -X GET https://localhost:5001/todos
```

Optional query parameters:

```bash
curl -X GET "https://localhost:5001/todos?completed=true"
```

### Get a specific todo

```bash
curl -X GET https://localhost:5001/todos/{todo_id}
```

### Update a todo

```bash
curl -X PUT https://localhost:5001/todos/{todo_id} \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn ASP.NET Core", "completed": true}'
```

### Delete a todo

```bash
curl -X DELETE https://localhost:5001/todos/{todo_id}
```
