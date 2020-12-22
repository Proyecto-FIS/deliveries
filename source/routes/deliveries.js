const express = require("express");
const Delivery = require("../models/delivery");

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
  console.log(Date() + "-GET /deliveries");
  const deliveryId = req.query.deliveryId;

  if (deliveryId) {
    Delivery.findOne({ _id: deliveryId }).exec(function (err, delivery) {
      if (delivery) {
        res.send(delivery);
      } else {
        // If no document is found, delivery is null
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
  console.log(Date() + "-POST /deliveries");
  const newDelivery = {
    name: req.body.name,
    description: req.body.description,
    origin: req.body.origin,
    destination: req.body.destination
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

  Product.findOne({ _id: req.query.deliveryId }).exec(function (err, delivery) {
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
      // If no document is found, product is null
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
  Delivery.remove({ _id: req.query.deliveryId }, {}, function (err, numRemoved) {
    if (numRemoved === 0) {
      console.error(Date() + " - " + err);
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
}

module.exports.register = (apiPrefix, router) => {
  router.get(apiPrefix + "/deliveries", getMethod);
  router.post(apiPrefix + "/deliveries", postMethod);
  router.put(apiPrefix + "/deliveries", putMethod);
  router.delete(apiPrefix + "/deliveries", deleteMethod);
};
