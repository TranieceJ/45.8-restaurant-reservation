import React, { useState } from "react";
import { searchByNumber } from "../utils/api";
import ReservationList from "./ReservationList";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservation() {
  const [number, setNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const searchResults = await searchByNumber(number);
      setReservations(searchResults);
      setNumber("");
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  const handleChange = ({ target }) => {
    setNumber(target.value);
  };

  return (
    <main>
      <h2>Find a Reservation</h2>
      <form onSubmit={handleSubmit}>
        <ErrorAlert error={error} />
        <div className="input-group mb-3 w-75">
          <input
            name="mobile_number"
            type="text"
            required={true}
            className="form-control me-auto"
            placeholder="Enter Mobile Number"
            aria-label="Enter Mobile Number"
            aria-describedby="basic-addon2"
            onChange={handleChange}
            value={reservations.mobile_number}
          ></input>
          <div className="input-group-btn ml-2">
            <button className="btn btn-secondary" type="submit">
              Search
            </button>
          </div>
        </div>
      </form>
      <div className="container-fluid col">
        <div className="row d-md-flex mb-3">
          <h4>Search Result</h4>
        </div>
        {reservations.length > 0 ? (
          <div className="row d-md-flex mb-3">
            <ReservationList reservations={reservations} />
          </div>
        ) : (
          <div
            className="row d-md-flex mb-3 alert alert-dark text-center w-75"
            role="alert"
          >
            No reservations found
          </div>
        )}
      </div>
    </main>
  );
}

export default SearchReservation;