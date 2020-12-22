const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    paymentId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    comments: String,
    createdDate: String,
    completedDate: String,
    deliveryDate: String,
    cancelledDate: String,
    name: String,
    surnames: String,
    address: String,
    city: String,
    province: String,
    country: String,
    zipCode: Number,
    phoneNumber: Number,
    email: String,
    statusType: {
        type: String,
        enum: ["started", "prepared","delayed","cancelled","completed"],
    }
    });

module.exports = mongoose.model("DeliveryEntry", DeliverySchema);