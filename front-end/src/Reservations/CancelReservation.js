import React from "react";
import { cancelReservation } from "../utils/api";

function CancelReservation({reservation_id, loadDashboard}){
const abortController = new AbortController();

const cancelHandler = async ()=>{
    const confirm = window.confirm(
        "Do you wish to cancel this reservation?\nThis cannot be undone."
    )
    if(confirm){
        await cancelReservation(reservation_id);
        loadDashboard();
    }
    return () => abortController.abort();
};

return (
    <button type="button" className="btn btn-danger btn-sm" data-reservation-id-cancel={reservation_id} onClick={cancelHandler}>
        Cancel
    </button>
);

};


export default CancelReservation