import sqlite3
from datetime import datetime

# Path to the SQLite database file
DB_NAME = "tasks.db"


def get_connection():
    """Create a database connection and enable row access by column name."""
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row  # Access columns like row['title']
    return conn


def init_db():
    """Create the tasks table automatically if it doesn't already exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                done INTEGER DEFAULT 0,
                created_at TEXT NOT NULL
            )
            """
        )
        conn.commit()


def get_all_tasks():
    """Fetch all tasks ordered by newest first (descending ID)."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, title, done, created_at FROM tasks ORDER BY id DESC"
        )
        rows = cursor.fetchall()
        # Convert sqlite3.Row objects to standard Python dictionaries
        return [dict(row) for row in rows]


def add_task(title):
    """Insert a new task using a parameterized query to prevent SQL injection."""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with get_connection() as conn:
        cursor = conn.cursor()
        # The '?' placeholders protect against SQL injection attacks
        cursor.execute(
            "INSERT INTO tasks (title, done, created_at) VALUES (?, 0, ?)",
            (title, now_str),
        )
        conn.commit()
        new_id = cursor.lastrowid
        return {
            "id": new_id,
            "title": title,
            "done": 0,
            "created_at": now_str,
        }


def toggle_task(task_id):
    """Toggle a task's done flag between 0 and 1."""
    with get_connection() as conn:
        cursor = conn.cursor()
        # Check current status of the task
        cursor.execute("SELECT done FROM tasks WHERE id = ?", (task_id,))
        row = cursor.fetchone()
        if not row:
            return None

        # Flip 0 to 1, or 1 to 0
        new_done = 0 if row["done"] == 1 else 1
        cursor.execute(
            "UPDATE tasks SET done = ? WHERE id = ?",
            (new_done, task_id),
        )
        conn.commit()

        # Fetch and return the updated task record
        cursor.execute(
            "SELECT id, title, done, created_at FROM tasks WHERE id = ?",
            (task_id,),
        )
        updated_row = cursor.fetchone()
        return dict(updated_row)


def delete_task(task_id):
    """Delete a task by its ID using a parameterized query."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
        conn.commit()
        # Returns True if at least one row was removed, False otherwise
        return cursor.rowcount > 0
