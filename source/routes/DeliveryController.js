const express = require("express");
const Delivery = require("../models/Delivery");
const AuthorizeJWT = require("../middlewares/AuthorizeJWT");
const Validators = require("../middlewares/Validators");


class DeliveryController {


    /**
     * Get all deliveries if empty, or selected delivery by _id
     * @route GET /deliveries
     * @group Deliveries - Deliveries per user
     * @param {string}  userToken.query.required  - User JWT token
     * @returns {Delivery}              200 - Returns wheter selected delivery or all deliveries
     * @returns {ValidationError}       400 - Supplied parameters are invalid
     * @returns {UserAuthError}         401 - User is not authorized to perform this operation
     * @returns {DatabaseError}         500 - Database error
     * @returns {DeliveryError}         default - unexpected error
     */

    getMethod(req, res) {

        console.log(Date() + "-GET /deliveries");

        Delivery.find({
            userId: req.query.userId,
        })
            .select("-userId")
            .lean()
            .exec((err, entries) => {
                if (err) {
                    res.status(500).json({ reason: "Database error", details: err });
                } else {
                    res.status(200).json(entries);
                }
            });
    }


    /**
     * Create a new delivery when a payment is completed
     * @route POST /deliveries
     * @group Deliveries - Deliveries per user
     * @param {string}  userToken.query.required - User JWT token
     * @param {DeliveryPost.model} delivery.body.required - User profile
     * @returns {integer} 200 - Returns identifier of the created delivery 
     * @returns {ValidationError}       400 - Supplied parameters are invalid
     * @returns {UserAuthError}         401 - User is not authorized to perform this operation
     * @returns {DatabaseError}         500 - Database error
     * @returns {DeliveryError} default - unexpected error
     */

    postMethod(req, res) {

        console.log(Date() + "-POST /deliveries");
        console.log(req.body);

        const data = {
            paymentId: req.body.historyId,
            userId: req.body.userId || req.query.userId,
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

    putMethod(req, res) {

        console.log(Date() + "-PUT /deliveries");
        console.log(req.body.delivery);

        Delivery.findOneAndUpdate({ _id: req.body.delivery._id }, req.body.delivery, { new: true })
            .then(doc => doc ? res.status(200).json(doc) : res.sendStatus(401))
            .catch(err => res.status(500).json({ reason: "Database error", details: err }));
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
        router.post(apiPrefix + "/deliveries", ...userTokenValidators, this.postMethod.bind(this));
        router.put(apiPrefix + "/deliveries", ...userTokenValidators, this.putMethod.bind(this));
        router.delete(apiPrefix + "/deliveries", ...userTokenValidators, this.deleteMethod.bind(this));

    }

}

module.exports = DeliveryController;

/**
 * @typedef Delivery
 * @property {integer} _id           - UUID
 * @property {integer} _paymentId    - Payment identifier
 * @property {integer} _userId       - User identifier
 * @property {integer} _providerId   - Provider identifier
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
 * @typedef DeliveryPost
 * @property {string}  historyId.body.required - History entry payment
 * @property {string}  comments.body.required - Additonal notes for delivering
 * @property {BillingProfile.model} profile - Billing profile for delivery
 * @property {Array.<Product>} products products - Product cart to delivery
 */

/**
* @typedef BillingProfile
* @property {string} _id                   - Unique identifier (ignored in POST requests due to id collision)
* @property {string} name.required         - Receiver name
* @property {string} surname.required      - Receiver surname
* @property {string} address.required      - Address
* @property {string} city.required         - City
* @property {string} province.required     - Province or state
* @property {string} country.required      - Country
* @property {integer} zipCode.required     - Zip code
* @property {integer} phoneNumber.required - Phone number
* @property {string} email.required        - Receiver email
*/

/**
* @typedef Product
* @property {string} _id               - Product identifier
* @property {number} quantity          - Number of products of this type
* @property {number} unitPriceEuros    - Price per unit, in euros
*/
