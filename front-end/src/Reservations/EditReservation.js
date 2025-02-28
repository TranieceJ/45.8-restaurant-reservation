import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { updateReservation, readReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [currentReservation, setCurrentReservation] = useState({});

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservation_id, abortController.signal).then(
      setCurrentReservation
    );
    return () => abortController.abort();
  }, [reservation_id]);

  // Cancel button to return to current reservationId
  const onCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  // Submit button to update current reservation
  async function handleSubmit(reservation) {
    const formattedDate = formatAsDate(reservation.reservation_date);
    await updateReservation({
      ...reservation,
    });
    history.push(`/dashboard?date=${formattedDate}`);
  }

  return (
    <div>
      <h2>Edit Reservation</h2>
      <ReservationForm
        handleSubmit={handleSubmit}
        onCancel={onCancel}
        submitLabel="Submit"
        cancelLabel="Cancel"
        initialState={currentReservation}
      />
    </div>
  );
}

export default EditReservation;