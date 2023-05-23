import "../App.css";
//import { setStatus } from "../utils/api";

function Reservations({ reservations, loadDashboard }) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservations;

  // cancels the reservation
  const handleCancel = () => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      const abortController = new AbortController();
      setStatus(reservation_id, { status: "cancelled" }, abortController.signal)
        .then(loadDashboard)
        .catch((error) => console.log(error));
      return () => abortController.abort();
    }
  };

  return (
    <>
      <tr key={reservation_id}>
        <td className="rowBorder">{reservation_id}</td>
        <td className="rowBorder">
          {last_name}, {first_name}
        </td>
        <td className="rowBorder">{mobile_number}</td>
        <td className="rowBorder">{reservation_date}</td>
        <td className="rowBorder">{reservation_time}</td>
        <td className="rowBorder">{people}</td>
        <td data-reservation-id-status={reservation_id} className="rowBorder">{status}</td>
      </tr>
      <tr>
        <td></td>
        <td colSpan="2">
          {status === "booked" && (
            <a
              href={`/reservations/${reservation_id}/seat`}
              className="btn btn-outline-success btn-block"
            >
              <span className="oi oi-account-login"></span>
              &nbsp;&nbsp;&nbsp;Seat
            </a>
          )}
        </td>
        <td colSpan="2">
          {status === "booked" && (
            <a
              href={`/reservations/${reservation_id}/edit`}
              className="btn btn-outline-info btn-block"
            >
              <span className="oi oi-text"></span>
              &nbsp;&nbsp;&nbsp;Edit
            </a>
          )}
        </td>
        <td colSpan="2">
          {status === "booked" && (
            <button
              data-reservation-id-cancel={reservation_id}
              className="btn btn-outline-secondary btn-block"
              onClick={handleCancel}
            >
              <span className="oi oi-circle-x"></span>
              &nbsp;&nbsp;&nbsp;Cancel
            </button>
          )}
        </td>
      </tr>
    </>
  );
}

export default Reservations;