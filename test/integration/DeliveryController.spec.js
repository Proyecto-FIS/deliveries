const DatabaseConnection = require("../../source/DatabaseConnection");
const DeliveryController = require("../../source/routes/DeliveryController");
const mongoose = require("mongoose");
const utils = require("../utils");
const request = require("supertest");

describe("DeliveryController", () => {

    const testURL = "/deliveries";
    const db = new DatabaseConnection();
    let app;

    // Preload data
    const users = [
        mongoose.Types.ObjectId(100).toHexString(),
        mongoose.Types.ObjectId(200).toHexString()
    ];

    const preload = [
        {
            paymentId: "01abcdefghijklmnopqrst01",
            providerId: "01tsrqponmlkjihgfedcba01",
            userId: "01abcdefghijkihgfedcba01",
            comments: "comments01",
            statusType: "started",
            createdDate: "01/01/2021 00:00",
            deliveryDate: "05/01/2021 00:00",
            completedDate: "",
            name: "name01",
            surname: "surname01",
            address: "address01",
            city: "city01",
            province: "province01",
            country: "country01",
            zipCode: 12345,
            phoneNumber: 123456789,
            email: "email01@email01.com"
        },
        {
            paymentId: "02abcdefghijklmnopqrst02",
            providerId: "02tsrqponmlkjihgfedcba02",
            userId: "02abcdefghijkihgfedcba02",
            comments: "comments02",
            statusType: "prepared",
            createdDate: "01/01/2021 00:00",
            deliveryDate: "05/01/2021 00:00",
            completedDate: "",
            name: "name02",
            surname: "surname02",
            address: "address02",
            city: "city02",
            province: "province02",
            country: "country02",
            zipCode: 54321,
            phoneNumber: 987654321,
            email: "email02@email02.com"
        },
        {
            paymentId: "03abcdefghijklmnopqrst03",
            providerId: "03tsrqponmlkjihgfedcba03",
            userId: "03abcdefghijkihgfedcba03",
            comments: "comments03",
            statusType: "completed",
            createdDate: "01/01/2021 00:00",
            deliveryDate: "05/01/2021 00:00",
            completedDate: "05/01/2021 00:00",
            name: "name03",
            surname: "surname03",
            address: "address03",
            city: "city03",
            province: "province03",
            country: "country03",
            zipCode: 54321,
            phoneNumber: 987654321,
            email: "email03@email03.com"
        },
    ];

    beforeAll(() => {
        const controller = new DeliveryController(testURL, utils.mockedRouter());
        app = utils.createExpressApp(controller, testURL);
        return db.setup();
    });

    beforeEach(done => mongoose.connection.dropCollection("deliveries", err => done()));

    afterAll(() => db.close());

    test("Should return empty", () => {
        return request(app)
            .get(testURL)
            .query({
                userId: mongoose.Types.ObjectId().toHexString()
            })
            .expect(200, []);
    });

    test("Missing fields in write", () => {
        return request(app)
            .post(testURL)
            .query({ userId: mongoose.Types.ObjectId().toHexString() })
            .send({
                profile: {
                    name: "name",
                    surname: "surname",
                    address: "address"
                    // Missing fields
                }
            })
            .expect(500, { reason: "Database error" });
    });
});
