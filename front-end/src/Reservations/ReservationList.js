import React from "react";
import CancelReservation from "./CancelReservation";

function ReservationList({ reservations, loadDashboard }) {
  const reservationsMap = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>
      {reservation.status === "booked" ? (
        <>
          <td>
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              className="btn btn-primary btn-sm"
            >
              Seat
            </a>
          </td>
          <td>
            <a
              href={`/reservations/${reservation.reservation_id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              Edit
            </a>
          </td>
          <td>
            <CancelReservation
              reservation_id={reservation.reservation_id}
              loadDashboard={loadDashboard}
            />
          </td>
        </>
      ) : null}
    </tr>
  ));

  return (
    <div className="table-responsive">
      <table className="table table-sm text-center w-70 mb-5 table-hover">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Reservation Date</th>
            <th scope="col">Reservation Time</th>
            <th scope="col">Number of People</th>
            <th scope="col">Reservation Status</th>
          </tr>
        </thead>

        <tbody className="table-group">{reservationsMap}</tbody>
      </table>
    </div>
  );
}

export default ReservationList;
