const reservationsService = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../validations/hasProperties");


// Required Properites for validation
const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]
 
const hasRequiredProperties = hasProperties(REQUIRED_PROPERTIES);

async function validateProperties(req, res, next) {
  const {
    data: { reservation_date, reservation_time, people },
  } = req.body;

  const [hours, minutes] = reservation_time.split(":");
  const newResTime=`${hours}:${minutes}`
  try {
    if (!checkDate(reservation_date)) {
      const error = new Error(
        `reservation_date format is not valid, use YYYY-MM-DD`
      );
      error.status = 400;
      throw error;
    }
    if (!checkTime(newResTime)) {
      const error = new Error(
        `reservation_time format is not valid, use HH:MM:SS`
      );
      error.status = 400;
      throw error;
    }
    if (typeof people !== "number") {
      const error = new Error(`people must be a number`);
      error.status = 400;
      throw error;
    }
    if (people < 1) {
      const error = new Error(`people must be at least 1`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function validateReservationDate(req, res, next) {
  const {
    data: { reservation_date, reservation_time },
  } = req.body;
  const [hours, minutes] = reservation_time.split(":")
  const UTCHours = Number(hours) + 5
  const reservationDate = new Date(
    `${reservation_date}T${UTCHours}:${minutes}:00.000Z`
  );
  const reservationDay = new Date(`${reservation_date}T${reservation_time}:00.000Z`)
  try {
    if (Date.now() > Date.parse(reservationDate)) {
      const error = new Error(`Reservation must be for a future date or time`);
      error.status = 400;
      throw error;
    }
    if (reservationDay.getDay() == 2) {
      const error = new Error(`We are closed on Tuesdays`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function validateReservationTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;
  const [hours, minutes] = reservation_time.split(":");
  try {
    if ((hours <= 10 && minutes < 30) || hours <= 9) {
      const error = new Error(`We open at 10:30am`);
      error.status = 400;
      throw error;
    }
    if ((hours >= 21 && minutes > 30) || hours >= 22) {
      const error = new Error(`We stop accepting reservations after 9:30pm`);
      error.status = 400;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
}

function checkDate(date) {
  let regDateTest = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  return regDateTest.test(date);
}

function checkTime(time) {
  let regTimeTest = /^(2[0-3]|[0-1][0-9]):[0-5][0-9]$/;
  return regTimeTest.test(time);
}

async function reservationIdExists(req, res, next) {
  const resId = req.params.reservation_id;
  const reservation = await reservationsService.read(resId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `${resId} not found`,
  });
}
// -- Status of reservation validation functions --//
function statusNotFinished(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "finished") {
    return next({
      status: 400,
      message: "A finished reservation cannot be updated",
    });
  }
  next();
}

function validStatus(req, res, next) {
  const { status } = req.body.data;
  const VALID_STATUSES = ["booked", "seated", "finished", "cancelled"];
  if (VALID_STATUSES.includes(status)) {
    return next();
  }
  next({
    status: 400,
    message: "Status is unknown",
  });
}

function statusIsBooked(req, res, next) {
  const { data = {} } = req.body;
  const status = data.status;
  if (status && status !== "booked") {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }
  next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const {date, mobile_number} = req.query;
  const reservation = await (mobile_number ? reservationsService.readByNumber(mobile_number): reservationsService.list(date));
  res.json({data: reservation});
}

// Create a new reservation
async function create(req, res){
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({data})
}

// Returns singular reservation by ID
async function read(req, res){
  res.status(200).json({data: res.locals.reservation})
};

// Updates singular reservation by ID
async function update(req, res){
  const data = await reservationsService.update(req.body.data);
  res.json({data})
}

// Sets status of existing reservation
async function setStatus(req, res){
 const updatedReservation = {
  ...req.body.data,
  reservation_id: res.locals.reservation.reservation_id,
 };
 const data = await reservationsService.setStatus(updatedReservation)
  res.status(200).json({data});
}

// Exports for use in reservations router
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    asyncErrorBoundary(validateProperties),
    validateReservationDate,
    validateReservationTime,
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationIdExists), read],
  setStatus: [
    asyncErrorBoundary(reservationIdExists),
    statusNotFinished,
    validStatus,
    asyncErrorBoundary(setStatus),
  ],
  update: [
    asyncErrorBoundary(reservationIdExists),
    hasRequiredProperties,
    asyncErrorBoundary(validateProperties),
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(update),
  ],
};
