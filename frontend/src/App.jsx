import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  const addOrUpdateTodo = () => {
    if (task.trim() === "") return;

    if (editingId) {
      updateTodo(editingId, task);
    } else {
      addTodo();
    }
  };

  const addTodo = () => {
    fetch("http://localhost:5000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task }),
    })
      .then((res) => res.json())
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setTask("");
      });
  };

  const updateTodo = (id, newText) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newText }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(
          todos.map((todo) => (todo._id === id ? updatedTodo : todo))
        );
        setTask("");
        setEditingId(null);
      });
  };

  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter((todo) => todo._id !== id));
    });
  };

  const toggleTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: "PUT",
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(
          todos.map((todo) => (todo._id === id ? updatedTodo : todo))
        );
      });
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setTask(todo.text);
  };

  return (
    <div className="container">
      <h1> To-Do App</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={addOrUpdateTodo}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => toggleTodo(todo._id)}>
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => startEditing(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
