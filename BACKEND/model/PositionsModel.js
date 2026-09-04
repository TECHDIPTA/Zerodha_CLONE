const { model, models } = require("mongoose");
const PositionsSchema = require("../schemas/PositionsSchema");

module.exports = models.Position || model("Position", PositionsSchema);