const express = require("express");
const DeliveryEntry = require("../models/DeliveryEntry");


class DeliveryController {

    getMethod(req, res) {

        console.log(Date() + "-GET /deliveries");

        DeliveryEntry.find({
            userId: req.query.userId,
        })
            .select("-userId")
            .lean()
            .exec((err, entries) => {
                if (err) {
                    res.status(500).json({ reason: "Database error" });
                } else {
                    res.status(200).json(entries);
                }
            });
    }

    postMethod(req, res) {

        console.log(Date() + "-POST /deliveries");

        delete req.body.delivery._id;
        req.body.delivery.userId = req.query.userId;
        new DeliveryEntry(req.body.delivery)
            .save()
            .then(doc => res.status(200).send(doc._id))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    putMethod(req, res) {

        console.log(Date() + "-PUT /deliveries");

        DeliveryEntry.findOneAndUpdate({ _id: req.body.delivery._id, userID: req.query.userId }, req.body.delivery)
            .then(doc => {
                if (doc) {
                    return DeliveryEntry.findById(doc._id);
                } else {
                    res.sendStatus(401);
                }
            })
            .then(doc => res.status(200).json(doc))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    deleteMethod(req, res) {

        console.log(Date() + "-DELETE /deliveries");

        DeliveryEntry.findOneAndDelete({ _id: req.query.deliveryId })
            .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    constructor(apiPrefix, router) {
        router.get(apiPrefix + "/delivery", this.getMethod.bind(this));
        router.post(apiPrefix + "/delivery", this.postMethod.bind(this));
        router.put(apiPrefix + "/delivery", this.putMethod.bind(this));
        router.delete(apiPrefix + "/delivery", this.deleteMethod.bind(this));
    }

}

module.exports = DeliveryController;
