import React, { useState } from "react";
import Reservations from "./Reservations";

import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import "../App.css";

function Search() {
  const startSearch = { mobile_number: "" };
  const [newSearch, setNewSearch] = useState({ ...startSearch });
  const [search, setSearch] = useState({ ...startSearch });

  const [reservations, setReservations] = useState([]);
  const [reservationErrors, setReservationErrors] = useState(null);


  function loadDashboard() {
    const abortController = new AbortController();
    setReservationErrors(null);
    listReservations(search, abortController.signal)
      .then(setReservations)
      .catch(setReservationErrors);
    return () => abortController.abort();
  }

  const handleChange = (event) => {
    setNewSearch({
      ...newSearch,
      [event.target.name]: event.target.value,
    });
  };

  console.log(newSearch)

  const handleFind = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationErrors(null);
    listReservations(newSearch, abortController.signal)
      .then(setReservations)
      .then(setSearch(newSearch))
      .catch(setReservationErrors);
    return () => abortController.abort();
  };

  const showReservationErrors = reservationErrors && (
    <ErrorAlert error={reservationErrors} />
  );


  // map through the reservations to get each reservation from the Reservations.js file
  const reservationList = reservations.map((reservation) => (
    <Reservations
      reservations={reservation}
      key={reservation.reservation_id}
      loadDashboard={loadDashboard}
    />
  ));

  // if any reservations, display the header and reservations.  If there is no reservation found, it will show no reservation found.
  const displayReservationByMobileNumber = reservations.length ? (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">NAME</th>
          <th scope="col">PHONE</th>
          <th scope="col">DATE</th>
          <th scope="col">TIME</th>
          <th scope="col">PEOPLE</th>
          <th scope="cold">STATUS</th>
        </tr>
      </thead>
      <tbody>{reservationList}</tbody>
    </table>
  ) : (
    <h2>No reservations found</h2>
  );

  return (
    <div>
      <div className="container">
        <h1 className="row dashHeading">Search Reservations</h1>
      </div>
      <div>{showReservationErrors}</div>
      <div>
        <form className="form" onSubmit={handleFind}>
          <div className="row">
            {" "}
            <div className="col-4">
              <label name="find">Mobile Number</label>
            </div>
            <div className="col-8">
              <input
                name="mobile_number"
                placeholder="Enter a customer's phone number"
                onChange={handleChange}
                value={newSearch.mobile_number}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              <button type="submit" className="btn btn-info btn-block mr-2">
                <span className="oi oi-magnifying-glass"></span>
                &nbsp; Find
              </button>
            </div>
          </div>
        </form>
        <div className="row">
          <div className="container">
            <div className="row dashHeading">
              {displayReservationByMobileNumber}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;