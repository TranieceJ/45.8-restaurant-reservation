import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { readReservation, listTables, seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "../App.css";

function Seat() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  const [tableId, setTableId] = useState("");
  const { reservation_id } = useParams();
  const resId = Number(reservation_id);
  const history = useHistory();

  useEffect(loadSingleReservation, [resId]);

  function loadSingleReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    readReservation(resId, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);

    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const availableTables = tables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  const handleChange = (event) => {
    setTableId(Number(event.target.value));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await seatTable(reservation_id, tableId, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setTablesError(error);
      setReservationError(error);
      return () => abortController.abort();
    }
  };

  return (
    <div>
      <div className="container">
        <h1 className="row dashHeading">Seat Reservation</h1>
      </div>
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tablesError} />
      <form onSubmit={handleSubmit}>
        <div className="container">
          <fieldset className="reservations">
            <table className="table seatTable">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">NAME</th>
                  <th scope="col">PHONE</th>
                  <th scope="col">DATE</th>
                  <th scope="col">TIME</th>
                  <th scope="col">PEOPLE</th>
                </tr>
              </thead>
              <tbody key={reservation.reservation_id}>
                <tr key={reservation.reservation_id}>
                  <td className="rowBorder">{reservation.reservation_id}</td>
                  <td className="rowBorder">
                    {reservation.last_name}, {reservation.first_name}
                  </td>
                  <td className="rowBorder">{reservation.mobile_number}</td>
                  <td className="rowBorder">{reservation.reservation_date}</td>
                  <td className="rowBorder">{reservation.reservation_time}</td>
                  <td className="rowBorder">{reservation.people}</td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </div>

        <div className="container row">
          <div className="col">
            <h3>Seat at table:</h3>
          </div>
          <div className="col">
            <h4>
              <select required name="table_id" onChange={handleChange}>
                <option>Select a table</option>
                {availableTables}
              </select>
            </h4>
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
    </div>
  );
}

export default Seat;
