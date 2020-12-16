const express = require("express");
const Delivery = require("../models/delivery");

/**
 * @typedef Delivery
 * @property {integer} _id           - UUID
 * @property {integer} _providerId   - Identifier
 * @property {integer} _userId      - Identifier
 * @property {string}  products   - products
 * @property {integer}     state  - state
 * @property {string}  paid        - paid
 * @property {string}  createDate    - createDate
 */

/**
 * @typedef DeliveryError
 * @property {string} todo.required - TODO
 */


/**
 * Get all deliveries if empty, or selected delivery by _id
 * @route GET /deliveries
 * @group Deliveries - Deliveries
 * @param {string} deliveryId.query -  If empty returns all deliveries
 * @returns {Delivery} 200 - Returns wheter selected delivery or all deliveries
 * @returns {DeliveryError} default - unexpected error
 */
const getMethod = (req, res) => {
  //res.send("Test");

  console.log(Date() + "-GET /deliveries");
  const deliveryId = req.query.deliveryId;

  if (deliveryId) {
    Delivery.findOne({ _id: deliveryId }).exec(function (err, delivery) {
      if (delivery) {
        res.send(delivery);
      } else {
        // If no document is found, product is null
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
 * Create a new deliveries when a payment is generated
 * @route POST /deliveries
 * @group Deliveries - Deliveries
 * @param {Delivery} delivery.body.required - New delivery
 * @returns {integer} 200 - Returns the  created delivery
 * @returns {DeliveryError} default - unexpected error
 */
const postMethod = (req, res) => {
  //res.send("Coffaine - Deliveries microservice");
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
 * @group Deliveries - Deliveries
 * @param {string} deliveryId.query.required -  Delivery Id
 * @param {Delivery.model} delivery.body.required - New value for the delivery
 * @returns {Delivery} 200 - Returns the current state for this deliveries
 * @returns {DeliveryError} default - unexpected error
 */
const putMethod = (req, res) => {
  res.send("Test");
}

/**
 * Delete an existing delivery
 * @route DELETE /deliveries
 * @group Deliveries - Deliveries
 * @param {string} deliveryId.query.required -  Delivery Id
 * @returns {Delivery} 200 - Returns the current state for this deliveries
 * @returns {DeliveryError} default - unexpected error
 */
const deleteMethod = (req, res) => {
  res.send("Test");
}

module.exports.register = (apiPrefix, router) => {
  router.get(apiPrefix + "/deliveries", getMethod);
  router.post(apiPrefix + "/deliveries", postMethod);
  router.put(apiPrefix + "/deliveries", putMethod);
  router.delete(apiPrefix + "/deliveries", deleteMethod);
};
