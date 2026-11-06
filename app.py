from flask import Flask, render_template, request, jsonify
import database

# Initialize the Flask application
app = Flask(__name__)

# Ensure the SQLite database file and tasks table exist on startup
database.init_db()


@app.route("/")
def index():
    """Serve the home page HTML."""
    return render_template("index.html")


@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    """API endpoint: Retrieve all tasks, sorted newest first."""
    tasks = database.get_all_tasks()
    return jsonify(tasks), 200


@app.route("/api/tasks", methods=["POST"])
def add_task():
    """API endpoint: Validate input and insert a new task."""
    data = request.get_json(silent=True) or {}
    title = data.get("title", "").strip()

    # Rule: title must not be empty and must be under 200 characters
    if not title:
        return jsonify({"error": "Task title cannot be empty."}), 400
    if len(title) > 200:
        return jsonify({"error": "Task title must be under 200 characters."}), 400

    new_task = database.add_task(title)
    return jsonify(new_task), 201


@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def toggle_task(task_id):
    """API endpoint: Toggle the 'done' status (0 or 1) of a task."""
    updated_task = database.toggle_task(task_id)
    if not updated_task:
        return jsonify({"error": "Task not found."}), 404
    return jsonify(updated_task), 200


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    """API endpoint: Delete a task by ID."""
    success = database.delete_task(task_id)
    if not success:
        return jsonify({"error": "Task not found."}), 404
    return jsonify({"message": "Task deleted successfully."}), 200


if __name__ == "__main__":
    # Run development server on port 5000
    app.run(debug=True, port=5000)
