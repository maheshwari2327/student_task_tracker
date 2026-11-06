// Grab references to important DOM elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

// Helper function to display an error alert on the page
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

// Helper function to clear and hide the error alert
function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
}

// Fetch all tasks from the Flask backend and render them
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
            throw new Error("Failed to load tasks from server.");
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (err) {
        showError("Could not connect to the server. Please check if Flask is running.");
    }
}

// Render the task items into the <ul> list
function renderTasks(tasks) {
    taskList.innerHTML = "";

    // Update the counter badge
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;

    // Show empty state message if no tasks exist
    if (tasks.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    // Loop through each task and build its HTML elements
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.done ? "completed" : ""}`;

        // Left section: checkbox + text + timestamp
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = Boolean(task.done);
        checkbox.title = "Mark as done or not done";
        // Feature 3: Toggle done status when clicked
        checkbox.addEventListener("change", () => toggleTask(task.id));

        const contentDiv = document.createElement("div");
        contentDiv.className = "task-content";

        const titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;

        const timeSpan = document.createElement("span");
        timeSpan.className = "task-time";
        timeSpan.textContent = task.created_at;

        contentDiv.appendChild(titleSpan);
        contentDiv.appendChild(timeSpan);

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(contentDiv);

        // Feature 4: Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.type = "button";
        deleteBtn.title = "Delete this task";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

// Feature 1: Add a task
async function addTask(e) {
    e.preventDefault();
    clearError();

    const title = taskInput.value.trim();

    // Frontend validation
    if (!title) {
        showError("Please enter a task title.");
        return;
    }
    if (title.length > 200) {
        showError("Task title must be under 200 characters.");
        return;
    }

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Display backend validation error if any
            showError(data.error || "Failed to add task.");
            return;
        }

        // Clear input field and reload task list
        taskInput.value = "";
        loadTasks();
    } catch (err) {
        showError("Error adding task. Please check server connection.");
    }
}

// Feature 3: Mark a task as done or not done
async function toggleTask(id) {
    clearError();
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "PATCH",
        });

        if (!response.ok) {
            const data = await response.json();
            showError(data.error || "Failed to update task.");
            return;
        }

        // Refresh list to update visual state
        loadTasks();
    } catch (err) {
        showError("Error updating task. Please try again.");
    }
}

// Feature 4: Delete a task
async function deleteTask(id) {
    clearError();
    try {
        const response = await fetch(`/api/tasks/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            const data = await response.json();
            showError(data.error || "Failed to delete task.");
            return;
        }

        // Refresh list after deletion
        loadTasks();
    } catch (err) {
        showError("Error deleting task. Please try again.");
    }
}

// Clear error banner when user begins typing
taskInput.addEventListener("input", clearError);

// Handle form submission
taskForm.addEventListener("submit", addTask);

// Feature 2: Load and see all tasks when the page loads
document.addEventListener("DOMContentLoaded", loadTasks);
