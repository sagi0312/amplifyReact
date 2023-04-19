/* src/App.js */
import React, { useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { updateTodo } from "./graphql/mutations";
import {
  Button,
  TextField,
  View,
  Radio,
  RadioGroupField,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const EditToDo = (formData) => {
  Object.values(formData);
  const [editForm, setEditForm] = useState(formData);
  const [id, setId] = useState(Object.values(formData)[0].id);
  const [editName, setEditName] = useState(Object.values(formData)[0].name);
  const [editDescription, setEditDescription] = useState(
    Object.values(formData)[0].description
  );
  const [editCategory, setEditCategory] = useState(
    Object.values(formData)[0].category
  );
  const [editFinished, setEditFinished] = useState(
    Object.values(formData)[0].finished
  );

  async function editTodo() {
    try {
      console.log(editName);
      const todo = {
        id: id,
        name: editName.toString(),
        description: editDescription.toString(),
        category: editCategory.toString(),
        finished: editFinished.toString(),
      };
      console.log(todo);
      await API.graphql(graphqlOperation(updateTodo, { input: todo }));
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  return (
    <View style={styles.container}>
      <h1>EDIT TODO</h1>
      <TextField
        placeholder="Name"
        onChange={(event) => setEditName(event.target.value)}
        style={styles.input}
        defaultValue={editName}
      />
      <TextField
        placeholder="Description"
        onChange={(event) => setEditDescription(event.target.value)}
        style={styles.input}
        defaultValue={editDescription}
      />
      <label>Category :</label>
      <div
        value={editCategory}
        onChange={(e) => setEditCategory(e.target.value)}
      >
        <input type="radio" value="Work" name="category" /> Work
        <input type="radio" value="Home" name="category" /> Home
        <input type="radio" value="Other" name="category" /> Other
      </div>
      <label>Finished? :</label>
      <div
        value={editFinished}
        onChange={(e) => setEditFinished(e.target.value)}
      >
        <input type="radio" value="yes" name="finished" /> yes
        <input type="radio" value="no" name="finished" /> no
      </div>
      <div>
        <br />
      </div>
      <Button style={styles.button} onClick={() => editTodo()}>
        Update Todo
      </Button>
    </View>
  );
};

const styles = {
  container: {
    margin: "0 auto",
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

export default EditToDo;
