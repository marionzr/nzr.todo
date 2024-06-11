from flask import Flask, request, jsonify
import uuid
from datetime import datetime

app = Flask(__name__)

# In-memory database for todos
todos = {}

# Data validation helper
def validate_todo(data):
    # Check if required fields exist
    if not data or not isinstance(data, dict):
        return False, "Invalid data format"

    if 'title' not in data:
        return False, "Title is required"

    if 'title' == "":
        return False, "Title cannot be empty"

    return True, ""

@app.route('/todos', methods=['GET'])
def get_todos():
    """Get all todos or filter by completed status"""
    completed = request.args.get('completed')

    if completed is not None:
        completed = completed.lower() == 'true'

        filtered_todos = {
            id: todo for id, todo in todos.items() if todo['completed'] == completed
        }

        return jsonify(list(filtered_todos.values()))

    return jsonify(list(todos.values()))

@app.route('/todos/<todo_id>', methods=['GET'])
def get_todo(todo_id):
    """Get a specific todo by ID"""
    todo = todos.get(todo_id)

    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    return jsonify(todo)

@app.route('/todos', methods=['POST'])
def create_todo():
    """Create a new todo"""
    data = request.get_json()

    is_valid, error = validate_todo(data)

    if not is_valid:
        return jsonify({"error": error}), 400

    todo_id = str(uuid.uuid4())
    new_todo = {
        "id": todo_id,
        "title": data['title'],
        "description": data.get('description', ''),
        "completed": data.get('completed', False),
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }

    todos[todo_id] = new_todo

    return jsonify(new_todo), 201

@app.route('/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    """Update an existing todo"""
    todo = todos.get(todo_id)
    if not todo:
        return jsonify({"error": "Todo not found"}), 404

    data = request.get_json()

    # Update fields if provided
    if 'title' in data:
        if data['title'] == "":
            return jsonify({"error": "Title cannot be empty"}), 400

        todo['title'] = data['title']

    if 'description' in data:
        todo['description'] = data['description']

    if 'completed' in data:
        todo['completed'] = data['completed']

    todo['updated_at'] = datetime.now().isoformat()

    return jsonify(todo)

@app.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    """Delete a todo"""
    if todo_id not in todos:
        return jsonify({"error": "Todo not found"}), 404

    del todos[todo_id]

    return jsonify({"message": "Todo deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)