import React, { useEffect, useState } from "react";
import { finishReservation, listReservations, listTables } from "../utils/api";
import { next, previous, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../Reservations/ReservationList";
import TableList from "../Tables/TableList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null)

  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadTables, []);
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  const handleFinishReservation = async (table_id) => {
    const abortController = new AbortController();
    const confirm = window.confirm(
      "Is this table ready to seat new guests?\nThis cannot be undone."
    );
    if (confirm) {
      try {
        await finishReservation(table_id, abortController.signal);
        loadDashboard();
        loadTables();
      } catch (e) {
        console.log(e);
      }
    }
    return () => abortController.abort();
  };


  return (
    <main>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom  d-md-flex">
        <div>
          <h1>Dashboard</h1>
          <h5>Today's Date: {date}</h5>
        </div>

        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group me-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn m-1 mt-2 float-right"
              onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
            >
              Previous Day
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn m-1 mt-2 float-right"
              onClick={() => history.push(`/dashboard?date=${today()}`)}
            >
              Today
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn m-1 mt-2 float-right"
              onClick={() => history.push(`/dashboard?date=${next(date)}`)}
            >
              Next Day
            </button>
          </div>
        </div>
      </div>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ReservationList
        reservations={reservations}
        loadDashboard={loadDashboard}
      />
      {!tablesError && <TableList
        tables={tables}
        handleFinishReservation={handleFinishReservation}
      />}
    </main>
  );
}

export default Dashboard;