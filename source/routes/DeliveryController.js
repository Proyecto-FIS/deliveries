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
                    res.status(500).json({ reason: "Database error", details: err  });
                } else {
                    res.status(200).json(entries);
                }
            });
    }

    postMethod(req, res) {

        console.log(Date() + "-POST /deliveries");
        console.log(req.body);

        const data = {
            paymentId: req.body.historyId,
            userId: req.body.userId,
            comments: req.body.comments,
            createdDate: Date(),
            completedDate: req.body.completedDate,
            deliveryDate: Date(),
            cancelledDate: req.body.cancelledDate,
            name: req.body.profile.name,
            surnames: req.body.profile.surnames,
            address: req.body.profile.address,
            city: req.body.profile.city,
            province: req.body.profile.province,
            country: req.body.profile.country,
            zipCode: req.body.profile.zipCode,
            phoneNumber: req.body.profile.phoneNumber,
            email: req.body.profile.email,
            statusType: "started"
          };

        const newDelivery = new Delivery(data);

        newDelivery
            .save()
            .then(doc => res.status(200).send(doc._id))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
    }

    putMethod(req, res) {

        console.log(Date() + "-PUT /deliveries");
        console.log(req.body.delivery);

        Delivery.findOneAndUpdate({ _id: req.body.delivery._id }, req.body.delivery, { new: true })
            .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
    }

    deleteMethod(req, res) {

        console.log(Date() + "-DELETE /deliveries");
        console.log(req.body);

        Delivery.findOneAndDelete({ _id: req.query.deliveryId })
            .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
    }

    constructor(apiPrefix, router) {

        const userTokenValidators = [Validators.Required("userToken"), AuthorizeJWT];

        router.get(apiPrefix + "/deliveries", ...userTokenValidators, this.getMethod.bind(this));
        router.post(apiPrefix + "/deliveries", this.postMethod.bind(this));
        router.put(apiPrefix + "/deliveries", ...userTokenValidators, this.putMethod.bind(this));
        router.delete(apiPrefix + "/deliveries", ...userTokenValidators, this.deleteMethod.bind(this));

    }

}

module.exports = DeliveryController;
