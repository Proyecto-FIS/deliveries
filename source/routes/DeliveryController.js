const express = require("express");
const DeliveryEntry = require("../models/DeliveryEntry");


class DeliveryController {

    getMethod(req, res) {
        DeliveryEntry.find({
            userId: req.body.userId,
        })
            .lean()
            .exec((err, entries) => {
                if (err) {
                    res.status(500).json({ reason: "Database error" });
                } else {
                    res.status(200).json(entries);
                }
            });
    }

    createEntry(req, res) {
        new DeliveryEntry(req.body)
            .save()
            .then(doc => res.status(200).send(doc._id))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    createEntries(entries) {
        const promises = entries.map(entry => this.createEntry(entry));
        return Promise.all(promises);
    }

    constructor(apiPrefix, router) {
        router.get(apiPrefix + "/delivery", this.getMethod.bind(this));
        router.post(apiPrefix + "/delivery", this.createEntry.bind(this));
    }

}

module.exports = DeliveryController;
