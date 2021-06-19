import React, { useEffect, useState } from "react";
import { Auth, API, graphqlOperation } from "aws-amplify";
import "../component/style.css";
import { listTodos } from "./../graphql/queries";
import { createTodo, deleteTodo, updateTodo } from "../graphql/mutations";
import {
  onCreateTodo,
  onDeleteTodo,
  onUpdateTodo,
} from "../graphql/subscriptions";
const initialState = { name: "", description: "" };

function Home(props) {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  console.log(todos);
  async function logout() {
    try {
      await Auth.signOut();
      props.setSignInData({ confirmSignin: false });
    } catch (err) {
      console.log("logout", err);
    }
  }
  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }
  console.log(formState);
  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      console.log(todos);
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos", err);
    }
  }

  async function addTodo(e) {
    e.preventDefault();
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
      setFormState(initialState);
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }
  async function delTodo(id) {
    try {
      if (!id) return;
      await API.graphql(graphqlOperation(deleteTodo, { input: { id } }));
    } catch (err) {
      console.log("error deleting todo:", err);
    }
  }

  async function updateTodoData({ todoName, todoDescription, id }) {
    try {
      if (!todoName || !todoDescription) return;
      const name = prompt("Update Name", todoName);
      const description = prompt("Update Description", todoDescription);
      await API.graphql(
        graphqlOperation(updateTodo, { input: { id, name, description } })
      );
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  let createSubscription;
  let deleteSubscription;
  let updateSubscription;

  function setupSubscription() {
    createSubscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
      next: (todoData) => {
        const todo = todoData.value.data.onCreateTodo;
        setTodos((prev) => [...prev, todo]);
      },
      error: (error) => console.warn(error),
    });

    deleteSubscription = API.graphql(graphqlOperation(onDeleteTodo)).subscribe({
      next: (todoData) => {
        setTodos((prev) =>
          prev.filter(
            (value) => value.id !== todoData.value.data.onDeleteTodo.id
          )
        );
      },
      error: (error) => console.warn(error),
    });

    updateSubscription = API.graphql(graphqlOperation(onUpdateTodo)).subscribe({
      next: (todoData) => {
        const todo = todoData.value.data.onUpdateTodo;
        setTodos((prev) =>
          prev.filter((value, index) => {
            if (value.id === todoData.value.data.onUpdateTodo.id) {
              prev.splice(index, 1, todo);
              let newTodo = [...prev];
              return setTodos(newTodo);
            }
          })
        );
      },
      error: (error) => console.warn(error),
    });
  }

  useEffect(() => {
    setupSubscription();
    return () => {
      createSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
      updateSubscription.unsubscribe();
    };
  }, []);
  return (
    <div>
      {/* header  */}
      <div className="header">
        <div className="container">
          <span>Todo</span>
          <button onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* todo form*/}

      <div className="container">
        <div className="todoform">
          <div>
            <form onSubmit={addTodo}>
              <input
                type="text"
                placeholder="Title"
                value={formState.name}
                onChange={(event) => setInput("name", event.target.value)}
                required
              />
              <br />
              <input
                type="text"
                placeholder="Description"
                value={formState.description}
                onChange={(event) =>
                  setInput("description", event.target.value)
                }
                required
              />
              <button type="submit">Add Items</button>
            </form>
            <div>
              {todos.map((value, index) => {
                return (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <div>
                      <p>{value.name}</p>
                      <p>{value.description}</p>
                    </div>
                    <div>
                      <a onClick={() => delTodo(value.id)}>Delete</a>
                      <a
                        onClick={() =>
                          updateTodoData({
                            todoName: value.name,
                            todoDescription: value.description,
                            id: value.id,
                          })
                        }
                      >
                        Update
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* todo list */}

      <div style={{}}></div>
    </div>
  );
}

export default Home;
