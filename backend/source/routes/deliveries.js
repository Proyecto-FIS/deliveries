const express = require("express");
const { validateDeliveryData } = require("../../utils/validators");

const database = require("../database");


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
    console.log(Date() + "-GET /deliveries");
    const deliveryId = req.query.deliveryId;
  
    if (deliveryId) {
      database.db.findOne({ _id: deliveryId }).exec(function (err, delivery) {
        if (delivery) {
          res.send(delivery);
        } else {
          // If no document is found, delivery is null
          res.sendStatus(404);
        }
      });
    } else {
      database.db.find({}).exec(function (err, deliveries) {
        res.send(deliveries);
      });
    }
  };

/**
 * Create a new deliveries when a payment is generated
 * @route POST /deliveries
 * @group Deliveries - Deliveries
 * @param {Delivery} delivery.body.required - New delivery
 * @returns {integer} 200 - Returns the  created delivery
 * @returns {DeliveryError} default - unexpected error
 */
const postMethod = (req, res) => {
    console.log(Date() + "-POST /deliveries");
    const newDelivery = {
      userId: "UUID",
      providerId: "UUID",
      products: req.body.products,
      state: req.body.state,
      paid: req.body.paid,
      createDate: req.body.createDate,
    };
    const { valid, errors } = validateDeliveryData(newDelivery);
    if (!valid) return res.status(400).json(errors);
    database.db.insert(newDelivery, (err) => {
      if (err) {
        console.error(Date() + " - " + err);
        res.send(500);
      } else {
        res.status(201).json(newDelivery);
      }
    });
  };
  


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
  console.log(Date() + "-PUT /deliveries/id");
  const deliveryId = req.query.deliveryId;
  const newDelivery = req.body;

  database.db.findOne({ _id: deliveryId }).exec(function (err, delivery) {
    if (delivery) {
      database.db.update(
        delivery,
        { $set: newDelivery},
        function (err, numReplaced) {
          if (numReplaced === 0) {
            console.error(Date() + " - " + err);
            res.sendStatus(404);
          } else {
            res.status(204).json(newDelivery);
          }
        }
      );
    } else {
      // If no document is found, delivery is null
      res.sendStatus(404);
    }
  });
};


/**
 * Delete an existing delivery
 * @route DELETE /deliveries
 * @group Deliveries - Deliveries
 * @param {string} deliveryId.query.required -  Delivery Id
 * @returns {Delivery} 200 - Returns the current state for this deliveries
 * @returns {DeliveryError} default - unexpected error
 */
const deleteMethod = (req, res) => {
  console.log(Date() + "-DELETE /deliveries/id");
  const deliveryId = req.query.deliveryId;
  database.db.remove({ _id: deliveryId }, {}, function (err, numRemoved) {
    if (numRemoved === 0) {
      console.error(Date() + " - " + err);
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
};

module.exports.register = (apiPrefix, router) => {
  router.get(apiPrefix + "/deliveries", getMethod);
  router.post(apiPrefix + "/deliveries", postMethod);
  router.put(apiPrefix + "/deliveries", putMethod);
  router.delete(apiPrefix + "/deliveries", deleteMethod);
};
