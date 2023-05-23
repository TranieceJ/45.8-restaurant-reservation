const knex = require("../db/connection");


function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name")
};

function read(table_id){
    return knex("tables")
    .select("*")
    .where({table_id})
    .first()
};

function create(table){
    return knex("tables")
    .insert(table,"*")
    .then((createdTable)=>createdTable[0])
};

function update(table){
    return knex("tables")
    .update(table, "*")
    .then((updatedTable)=>updatedTable[0])
};

function seated(reservation_id, table_id){
    return knex.transaction(function (trx){  
      return trx("tables")
        .where({table_id})
        .update({reservation_id})
        .returning("*")
        .then(()=>{
            return trx("reservations")
                .where({reservation_id})
                .update({status: "seated"})
                .returning("*")
                .then((seatedReservation)=>seatedReservation[0]);
        });
    
});
      
};

function finished(table_id, reservation_id){
    return knex.transaction(function (trx){
        return trx("tables")
        .where({table_id})
        .update({reservation_id: null})
        .then(()=>{
            return trx("reservations")
                .where({reservation_id})
                .update({status: "finished"})
        })
    })
}


module.exports = {
    list,
    create,
    update,
    seated,
    finished,
}