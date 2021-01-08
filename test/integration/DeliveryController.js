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
    const users = [mongoose.Types.ObjectId(100).toHexString(), mongoose.Types.ObjectId(200).toHexString()];

    // TODO tests

    beforeAll(() => {
        const controller = new DeliveryController(testURL, utils.mockedRouter());
        app = utils.createExpressApp(controller, testURL);
        return db.setup();
    });

    beforeEach(done => mongoose.connection.dropCollection("deliveries", err => done()));

    afterAll(() => db.close());

});
