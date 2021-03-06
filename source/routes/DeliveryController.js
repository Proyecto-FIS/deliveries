const express = require("express");
const Delivery = require("../models/delivery");
const AuthorizeJWT = require("../middlewares/AuthorizeJWT");
const Validators = require("../middlewares/Validators");
const axios = require("axios");
const { response } = require("express");
const createCircuitBreaker = require("../CircuitBreaker").createCircuitBreaker;

const productsService = createCircuitBreaker({
    name: "productsService",
    errorThreshold: 20,
    timeout: 8000,
    healthRequests: 5,
    sleepTimeMS: 100,
    maxRequests: 0,
    errorHandler: (err) => false,
    request: (identifiers) => axios.get(`${process.env.PRODUCTS_MS}/products-several`, { params: { identifiers } }),
    fallback: (err, args) => {
        if (err && err.isAxiosError) throw err;
        throw ({
            response: {
                status: 503
            }
        });
    }
});


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

        const userId = req.query.userId || req.body.userId;

        console.log("userId= " + userId);

        Delivery.find({ $or: [{ userId: userId }, { providerId: userId }] })
            .select()
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
            surname: req.body.profile.surname,
            address: req.body.profile.address,
            city: req.body.profile.city,
            province: req.body.profile.province,
            country: req.body.profile.country,
            zipCode: req.body.profile.zipCode,
            phoneNumber: req.body.profile.phoneNumber,
            email: req.body.profile.email,
            statusType: "INICIADO"
        };

        let identifiers = req.body.products.reduce((acc, current) => acc.concat(current._id + ","), "");
        identifiers = identifiers.substring(0, identifiers.length - 1);
        console.log(identifiers);

        const deliveryDetails = productsService.execute(identifiers)
            .then(response => response.data.reduce((acc, product) => {
                const productPaid = req.body.products.find(p => p._id === product._id);
                productPaid.name = product.name;
                productPaid.description = product.description;
                console.log("Producto adquirido: " + Object.values(productPaid));
                const repeatIndex = acc.findIndex(p => p.providerId === product.providerId);
                if (repeatIndex != -1) {
                    console.log("ProviderId detected");
                    acc[repeatIndex].products.push(productPaid);
                    return acc;
                } else {
                    const delivery = {
                        providerId: product.providerId,
                        products: [productPaid]
                    }
                    acc.push(delivery);
                    return acc;
                }
            }, []))
            .then(response => response.map(delivery => {
                console.log(response);
                data.providerId = delivery.providerId;
                data.products = delivery.products;
                const newDelivery = new Delivery(data);
                newDelivery.save();
                console.log(newDelivery);
                return newDelivery._id
            }
            ))
            .then(doc => res.status(200).send(doc))
            .catch(err => res.status(500).json({ reason: "Database error" }));

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
        router.post(apiPrefix + "/deliveries", ...userTokenValidators, Validators.Required("profile"), Validators.Required("historyId"), this.postMethod.bind(this));
        router.put(apiPrefix + "/deliveries", ...userTokenValidators, Validators.Required("delivery"), this.putMethod.bind(this));
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
 * @property {string}  surname       - Receiver surnames
 * @property {string}  address       - Receiver address
 * @property {string}  city          - Receiver city
 * @property {string}  province      - Receiver province
 * @property {string}  country       - Receiver country
 * @property {integer}  zipCode      - Receiver zipCode
 * @property {integer}  phoneNumber  - Receiver phone number
 * @property {string}  email         - Receiver email
 * @property {Array.<ProductDelivery>} products - Product cart to delivery by provider
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


/**
* @typedef ProductDelivery
* @property {string} _id               - Product identifier
* @property {string} name              - Name product of the provider
* @property {string} description       - Description product of the provider
* @property {number} quantity          - Number of products of this type
* @property {number} unitPriceEuros    - Price per unit, in euros
*/