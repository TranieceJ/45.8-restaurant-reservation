import React, { useState } from "react";
import { createTable } from "../utils/api";
import { useHistory } from "react-router-dom";
import TableForm from "./TableForm";
import "../layout/Layout.css";
import ErrorAlert from "../layout/ErrorAlert";



function NewTable() {
  const initialState = {
    table_name: "",
    capacity: "",
  };

  const [errorMessage, setErrorMessage] = useState(null);

  const history = useHistory();

  const handleSubmit = async (newTable) => {
    const abortController = new AbortController();
    try {
      await createTable(newTable);
      history.push(`/dashboard`);
    } catch (error) {
      setErrorMessage(error);
    }
    return () => abortController;
  };

  return (
    <div>
      <h2>Create a Table</h2>
      <ErrorAlert error={errorMessage} />

      <TableForm
        handleSubmit={handleSubmit}
        onCancel={history.goBack}
        submitLabel="Submit"
        cancelLabel="Cancel"
        initialState={initialState}
        error={errorMessage}
      />
    </div>
  );
}

export default NewTable;