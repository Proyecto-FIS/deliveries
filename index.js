var express = require('express');
var bodyParser = require('body-parser');
var dataStore = require('nedb');

const app = express();
const expressSwagger = require('express-swagger-generator')(app);

var port = (process.env.PORT || 3000);
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname + "/contacts.json";

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: BASE_API_PATH,
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
		securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname, //app absolute path
    files: ['*.js'] //Path to the API handle folder
};


console.log("Starting API server...")

app.use(bodyParser.json());

var db = new dataStore({
    filename: DB_FILE_NAME,
    autoload: true
})

app.get("/", (req, res) => {
    res.send ("<html><body><h1>My server</h1></body></html>");
});

app.get(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + "- GET /contacts");
    db.find({}, (err,contacts) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            }));
        }
    })
});

app.post(BASE_API_PATH + "/contacts", (req, res) => {
    console.log(Date() + "- POST /contacts");
    var contact = req.body;
    db.insert(contact, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
    
});

/**
 * Get all deliveries if empty, or selected delivery by _id
 * @route GET /deliveries
 * @group Deliveries - Deliveries
 * @param {string} deliveryId.query -  If empty returns all deliveries
 * @returns {Delivery} 200 - Returns wheter selected delivery or all products
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
 * Create a new deliveries when a payment is generated
 * @route POST /deliveries
 * @group Deliveries - Deliveries
 * @param {Delivery} delivery.body.required - New delivery
 * @returns {integer} 200 - Returns the  created delivery
 * @returns {DeliveriesError} default - unexpected error
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
 * @route PUT /delivery
 * @group delivery - Product delivery
 * @param {Delivery} delivery.body.required - Delivery to be updated
 * @returns {Delivery} 200 - Returns the updated delivery
 * @returns {DeliveryError} default - unexpected error
 */

 /**
 * Cancel an existing delivery
 * @route DELETE /delivery
 * @group delivery - Product delivery
 * @param {Delivery} delivery.body.required - Delivery requested
 * @returns {Delivery} 200 - Returns the requested delivery for this user
 * @returns {DeliveryError} default - unexpected error
 */

 /**
 * Get all deliveries for an user
 * @route GET /delivery
 * @group delivery - Customer delivery
 * @param {Customer} customer.body.required - Deliveries requested
 * @returns {Delivery} 200 - Returns the requested delivery for this user
 * @returns {DeliveryError} default - unexpected error
 */

 /**
 * Update an existing delivery from a toaster
 * @route PUT /delivery
 * @group toaster - Toaster delivery
 * @param {Product} product.body.required - Product to be updated
 * @param {Toaster} toaster.body.required - Toaster delivery
 * @returns {Delivery} 200 - Returns the updated delivery
 * @returns {DeliveryError} default - unexpected error
 */

 /**
 * Return an existing product from a delivery
 * @route PUT /delivery
 * @group return - Customer return
 * @param {Delivery} delivery.body.required - Delivery to be updated
 * @param {Product} customer.body.required - Product delivery
 * @returns {Delivery} 200 - Returns the updated delivery
 * @returns {DeliveryError} default - unexpected error
 */

expressSwagger(options);
app.listen(port);
console.log("Server ready!");