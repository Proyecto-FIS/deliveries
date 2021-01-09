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
        console.log(req.body);

        const newDelivery = new Delivery(req.body);

        newDelivery
            .save()
            .then(doc => res.status(200).send(doc._id))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
    }

    putMethod(req, res) {

        console.log(Date() + "-PUT /deliveries");
        console.log(req.body);

        Delivery.findOneAndUpdate({ _id: req.body._id }, req.body, {
            new: true
        }).then(doc => doc ? res.status(200).json(doc): res.sendStatus(401))
          .catch(err => res.status(500).json({ reason: "Database error", details: err }));
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
