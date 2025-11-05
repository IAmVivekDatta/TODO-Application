// Import the useState and useEffect hooks from the React library.
import { useState, useEffect } from "react";

// Define the main functional component for the application, named App.
function App() {
  // Initialize the 'todos' state. It uses a function to lazily initialize the state.
  const [todos, setTodos] = useState(() => {
    // Retrieve the 'todos' item from the browser's local storage.
    const saved = localStorage.getItem("todos");
    // If 'saved' data exists, parse it from a JSON string; otherwise, return an empty array.
    return saved ? JSON.parse(saved) : [];
  });
  // Initialize the 'task' state with an empty string. This will hold the value of the input field.
  const [task, setTask] = useState("");
  // Initialize the 'editingIndex' state to null. This will track which todo item is currently being edited.
  const [editingIndex, setEditingIndex] = useState(null);

  // Use the useEffect hook to perform a side effect. In this case, saving todos to localStorage.
  useEffect(() => {
    // Convert the 'todos' array to a JSON string and save it in localStorage under the key "todos".
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]); // The dependency array [todos] means this effect runs only when the 'todos' state changes.

  // Define a function to add a new todo or update an existing one.
  const addOrUpdateTodo = () => {
    // If the task input is empty or just whitespace, do nothing and exit the function.
    if (task.trim() === "") return;

    // Check if we are in editing mode (i.e., editingIndex is not null).
    if (editingIndex !== null) {
      // Create a new array by copying the existing 'todos' to avoid direct state mutation.
      const updated = [...todos];
      // Update the text of the todo item at the specified index with the current task value.
      updated[editingIndex].text = task;
      // Set the 'todos' state to the newly updated array, triggering a re-render.
      setTodos(updated);
      // Reset the editing index to null to exit editing mode.
      setEditingIndex(null);
    } else {
      // If not in editing mode, add a new todo object to the 'todos' array.
      // The new todo has the input text and a 'done' status of false.
      setTodos([...todos, { text: task, done: false }]);
    }
    // Clear the input field by resetting the 'task' state to an empty string.
    setTask("");
  };

  // Define a function to toggle the 'done' status of a todo item at a specific index.
  const toggleTodo = (index) => {
    // Create a new array by copying the existing 'todos'.
    const newTodos = [...todos];
    // Invert the boolean 'done' property of the todo item at the given index.
    newTodos[index].done = !newTodos[index].done;
    // Update the 'todos' state with the modified array.
    setTodos(newTodos);
  };

  // Define a function to delete a todo item at a specific index.
  const deleteTodo = (index) => {
    // Update the 'todos' state by filtering out the item at the given index.
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Define a function to start editing a todo item.
  const editTodo = (index) => {
    // Set the 'task' state to the text of the todo item being edited, populating the input field.
    setTask(todos[index].text);
    // Set the 'editingIndex' to the index of the item being edited to enter editing mode.
    setEditingIndex(index);
  };

  // The return statement contains the JSX that will be rendered to the DOM.
  return (
    // A container div for the entire application.
    <div className="container">
      {/* The main heading of the application. */}
      <h1> To-Do App</h1>

      {/* A div to group the input field and the add/update button. */}
      <div className="input-row">
        {/* An input field for the user to enter a task. */}
        <input
          type="text" // Specifies the input type.
          placeholder="Enter a task..." // Placeholder text shown when the input is empty.
          value={task} // Binds the input's value to the 'task' state.
          // An event handler that calls setTask to update the state on every keystroke.
          onChange={(e) => setTask(e.target.value)}
        />
        {/* A button to add or update a task. */}
        <button onClick={addOrUpdateTodo}>
          {/* The button's text changes based on whether we are in editing mode. */}
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* An unordered list to display the todo items. */}
      <ul className="todo-list">
        {/* Map over the 'todos' array to create a list item for each todo. */}
        {todos.map((todo, index) => (
          // Each list item needs a unique 'key' prop for React to efficiently update the list.
          <li key={index}>
            {/* A span to display the todo text. */}
            <span
              // Inline style to apply a line-through text decoration if the todo is done.
              style={{
                textDecoration: todo.done ? "line-through" : "none",
              }}
            >
              {/* The actual text of the todo item. */}
              {todo.text}
            </span>
            {/* A div to group the action buttons for each todo item. */}
            <div>
              {/* A button to toggle the completion status of the todo. */}
              <button onClick={() => toggleTodo(index)}>
                {/* The button text changes based on the todo's 'done' status. */}
                {todo.done ? "Undo" : "Complete"}
              </button>
              {/* A button to edit the todo item. */}
              <button onClick={() => editTodo(index)}>Edit</button>
              {/* A button to delete the todo item. */}
              <button onClick={() => deleteTodo(index)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export the App component to be used in other parts of the application (e.g., index.js).
export default App;
