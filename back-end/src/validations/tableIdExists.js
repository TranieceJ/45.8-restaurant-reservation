const service = require("../tables/tables.service");

async function tableIdExists(req, res, next) {
  const tables = await service.read(req.params.table_id);

  if (tables) {
    res.locals.tables = tables;
    return next();
  }
  return next({ status: 404, message: `${req.params.table_id} not found` });
}

module.exports = tableIdExists;