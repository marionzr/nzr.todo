# Python Todo API

A simple RESTful API for managing todo items built with Flask.

## Features

- Create, read, update, and delete todo items
- Filter todos by completion status
- Automatic timestamps for creation and updates
- Unique IDs for each todo item

## Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## Installation

1. Clone this repository:

   ```bash
   git clone <repository-url>
   cd python-todo-api
   ```

2. Create a virtual environment (recommended):

   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:

     ```bash
     venv\Scripts\activate
     ```

   - On macOS/Linux:

     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:

   ```bash
   pip install flask
   ```

## Running the API

Start the server with:

```bash
python app.py
```

The API will be available at `http://localhost:5000`.

## API Endpoints

### Create a new todo

```cURL
curl -X POST http://127.0.0.1:5000/todos \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn cURL", "description": "Practice using cURL for API testing", "completed": false}'
```

Required fields:

- `title`: String

Optional fields:

- `description`: String
- `completed`: Boolean (defaults to false)

### Get all todos

```cURL
curl -X GET http://127.0.0.1:5000/todos
```

Optional query parameters:

```cURL
curl -X GET "http://127.0.0.1:5000/todos?completed=true"
```

### Get a specific todo

```cURL
curl -X GET http://127.0.0.1:5000/todos/<todo_id>
```

### Update a todo

```cURL
curl -X PUT http://127.0.0.1:5000/todos/<todo_id> \
     -H "Content-Type: application/json" \
     -d '{"title": "Learn cURL and Flask", "completed": true}'

```

### Delete a todo

```cURL
curl -X DELETE http://127.0.0.1:5000/todos/<todo_id>
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
