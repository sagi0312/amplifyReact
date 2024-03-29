/* src/App.js */
import React, { useEffect, useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
//import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { DataStore } from "@aws-amplify/datastore";
import { Todo } from "./models";

import {
  withAuthenticator,
  Button,
  Text,
  TextField,
  View,
  SelectField,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import EditToDo from "./EditTodo";
Amplify.configure(awsExports);

const initialState = {
  name: "",
  description: "",
  category: "work",
  finished: "no",
};

const App = ({ signOut, user }) => {
  const [allTodos, setAllTodos] = useState([]);
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editFormData, setEditFormData] = useState(initialState);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [finishedFilter, setFinishedFilter] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }
  const handleEditClick = (todoData) => {
    setEditFormData(todoData);
    setEditFormVisible(true);
  };
  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
      setAllTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      //await API.graphql(graphqlOperation(createTodo, { input: todo }));
      const addNewTodo = await DataStore.save(new Todo(todo));
      console.log("Todo saved successfully!", addNewTodo);
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

  const uniqueCategories = [...new Set(allTodos.map((item) => item.category))];
  const uniqueFinishedState = [
    ...new Set(allTodos.map((item) => item.finished)),
  ];

  const handleCategoryFilter = () => {
    console.log(allTodos);
    console.log(todos);
    console.log(categoryFilter);
    setTodos(
      allTodos.filter((todo) => {
        return todo.category === categoryFilter;
      })
    );
  };

  const handleFinishedFilter = () => {
    setTodos(
      allTodos.filter((todo) => {
        return todo.finished === finishedFilter;
      })
    );
  };

  return (
    <View style={styles.container}>
      <h2>
        Hello {user.username}&emsp;&emsp;
        <Button style={{ backgroundColor: "lightgray" }} onClick={signOut}>
          Sign out
        </Button>
      </h2>
      <h1>
        <center>AMPLIFY TODOS</center>
      </h1>
      <TextField
        placeholder="Name"
        onChange={(event) => setInput("name", event.target.value)}
        style={styles.input}
        defaultValue={formState.name}
      />
      <TextField
        placeholder="Description"
        onChange={(event) => setInput("description", event.target.value)}
        style={styles.input}
        defaultValue={formState.description}
      />
      <label>Category :</label>
      <div
        value={formState.category}
        onChange={(e) => setInput("category", e.target.value)}
        multiple={false}
      >
        <input type="radio" value="Work" name="category" /> Work
        <input type="radio" value="Home" name="category" /> Home
        <input type="radio" value="Other" name="category" /> Other
      </div>
      <label>Finished? :</label>
      <div
        multiple={false}
        value={formState.finished}
        onChange={(e) => setInput("finished", e.target.value)}
      >
        <input type="radio" value="yes" name="finished" /> yes
        <input type="radio" value="no" name="finished" /> no
      </div>

      <Button style={styles.button} onClick={addTodo}>
        Create Todo
      </Button>
      <div>
        <br />
      </div>
      <SelectField
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={styles.searchField}
        placeholder="Search by Category"
      >
        {uniqueCategories.map((categoryName, index) => (
          <option key={index} value={categoryName}>
            {categoryName}
          </option>
        ))}
      </SelectField>
      <Button style={styles.button} onClick={handleCategoryFilter}>
        Search
      </Button>
      <div>
        <br />
      </div>
      <div>
        <SelectField
          value={finishedFilter}
          onChange={(e) => setFinishedFilter(e.target.value)}
          style={styles.searchField}
          placeholder="Search by Finished State"
        >
          {uniqueFinishedState.map((finishedState, index) => (
            <option key={index} value={finishedState}>
              {finishedState}
            </option>
          ))}
        </SelectField>
        <Button style={styles.button} onClick={handleFinishedFilter}>
          Search
        </Button>
      </div>
      <div>
        <br />
      </div>
      <table style={styles.table}>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Finished?</th>
            <th>Action</th>
          </tr>
          {todos.map((todo, index) => (
            <tr key={todo.id ? todo.id : index}>
              <td>
                <center>
                  <Text style={styles.todoName}>{todo.name}</Text>
                </center>
              </td>
              <td>
                <center>
                  <Text style={styles.todoDescription}>{todo.description}</Text>
                </center>
              </td>
              <td>
                <center>
                  <Text style={styles.todoDescription}>{todo.category}</Text>
                </center>
              </td>
              <td>
                <center>
                  <Text style={styles.todoDescription}>{todo.finished}</Text>
                </center>
              </td>
              <td>
                <center>
                  <Button onClick={() => handleEditClick(todo)}>Edit</Button>
                </center>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editFormVisible && <EditToDo formData={editFormData} />}
    </View>
  );
};

const styles = {
  container: {
    margin: "30px 10px 10px 30px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 14,
    padding: "12px 0px",
    width: "200px",
  },
  searchField: {
    width: "300px",
  },
  //style for the table
  table: {
    border: "2px solid forestgreen",
    width: "800px",
    height: "200px",
  },
  th: {
    border: "1px solid black",
  },

  td: {
    align: "center",
  },
};

export default withAuthenticator(App);
