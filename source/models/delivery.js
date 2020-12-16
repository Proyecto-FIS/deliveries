const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    name: String,
    description: String,
    origin: String,
    destination: String
});

module.exports = mongoose.model("Delivery", DeliverySchema);