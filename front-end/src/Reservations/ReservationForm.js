import React, { useEffect, useState } from "react";

import { formatAsTime } from "../utils/date-time";

function ReservationForm({
  onCancel,
  handleSubmit,
  submitLabel,
  cancelLabel,
  initialState,
  error,
}) {
  const [reservationData, setReservationData] = useState({ ...initialState });

  const changeHandler = (event) => {
    if (event.target.name === "people") {
      setReservationData({
        ...reservationData,
        [event.target.name]: Number(event.target.value),
      });
    } else {
      setReservationData({
        ...reservationData,
        [event.target.name]: event.target.value,
      });
    }
  };

  useEffect(() => {
    setReservationData(initialState);
  }, [initialState]);

  const submitHandler = (event) => {
    event.preventDefault();
    const formattedTime = formatAsTime(reservationData.reservation_time);
    handleSubmit({ ...reservationData, reservation_time: formattedTime });
    if (!error) {
      setReservationData({ ...initialState });
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="first_name">
          First Name:
          <input
            className="form-control"
            name="first_name"
            id="first_name"
            type="text"
            required={true}
            value={reservationData.first_name || ""}
            placeholder="First Name"
            onChange={changeHandler}
          />
        </label>
        <br />
        <label htmlFor="last_name">
          Last Name:
          <input
            className="form-control"
            name="last_name"
            id="last_name"
            type="text"
            required={true}
            value={reservationData.last_name || ""}
            placeholder="Last Name"
            onChange={changeHandler}
          />
        </label>
        <br />
        <label htmlFor="mobile_number">
          Mobile Number:
          <input
            className="form-control"
            name="mobile_number"
            id="mobile_number"
            type="number"
            required={true}
            value={reservationData.mobile_number || ""}
            placeholder="Mobile Number"
            onChange={changeHandler}
          />
        </label>
        <br />
        <label htmlFor="reservation_date">
          Reservation Date:
          <input
            className="form-control"
            name="reservation_date"
            id="reservation_date"
            type="date"
            required={true}
            value={reservationData.reservation_date || ""}
            placeholder="Reservation Date"
            onChange={changeHandler}
          />
        </label>
        <br />
        <label htmlFor="reservation_time">
          Reservation Time:
          <input
            className="form-control"
            name="reservation_time"
            id="reservation_time"
            type="time"
            required={true}
            value={reservationData.reservation_time || ""}
            placeholder="Reservation Time"
            onChange={changeHandler}
          />
        </label>
        <br />
        <label htmlFor="people">
          Number of People:
          <input
            className="form-control"
            name="people"
            id="people"
            type="number"
            required={true}
            value={reservationData.people || ""}
            placeholder="Number of People"
            onChange={changeHandler}
          />
        </label>
      </div>
      <div>
        
        <button type="submit" className="btn btn-success float-right">
          {submitLabel}
        </button>
        <button
          type="button"
          className="btn btn-danger mr-2 float-right"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  );
}

export default ReservationForm;
