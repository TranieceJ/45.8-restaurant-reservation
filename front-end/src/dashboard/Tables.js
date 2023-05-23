import React from "react";
import { finishReservation } from "../utils/api";
import "../App.css";

function Tables({ table, loadDashboard }) {

  // when a reservation completes and leaves the table,  makes table available again
  function handleFinish() {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      finishReservation(table.table_id)
        .then(loadDashboard)
        .catch((error) => console.log("error", error));
    }
  }

  return (
    <>
      <tr key={table.table_id}>
        <td className="rowBorder">{table.table_name}</td>
        <td className="rowBorder">{table.capacity}</td>
        <td className="rowBorder" data-table-id-status={table.table_id}>
          {table.reservation_id ? "Occupied" : "Free"}
        </td>
      </tr>
      <tr>
        {table.reservation_id ? (
          <td colSpan="3">
            <button
            type="button"
            className="btn btn-outline-success btn-block"
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
          >
            <span className="oi oi-account-logout"></span>
            &nbsp;&nbsp;&nbsp;Finish
            </button>
          </td>
        ) : (
          <td colSpan="3"></td>
        )}
      </tr>
    </>
  );
}

export default Tables;