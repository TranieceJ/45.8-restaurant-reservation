import React from "react";
import { useHistory } from "react-router-dom";
import "../App.css";

/**
 * This is the form for creating tables.  Allows for edits to  tables at a later point if needed.
 */

function TableForm({
  formName,
  handleChange,
  handleSubmit,
  tables,
  tableId = "",
}) {
  const history = useHistory();

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="form-group col">
          <div className="row">
            <div className="col-4">
              <label htmlFor="table_name">Table Name</label>
            </div>
            <div className="col-8">
              <input
                name="table_name"
                id="table_name"
                onChange={handleChange}
                value={tables.table_name}
                placeholder={
                  (formName = "New Table"
                    ? "Table Name"
                    : `${tables.table_name}`)
                }
                required={true}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <label htmlFor="capacity">Capacity</label>
            </div>
            <div className="col-8">
              <input
                name="capacity"
                id="capacity"
                onChange={handleChange}
                value={tables.capacity}
                placeholder={
                  (formName = "New Table" ? "Capacity" : `${tables.capacity}`)
                }
                required={true}
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="row">
          <div className="col-sm">
            <button type="submit" className="btn btn-info btn-block mr-2">
              <span className="oi oi-check"></span>
              &nbsp;Submit
            </button>
          </div>
          <div className="col-sm">
            <button
              type="button"
              className="btn btn-secondary btn-block mr-2"
              onClick={history.goBack}
            >
              <span className="oi oi-x"></span>
              &nbsp;Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default TableForm;