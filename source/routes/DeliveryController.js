const express = require("express");
const Delivery = require("../models/Delivery");
const AuthorizeJWT = require("../middlewares/AuthorizeJWT");
const Validators = require("../middlewares/Validators");


class DeliveryController {

    getMethod(req, res) {

        console.log(Date() + "-GET /deliveries");

        Delivery.find({
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

        const newDelivery = new Delivery(req.body);

        newDelivery
            .save()
            .then(doc => res.status(200).send(doc._id))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
    }

    putMethod(req, res) {

        console.log(Date() + "-PUT /deliveries");

        Delivery.findOneAndUpdate({ _id: req.body.delivery._id, userID: req.query.userId }, req.body.delivery)
            .then(doc => {
                if (doc) {
                    return Delivery.findById(doc._id);
                } else {
                    res.sendStatus(401);
                }
            })
            .then(doc => res.status(200).json(doc))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    deleteMethod(req, res) {

        console.log(Date() + "-DELETE /deliveries");

        Delivery.findOneAndDelete({ _id: req.query.deliveryId })
            .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
            .catch(err => res.status(500).json({ reason: "Database error" }));
    }

    constructor(apiPrefix, router) {

        const userTokenValidators = [Validators.Required("userToken"), AuthorizeJWT];

        router.get(apiPrefix + "/deliveries", ...userTokenValidators, this.getMethod.bind(this));
        router.post(apiPrefix + "/deliveries", ...userTokenValidators, this.postMethod.bind(this));
        router.put(apiPrefix + "/deliveries", ...userTokenValidators, this.putMethod.bind(this));
        router.delete(apiPrefix + "/deliveries", ...userTokenValidators, this.deleteMethod.bind(this));

    }

}

module.exports = DeliveryController;
