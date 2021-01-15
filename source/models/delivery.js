const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
    paymentId: Schema.Types.ObjectId,
    providerId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    comments: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: 500,
    },
    createdDate: {
        type: Date,
        default: Date.now
    }, 
    completedDate: Date,
    deliveryDate: Date,
    cancelledDate: Date,
    name: {
        type: String,
        required: [true, "A receiver name is required"],
        minlength: 1,
        maxlength: 50,
    },
    surname: {
        type: String,
        required: [true, "A receiver surnames is required"],
        minlength: 1,
        maxlength: 100
    },
    address: {
        type: String,
        required: [true, "A delivery address is required"],
        minlength: 1,
        maxlength: 150
    },
    city: {
        type: String,
        required: [true, "A delivery city is required"],
        minlength: 1,
        maxlength: 100
    },
    province: {
        type: String,
        required: [true, "A delivery province is required"],
        minlength: 1,
        maxlength: 100
    },
    country: {
        type: String,
        required: [true, "A delivery city is required"],
        minlength: 1,
        maxlength: 100
    },
    zipCode: {
        type: Number,
        required: [true, "A delivery zipCode is required"],
        validate: {
            validator: v => Number.isInteger(v) && /^([0-9]{5}$)/.test(v)
        }
    },
    phoneNumber: {
        type: Number,
        required: [true, "A receiver phone number is required"],
        validate: /^([0-9]{1,15}$)/
    },
    email: {
        type: String,
        required: [true, "A receiver phone number is required"],
        validate: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    },
    statusType: {
        type: String,
        required: true,
        enum: ["started", "prepared", "delayed", "cancelled", "completed"],
    }
    });

module.exports = mongoose.model("Delivery", DeliverySchema);