// const {model} = require('mongoose');
// const HoldingsSchema = require('../schemas/HoldingsSchema'); 
// const HoldingsModel = model('Holding', HoldingsSchema);
// module.exports = HoldingsModel;
const { model, models } = require("mongoose");
const HoldingsSchema = require("../schemas/HoldingsSchema");

module.exports = models.Holding || model("Holding", HoldingsSchema);