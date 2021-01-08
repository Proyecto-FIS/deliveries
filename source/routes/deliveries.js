const express = require("express");
const Delivery = require("../models/deliveryModel");

/**
 * @typedef Delivery
 * @property {integer} _id           - UUID
 * @property {integer} _paymentId    - Payment identifier
 * @property {integer} _userId       - User identifier
 * @property {string}  comments      - Additonal notes for delivering
 * @property {string}  statusType    - Delivery status {STARTED, PREPARED, DELAYED, CANCELLED, COMPLETED}
 * @property {string}  createdDate   - Delivery date started
 * @property {string}  completedDate - Delivery date completed
 * @property {string}  cancelledDate - Delivery date cancelled
 * @property {string}  deliveryDate  - Estimated delivery date
 * @property {string}  name          - Receiver name
 * @property {string}  surnames      - Receiver surnames
 * @property {string}  address       - Receiver address
 * @property {string}  city          - Receiver city
 * @property {string}  province      - Receiver province
 * @property {string}  country       - Receiver country
 * @property {integer}  zipCode      - Receiver zipCode
 * @property {integer}  phoneNumber  - Receiver phone number
 * @property {string}  email         - Receiver email
 */


/**
 * Get all deliveries if empty, or selected delivery by _id
 * @route GET /deliveries
 * @group Deliveries - Deliveries per user
 * @param   {Delivery.model} delivery.body.required -  If empty returns all deliveries
 * @returns {Delivery}              200 - Returns wheter selected delivery or all deliveries
 * @returns {ValidationError}       400 - Supplied parameters are invalid
 * @returns {UserAuthError}         401 - User is not authorized to perform this operation
 * @returns {DatabaseError}         500 - Database error
 * @returns {DeliveryError}         default - unexpected error
 */
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

/**
 * Create a new delivery when a payment is completed
 * @route POST /deliveries
 * @group Deliveries - Deliveries per user
 * @param {Delivery} delivery.body.required - New delivery
 * @returns {integer} 200 - Returns the created delivery
 * @returns {ValidationError}       400 - Supplied parameters are invalid
 * @returns {UserAuthError}         401 - User is not authorized to perform this operation
 * @returns {DatabaseError}         500 - Database error
 * @returns {DeliveryError} default - unexpected error
 */
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
    surnames: req.body.surnames,
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

/**
 * Update an existing delivery
 * @route PUT /deliveries
 * @group Deliveries - Deliveries per user
 * @param {Delivery.model} delivery.body.required - New value for the delivery
 * @returns {Delivery}              200 - Returns the current state for this delivery
 * @returns {ValidationError}       400 - Supplied parameters are invalid
 * @returns {UserAuthError}         401 - User is not authorized to perform this operation
 * @returns {DatabaseError}         500 - Database error
 * @returns {DeliveryError} default - unexpected error
 */
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

/**
 * Delete an existing delivery
 * @route DELETE /deliveries
 * @group Deliveries - Deliveries per user
 * @param {string} deliveryId.query.required -  Delivery Id
 * @returns {Delivery}              200 - Returns the current state for this delivery
 * @returns {ValidationError}       400 - Supplied parameters are invalid
 * @returns {UserAuthError}         401 - User is not authorized to perform this operation
 * @returns {DatabaseError}         500 - Database error
 * @returns {DeliveryError} default - unexpected error
 */
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
