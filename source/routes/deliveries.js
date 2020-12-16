const express = require("express");

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
  res.send("Test");
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
  res.send("Coffaine - Deliveries microservice");
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
