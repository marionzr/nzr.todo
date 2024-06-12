from flask import Flask, request, jsonify
import uuid
from datetime import datetime
import sqlite3
import os

app = Flask(__name__)

# Database setup
DB_PATH = "../../todos.db"

def init_db():
    """Initialize the SQLite database with tables if they don't exist"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Create todos table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
    )
    ''')

    conn.commit()
    conn.close()

# Initialize DB on startup
init_db()

# Data validation helper
def validate_todo(data):
    # Check if required fields exist
    if not data or not isinstance(data, dict):
        return False, "Invalid data format"

    if 'title' not in data:
        return False, "Title is required"

    if not data['title'] or data['title'].strip() == "":
        return False, "Title cannot be empty"

    return True, ""

@app.route('/todos', methods=['GET'])
def get_todos():
    """Get all todos or filter by completed status"""
    completed_param = request.args.get('completed')

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    cursor = conn.cursor()

    if completed_param is not None:
        # Convert string parameter to boolean
        completed = completed_param.lower() == 'true'
        cursor.execute('SELECT * FROM todos WHERE completed = ?', (completed,))
    else:
        cursor.execute('SELECT * FROM todos')

    # Fetch all rows and convert to list of dicts
    todos = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return jsonify(todos)

@app.route('/todos/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    """Get a specific todo by ID"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
    todo = cursor.fetchone()

    conn.close()

    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify(dict(todo))

@app.route('/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    data = request.get_json()

    is_valid, error = validate_todo(data)
    if not is_valid:
        return jsonify({"error": error}), 400

    todo_id = str(uuid.uuid4())
    now = datetime.now().isoformat()

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute(
        'INSERT INTO todos (id, title, description, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        (
            todo_id,
            data['title'],
            data.get('description', ''),
            data.get('completed', False),
            now,
            now
        )
    )

    conn.commit()

    # Get the inserted todo
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
    new_todo = dict(cursor.fetchone())

    conn.close()

    return jsonify(new_todo), 201

@app.route('/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Update an existing todo"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Check if todo exists
    cursor.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
    todo = cursor.fetchone()

    if not todo:
        conn.close()
        return jsonify({"error": "Todo not found"}), 404

    data = request.get_json()
    todo_dict = dict(todo)
    now = datetime.now().isoformat()

    # Update fields if provided
    if 'title' in data:
        if not data['title'] or data['title'].strip() == "":
            conn.close()
            return jsonify({"error": "Title cannot be empty"}), 400
        todo_dict['title'] = data['title']

    if 'description' in data:
        todo_dict['description'] = data['description']

    if 'completed' in data:
        todo_dict['completed'] = data['completed']

    # Update the record
    cursor.execute(
        'UPDATE todos SET title = ?, description = ?, completed = ?, updated_at = ? WHERE id = ?',
        (
            todo_dict['title'],
            todo_dict['description'],
            todo_dict['completed'],
            now,
            todo_id
        )
    )

    conn.commit()

    # Get the updated todo
    cursor.execute('SELECT * FROM todos WHERE id = ?', (todo_id,))
    updated_todo = dict(cursor.fetchone())

    conn.close()

    return jsonify(updated_todo)

@app.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Check if todo exists
    cursor.execute('SELECT id FROM todos WHERE id = ?', (todo_id,))
    todo = cursor.fetchone()

    if not todo:
        conn.close()
        return jsonify({"error": "Todo not found"}), 404

    # Delete the todo
    cursor.execute('DELETE FROM todos WHERE id = ?', (todo_id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Todo deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)