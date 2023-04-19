/* src/App.js */
import React, { useState } from "react";
import { Amplify, API, graphqlOperation } from "aws-amplify";
import { updateTodo } from "./graphql/mutations";
import { Button, TextField, View } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const EditToDo = (formData) => {
  const [editFinished, setEditFinished] = useState(
    Object.values(formData)[0].finished
  );
  const [successMessage, setSuccessMessage] = useState(false);

  async function handleEditTodo(e) {
    try {
      e.preventDefault();
      const targetData = {
        id: Object.values(formData)[0].id,
        name: Object.values(formData)[0].name,
        description: Object.values(formData)[0].description,
        category: Object.values(formData)[0].category,
        finished: editFinished,
        _version: Object.values(formData)[0]._version,
      };
      console.log(targetData);
      await API.graphql(graphqlOperation(updateTodo, { input: targetData }));
      setSuccessMessage(true);
    } catch (err) {
      console.log("error updating todo:", err);
    }
  }

  return (
    <View style={styles.container}>
      <h1>EDIT THE FINISHED STATUS</h1>
      <TextField
        style={styles.input}
        defaultValue={Object.values(formData)[0].name}
      />
      <TextField
        style={styles.input}
        defaultValue={Object.values(formData)[0].description}
      />
      <TextField
        style={styles.input}
        defaultValue={Object.values(formData)[0].category}
      />

      <label>
        Finished? :
        <div
          value={editFinished}
          onChange={(e) => setEditFinished(e.target.value)}
        >
          <input
            type="radio"
            value="yes"
            name="finishedEdit"
            defaultChecked={editFinished === "yes"}
          />{" "}
          yes
          <input
            type="radio"
            value="no"
            name="finishedEdit"
            defaultChecked={editFinished === "no"}
          />{" "}
          no
        </div>
      </label>
      <div>
        <br />
      </div>
      <Button style={styles.button} onClick={handleEditTodo}>
        Update Todo
      </Button>
      {successMessage && "Updated Successfully"}
      <Button style={styles.button}>Close</Button>
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
