const expressSwagger = require('express-swagger-generator');

module.exports.getBasePath = () => {
    return "/api/v1";
}

module.exports.setupSwagger = (app, port) => {

    const swaggerOptions = {
        swaggerDefinition: {
            info: {
                description: 'This microservice manages deliveries',
                title: 'Coffaine - Deliveries microservice API',
                version: '1.0.0',
            },
            host: process.env.HOSTNAME || ('localhost:' + port),
            basePath: this.getBasePath(),
            produces: [
                "application/json",
            ],
            schemes: [process.env.SWAGGER_SCHEMA],
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    description: "TODO",
                }
            }
        },
        basedir: __dirname,
        files: ['./routes/**/*.js']
    };

    expressSwagger(app)(swaggerOptions);
}
