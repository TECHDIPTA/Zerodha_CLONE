const { model, models } = require("mongoose");
const OrdersSchema = require("../schemas/OrdersSchema");

module.exports = models.Order || model("Order", OrdersSchema);