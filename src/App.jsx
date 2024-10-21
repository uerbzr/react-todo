import { useEffect, useState } from "react";
import { API_URL } from "./consts";

function App() {
  const [todos, setTodos] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // LOAD EXISTING TODOS
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setIsFetching(false);
      });
  }, []);

  // HANDLE UPDATING TODO
  const handleCheckedChangeRequest = (id, checked) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: checked }),
    })
      .then((response) => {
        if (!response.ok) {
          setIsFetching(false);
          throw new Error("Failed to update todo");
        }
      })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => {
            if (todo.id === id) {
              return { ...todo, completed: checked };
            }
            return todo;
          })
        );
        setIsFetching(false);
      })
      .catch((error) => {
        console.error(error);
        setIsFetching(false);
      });
    setIsFetching(true);
  };

  // HANDLE CREATING TODO
  const handleCreateNewTodo = () => {
    fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTaskTitle, completed: false }),
    })
      .then((response) => {
        if (!response.ok) {
          setIsFetching(false);
          throw new Error("Failed to create todo");
        }
        return response.json();
      })
      .then((data) => {
        setIsFetching(false);
        setTodos((prevTodos) => [...prevTodos, data]);
        setNewTaskTitle("");
      })
      .catch((error) => {
        setIsFetching(false);
        console.error(error);
      });
    setIsFetching(true);
  };

  const handleDeleteTodo = (id) => {
    fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          setIsFetching(false);
          throw new Error("Failed to delete todo");
        }
      })
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        setIsFetching(false);
      })
      .catch((error) => {
        console.error(error);
        setIsFetching(false);
      });
    setIsFetching(true);
  };

  const handleNewTaskChanged = (event) => {
    setNewTaskTitle(event.target.value);
  };

  console.log(API_URL);
  return (
    <>
      <h1>Todo App</h1>
      <p
        style={{
          color: isFetching ? "red" : "green",
        }}
      >
        Fetch Status: {isFetching ? "fetching" : "not fetching"}
      </p>

      <h2>Create Task</h2>
      <div>
        <input
          type="text"
          placeholder="New task"
          onChange={handleNewTaskChanged}
          value={newTaskTitle}
        />
        <button onClick={handleCreateNewTodo} disabled={isFetching}>
          Create
        </button>
      </div>
      <h2>Tasks</h2>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              textDecoration: todo.completed ? "line-through" : "",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              disabled={isFetching}
              onChange={(event) =>
                handleCheckedChangeRequest(todo.id, event.target.checked)
              }
            />
            {todo.title} (id: {todo.id})
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              disabled={isFetching}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
