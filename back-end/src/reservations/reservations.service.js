const knex = require("../db/connection");

function list(reservation_date){
    return knex("reservations")
    .select("*")
    .where({reservation_date})
    .whereNot({status: "finished"})
    .whereNot({status: "cancelled"})
    .orderBy("reservation_time")
}

function create(reservation){
    return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservation) => createdReservation[0])
};

function read(reservation_id){
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first()
};

function setStatus(updatedReservation){
    return knex("reservations")
    .where({reservation_id: updatedReservation.reservation_id})
    .whereNot({status: "finished"})
    .update(updatedReservation, "*")
    .then((updatedStatus) => updatedStatus[0])
}

function readByNumber(mobile_number){
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function update(editReservation){
    return knex("reservations")
    .select("*")
    .where({reservation_id: editReservation.reservation_id})
    .update(editReservation, "*")
    .then((updatedReservation) => updatedReservation[0])
}


module.exports = {
    list,
    create,
    read,
    setStatus,
    readByNumber,
    update,
}