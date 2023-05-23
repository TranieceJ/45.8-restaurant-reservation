const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../validations/hasProperties");
const tableIdExists = require("../validations/tableIdExists");

// -- Required Properties & Parameters -- //
const REQUIRED_PROPERTIES = ["table_name", "capacity"];
const PARAMS_REQUIRED = ["reservation_id"];

// Validation functions ensure that all required information is inputted for each table
const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);
const hasRequiredUpdateProperties = hasProperties(PARAMS_REQUIRED);


function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
    const invalidStatuses = Object.keys(data).filter(
      (field) => ![...REQUIRED_PROPERTIES, "reservation_id"].includes(field)
    );
    if (invalidStatuses.length) {
        // If table does not have all required properties, give error message for invalid fields
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidStatuses.join(", ")}`,
      });
    }
    // Move to the next validation function or error
    next();
  }


// Check if reservation for this table exists by finding matching "reservation_id"
async function reservationIdExists(req, res, next){
    const reservationId = req.body.data.reservation_id;
    const reservation = await reservationService.read(reservationId)

    if(reservation){
        res.locals.reservation = reservation;
        return next();
    }
    return next({
        status: 404,
        message: `${reservationId} not found`,
    });
}

function hasValidValues(req, res, next){
    const {table_name, capacity} = req.body.data;

    if(table_name.length < 2){
        return next({
            status: 400,
            message: `${table_name} must have at least 2 characters`,
        })
    }
    if(typeof capacity !== "number"){
        return next({
            status: 400,
            message: `Capacity must be a number`,
        })
    }

    if(capacity < 1){
        return next({
            status: 400,
            message: `Capacity must be at least 1`,
        })
    }
    next();
}

function unOccupiedTable (req, res, next){
    const {people} = res.locals.reservation;
    const {reservation_id, capacity} = res.locals.tables;

    if(reservation_id !== null){
        return next({
            status: 400,
            message: `This table is already occupied`
        })
    }

    if(people > capacity){
        return next({
            status: 400,
            message: "Reservation party is larger than this table's capacity"
        })
    }
    next()
};


async function list(req, res){
    const data = await service.list();
    res.json({data})
}

async function create(req, res){
    const table = await service.create(req.body.data);
    res.status(201).json({data: table})
}

async function seat(req, res){
    const {table_id} = req.params;
    const {reservation_id} = req.body.data;
    const data = await service.seated(reservation_id, table_id)
    res.status(200).json({data});
};

async function finish(req, res){
    const {table_id} = req.params;
    const {reservation_id} = res.locals.tables;
    const data = await service.finished(table_id,reservation_id);
    res.status(200).json({data})
}


module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [
      hasOnlyValidProperties,
      hasRequiredProperties,
      hasValidValues,
      asyncErrorBoundary(create),
    ],
    seat: [
      hasRequiredUpdateProperties,
      asyncErrorBoundary(reservationIdExists),
      asyncErrorBoundary(tableIdExists),
      asyncErrorBoundary(resIsSeated),
      validateTableIsUnoccupied,
      asyncErrorBoundary(seat),
    ],
    finish: [
      asyncErrorBoundary(tableIdExists),
      asyncErrorBoundary(finish),
    ],
  };