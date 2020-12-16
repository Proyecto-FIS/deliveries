const express = require("express");
const DeliveryEntry = require("../models/DeliveryEntry");


class DeliveryController {

    getMethod(req, res) {
        DeliveryEntry.find({
            userID: req.body.userID,
            timestamp: { $lte: req.body.beforeTimestamp }
        })
        .select("timestamp operationType products")
        .limit(req.body.pageSize)
        .sort("-timestamp")
        .lean()
        .exec((err, entries) => {
            if(err) {
                res.status(500).json({ reason: "Database error" });
            } else {
                res.status(200).json(entries);
            }
        });
    }

    createEntry(entry) {
        const deliveryEntry = new DeliveryEntry(entry);
        return deliveryEntry.save();
    }

    createEntries(entries) {
        const promises = entries.map(entry => this.createEntry(entry));
        return Promise.all(promises);
    }

    constructor(apiPrefix, router) {
        router.get(apiPrefix + "/delivery", this.getMethod.bind(this));
    }

}

module.exports = DeliveryController;
