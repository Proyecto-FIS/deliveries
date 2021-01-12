const express = require("express");
const Delivery = require("../models/deliveryModel");
 



const getMethod = (req, res) => {
  console.log(Date() + "-GET /delivery");
  const deliveryId = req.query.deliveryId;

  if (deliveryId) {
    Delivery.findOne({ _id: deliveryId }).exec(function (err, delivery) {
      if (delivery) {
        res.send(delivery);
      } else {
        res.sendStatus(404);
      }
    });
  } else {
    Delivery.find({}).exec(function (err, deliveries) {
      res.send(deliveries);
    });
  }

}


const postMethod = (req, res) => {
  console.log(Date() + "-POST /delivery");
  const newDelivery = {
    paymentId: req.body.paymentId,
    userId: req.body.userId,
    comments: req.body.comments,
    createdDate: req.body.createdDate,
    completedDate: req.body.completedDate,
    deliveryDate: req.body.deliveryDate,
    cancelledDate: req.body.cancelledDate,
    name: req.body.name,
    surname: req.body.surname,
    address: req.body.address,
    city: req.body.city,
    province: req.body.province,
    country: req.body.country,
    zipCode: req.body.zipCode,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    statusType: req.body.statusType
  };

  Delivery.create(newDelivery, (err) => {
    if (err) {
      console.error(Date() + " - " + err);
      res.sendStatus(500);
    } else {
      res.status(201).json(newDelivery);
    }
  });
}


const putMethod = (req, res) => {
  console.log(Date() + "-PUT /delivery/id");
  delete req.body.delivery._id;

  Delivery.findOne({ _id: req.query.deliveryId }).exec(function (err, delivery) {
    if (delivery) {
      Delivery.update(
        delivery,
        { $set: req.body.delivery },
        function (err, numReplaced) {
          if (numReplaced === 0) {
            console.error(Date() + " - " + err);
            res.sendStatus(404);
          } else {
            res.status(204).json(req.body.delivery);
          }
        }
      );
    } else {
      res.sendStatus(404);
    }
  });
}


const deleteMethod = (req, res) => {
  console.log(Date() + "-DELETE /delivery/id");
  Delivery.findOneAndDelete({ _id: req.query.deliverId })
    .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
    .catch(err => res.status(500).json({ reason: "Database error" }));
}

module.exports.register = (apiPrefix, router) => {
  router.get(apiPrefix + "/delivery", getMethod);
  router.post(apiPrefix + "/delivery", postMethod);
  router.put(apiPrefix + "/delivery", putMethod);
  router.delete(apiPrefix + "/delivery", deleteMethod);
};


