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
 * Get delivery for an user
 * @route GET /delivery
 * @group delivery - Product delivery
 * @param {Delivery} delivery.body.required - Delivery requested
 * @returns {Delivery} 200 - Returns the requested delivery for this user
 * @returns {DeliveryError} default - unexpected error
 */

 /**
 * Create a new delivery for an user
 * @route POST /delivery
 * @group delivery - Product delivery
 * @returns {integer} 200 - Returns delivery id 
 * @returns {DeliveryError} default - unexpected error
 */

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