# Coffaine - Deliveries microservice

To run the backend, you must create these environment files in the backend/env folder:
- devel.env for the environment variables in development environment
- prod.env for the environment variables in production environment
- test.env for the environment variables in testing environment

Environment variables:
- NODE_ENV: development, test or production
- PORT: port to attach to the server. In production environment, this one is provided by Heroku
- DBSTRING: database connection string. Example: mongodb://localhost:27017/coffaine-sales
- HOSTNAME: only needed in production environment. It shouldn't be set in any other one
- SWAGGER_SCHEMA: http or https. It is used for Swagger "Try it" operations
- USERS_MS: URL pointing to the users microservice (including /api/version)
- TEST_USERNAME: Test username (only in test environment)
- TEST_PASSWORD: Test user password (only in test environment)

## API URL
[Coffaine Deliveries](https://coffaine-deliveries.herokuapp.com/)

## API Documentation
[Swagger doc](https://coffaine-deliveries.herokuapp.com/api-docs/)