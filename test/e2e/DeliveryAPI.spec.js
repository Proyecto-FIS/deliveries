const Delivery = require("../../source/models/delivery");
const utils = require("../utils");
const makeRequest = utils.makeRequest;
const mongoose = require("mongoose");
const { response } = require("express");

describe("Delivery API", () => {

    const testURL = "/api/v1/deliveries";
    let userToken, userId;

    beforeAll(async () => {
        const user = await utils.authTestUser();
        userToken = user.userToken;
        userId = user.userId;
    });

    beforeEach(done => mongoose.connection.dropCollection("deliveries", err => done()));

    test("Unauthorized in GET", () => {
        return makeRequest()
            .get(testURL)
            .query({
                userToken: "Wrongtoken123",
            })
            .expect(401, { reason: "Authentication failed" });
    });

    test("Unauthorized in POST", () => {
        return makeRequest()
            .post(testURL)
            .query({
                userToken: "Wrongtoken123",
            })
            .expect(401, { reason: "Authentication failed" });
    });

    test("Unauthorized in PUT", () => {
        return makeRequest()
            .put(testURL)
            .query({
                userToken: "Wrongtoken123",
            })
            .expect(401, { reason: "Authentication failed" });
    });

    test("Unauthorized in DELETE", () => {
        return makeRequest()
            .delete(testURL)
            .query({
                userToken: "Wrongtoken123",
            })
            .expect(401, { reason: "Authentication failed" });
    });

    test("Missing delivery in POST", () => {
        return makeRequest()
            .post(testURL)
            .query({ userToken })
            .expect(400, { reason: "Missing fields" });
    });

    test("Missing delivery in PUT", () => {
        return makeRequest()
            .put(testURL)
            .query({ userToken })
            .expect(400, { reason: "Missing fields" });
    });

    test("Correct CRUD", () => {

        const sampleDelivery = {
            paymentId: "01abcdefghijklmnopqrst01",
            providerId: "01tsrqponmlkjihgfedcba01",
            userId: "01abcdefghijkihgfedcba01",
            comments: "comments01",
            statusType: "started",
            createdDate: "01/01/2021 00:00",
            deliveryDate: "05/01/2021 00:00",
            name: "name01",
            surname: "surname01",
            address: "address01",
            city: "city01",
            province: "province01",
            country: "country01",
            zipCode: 12345,
            phoneNumber: 123456789,
            email: "email01@email01.com",
            products: [{
                _id: "6008651b493ac40012e565e7",
                quantity: 2,
                unitPriceEuros: 20
            }]
        };

        const sampleProfile = {
            name: "name01",
            surname: "surname01",
            address: "address01",
            city: "city01",
            province: "province01",
            country: "country01",
            zipCode: 12345,
            phoneNumber: 123456789,
            email: "email01@email01.com"
        };

        const sampleProducts = [{
            _id: "6008651b493ac40012e565e7",
            quantity: 2,
            unitPriceEuros: 20
        }]

        const updatedZip = 44444;
        let deliveryId;

        return makeRequest()
            .post(testURL)
            .query({ userToken })
            .send({ profile: sampleProfile, products: sampleProducts, historyId: sampleDelivery.paymentId })
            .expect(200)
            .then(response => {
                expect(mongoose.Types.ObjectId.isValid(response.body));
                return makeRequest()
                    .get(testURL)
                    .query({ userToken })
                    .expect(200);
            })
    });
});