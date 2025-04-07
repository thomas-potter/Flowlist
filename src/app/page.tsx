"use client";

import { useState, useEffect, useRef } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [userName, setUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [greeting, setGreeting] = useState(""); // State for dynamic greeting
  const editInputRef = useRef<HTMLInputElement>(null); // Ref for the input field
  const dragItemIndex = useRef<number | null>(null); // Store the index of the dragged item

  // Load tasks and user name from localStorage on component mount
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    const storedName = localStorage.getItem("userName");

    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }

    if (storedName) {
      setUserName(storedName);
    } else {
      setShowModal(true); // Show modal for new users
    }

    // Determine greeting based on the user's local time
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem("userName", name);
    setShowModal(false);
  };

  const resetName = () => {
    setUserName(null);
    localStorage.removeItem("userName");
    setShowSettings(false);
    setShowModal(true); // Show modal again
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObj: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
    };
    setTasks((prev) => [...prev, newTaskObj]);
    setNewTask("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const completeTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const checkAllTasks = () => {
    setTasks((prev) => prev.map((task) => ({ ...task, completed: true })));
  };

  const clearCompletedTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all" filter
  });

  const activeTaskCount = tasks.filter((task) => !task.completed).length;

  const handleEditTask = (id: string, text: string) => {
    setEditingTaskId(id);
    setEditText(text);
    setTimeout(() => {
      editInputRef.current?.focus(); // Automatically focus the input field
    }, 0);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleEditSubmit = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: editText } : task
      )
    );
    setEditingTaskId(null);
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
  };

  // Drag-and-Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItemIndex.current = index; // Store the index of the dragged task
    e.dataTransfer.effectAllowed = "move"; // Set the drag effect
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (dragItemIndex.current === null) {
      return; // Prevent drop if drag start was not properly initiated
    }

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(dragItemIndex.current, 1); // Remove dragged task
    newTasks.splice(index, 0, draggedTask); // Insert at new position

    setTasks(newTasks);
    dragItemIndex.current = null; // Reset drag index
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null; // Reset drag index
  };

  return (
    <div>
      {/* Modal for new users */}
      {showModal && (
        <div className="modal">
          <h2>Welcome!</h2>
          <p>Please enter your name to get started:</p>
          <input
            type="text"
            placeholder="Your name"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
                handleNameSubmit(e.currentTarget.value.trim());
              }
            }}
          />
          <button
            onClick={() => {
              const input = document.querySelector(".modal input") as HTMLInputElement;
              if (input && input.value.trim() !== "") {
                handleNameSubmit(input.value.trim());
              }
            }}
          >
            Submit
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className={showModal ? "content blurred" : "content"}>
        {/* Greeting Section */}
        <div className="greeting-section">
          <h2>
            {userName ? `${greeting}, ${userName}!` : `${greeting}!`}
          </h2>
        </div>

        {/* Task Section */}
        <div className="task-section">
          {/* Task Adder */}
          <div className="task-adder">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="What needs to be done?"
            />
          </div>

          {/* Tabs and Buttons */}
          <div className="tabs-and-buttons">
            <div className="tabs">
              <button
                className={filter === "all" ? "active-tab" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={filter === "active" ? "active-tab" : ""}
                onClick={() => setFilter("active")}
              >
                Active
              </button>
              <button
                className={filter === "completed" ? "active-tab" : ""}
                onClick={() => setFilter("completed")}
              >
                Completed
              </button>
            </div>
            <div className="buttons">
              <button className="check-all" onClick={checkAllTasks}>
                Check All
              </button>
              <button className="clear-completed" onClick={clearCompletedTasks}>
                Clear Completed
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Task List */}
          <ul className="task-list" onDragOver={handleDragOver}>
            {filteredTasks.map((task, index) => (
              <li
                key={task.id}
                draggable // Enable dragging
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  cursor: editingTaskId === task.id ? "default" : "grab",
                }}
              >
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={task.completed}
                  onChange={() => completeTask(task.id)}
                />
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={handleEditChange}
                    onBlur={() => handleEditSubmit(task.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSubmit(task.id);
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    className="edit-input"
                    ref={editInputRef} // Attach the ref for auto-focus
                  />
                ) : (
                  <span
                    className={`task-text ${task.completed ? "completed" : ""}`}
                    onDoubleClick={() => handleEditTask(task.id, task.text)}
                  >
                    {task.text}
                  </span>
                )}
                <button onClick={() => deleteTask(task.id)}>X</button>
              </li>
            ))}
          </ul>

          {/* Task Count */}
          <div className="task-count">
            <p>{activeTaskCount} items left</p>
          </div>
        </div>
      </div>

      {/* Radial Settings Button */}
      <div className={`settings-menu ${showSettings ? "open" : ""}`}>
        <button
          className={`settings-button ${showSettings ? "open" : ""}`}
          onClick={() => setShowSettings(!showSettings)}
        >
          {showSettings ? "✖️" : "⚙️"}
        </button>
        {showSettings && (
          <div className="radial-menu">
            <button className="reset-name" onClick={resetName}>
              Reset Name
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
