import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";


const initialState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: "",
};


function NewReservation() {
  const [error, setError] = useState(null);

  const history = useHistory();

  const handleSubmit = async (newReservation) => {
    const abortController = new AbortController();
    try {
      const createdReservation = await createReservation(newReservation);
      history.push(
        `/dashboard?date=${formatAsDate(createdReservation.reservation_date)}`
      );
    } catch (error) {
      setError(error);
    }
    return abortController;
  };

  return (
    <div>
      <h2>Create Reservation</h2>
      <ErrorAlert error={error} />

      <ReservationForm
        handleSubmit={handleSubmit}
        onCancel={history.goBack}
        submitLabel="Submit"
        cancelLabel="Cancel"
        initialState={initialState}
        error={error}
      />
    </div>
  );
}

export default NewReservation;
