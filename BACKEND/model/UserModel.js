const { model, models } = require("mongoose");
const UserSchema = require("../schemas/UserSchema");

module.exports = models.User || model("User", UserSchema);