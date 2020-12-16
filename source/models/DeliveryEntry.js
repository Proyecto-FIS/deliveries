const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    _id: Schema.ObjectId,
    quantity: Number,
    unitPriceEuros: Number
});

const DeliveryEntrySchema = new Schema({
    userID: Schema.ObjectId,
    timestamp: {
        type: Date,
        default: Date.now
    },
    operationType: String,
    delivers: [DeliverySchema],
});

module.exports = mongoose.model("DeliverEntry", DeliveryEntrySchema);