# Student Task Tracker

A beginner-friendly web application built with **Python Flask**, **SQLite3**, and vanilla **HTML/CSS/JavaScript**. It lets students track their homework, assignments, and study tasks with ease.

---

## Features
1. **Add a task**: Enter task title in a text box and click "Add".
2. **See all tasks**: View tasks listed with the newest tasks at the top.
3. **Mark as done / not done**: Check or uncheck a task checkbox to toggle completion.
4. **Delete a task**: Click the "Delete" button to remove a task permanently.

---

## Project Structure
- `app.py`: The Flask web server handling API routes (`GET`, `POST`, `PATCH`, `DELETE`) and serving `index.html`.
- `database.py`: Direct SQLite3 database functions to create the table and run parameterized queries.
- `templates/index.html`: The HTML layout for the task tracker page.
- `static/style.css`: Clean, modern styling optimized for mobile phones and desktops.
- `static/app.js`: Client-side JavaScript using `fetch()` to communicate with Flask endpoints.
- `requirements.txt`: Python package dependencies (`flask`).
- `tasks.db`: SQLite database file (created automatically on first launch).

---

## Setup Steps

### 1. Create a virtual environment
```bash
python -m venv .venv
```

### 2. Activate the virtual environment
- **Windows (Command Prompt / PowerShell)**:
  ```powershell
  .venv\Scripts\activate
  ```
- **Mac / Linux**:
  ```bash
  source .venv/bin/activate
  ```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Flask application
```bash
python app.py
```

### 5. Open in your browser
Navigate to:
```
http://localhost:5000
```

---

## Database Inspection
To see your saved tasks inside the SQLite database, open your terminal and run:

```bash
sqlite3 tasks.db
```

Then run this SQL query:
```sql
SELECT * FROM tasks;
```
