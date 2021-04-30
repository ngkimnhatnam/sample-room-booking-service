# Room Booking Service

---

## Introduction

The Room Service backend API is an example implementation of a simple room booking system, in which users can browse and pay for bookings to available rooms. Admin endpoints are also available so that new rooms can be added, updated, deleted per need.

## Trying out with Room Booking API

The server is live at http://3.208.20.48:3000/, and API docs resides at url http://3.208.20.48:3000/api-docs/.
To simplify the process, the service does not have a running frontend to interact. On top of that, new users created will not be able to book a room since payment will most definitely fail. You can use the following test credentials to try out the API, in which profile has already been configured to have a test card for payment.

```bash
 - username: random@mail.com
 - password: randomPass
```

After logging in, you will need to use the access token in response body for subsequent request authorization headers as Bearer ${token} to access specific private routes if using Postman.

## Project development documentation

- [Application functionalities](docs/functionality.md)
- [Database schema design](docs/database_design.md)
- [Third party libraries usage](docs/third_party_usage.md)

## Tech stacks used

- NodeJs / Typescript
- ExpressJS framework
- MySQL
- Prettier & ESlint
- Docker & Github Actions

## Application initiation

To run the application in development:

```bash
npm run dev
```

To lint the project:

```bash
npm run lint
```

To start tests locally with defined test suites:

```bash
npm test
```

## Project structure

```bash
|-- .github
|     |-- workflow
|     |     |-- node.js.yml
|-- src
|     |-- configs
|     |-- controllers
|     |-- helpers
|     |-- loaders
|     |-- middlewares
|     |-- models
|     |-- routes
|     |-- services
|     |-- subscriptions
|     |     |-- emailing.ts
|     |     |-- eventEmitter.ts
|     |     |-- logging.ts
|     |-- tests
|     |-- webhooks
|     |-- server.ts
|-- .dockerignore
|-- .eslintrc
|-- .gitignore
|-- .prettierrc
|-- Dockerfile
|-- nodemon.json
|-- package-lock.json
|-- package.json
|-- README.md
|-- tsconfig.json
```

### Quick overview of layout:

#### .github/workflow

Contain nodejs yml script file for Github Actions to perform testing & building + pushing Docker image after successful PRs.

#### src

Project source code

#### src/configs

Contain all configuration files with envinronment variables necessary for the app to run

#### src/controllers

Contain controller layer codes, handling status codes + response return & prepares payload for next service layer

#### src/helpers

Contain helper functions for specific use cases e.g. authentication or payment initiation etc.

#### src/loaders

Contain Express app main configurations so that application's entry point server.ts is not polluted with configs

#### src/middlewares

Contain middleware functions to be invoked in between requests, e.g. user authentication, api caching, rate limiting...

#### src/models

Contain model layer codes, which handles direct communication with database via queries

#### src/routes

Contain routing layer codes, in which Express router is exported with defined api routes & http verbs and its corresponding controller

#### src/services

Contain service layer codes, in which business logic is handled. This layer fetches data from models, resolves logic, formats data before passing them back to controllers

#### src/subscriptions

Contain subscription layer codes, in which employs NodeJs native 'events' module to handle async operations e.g. mail sending, logging, background database transactions...

#### src/tests

Contain test suites for the application. Tests vary from unit tests for functions to endpoint testing

#### src/webhooks

Contain webhooks' defined actions on certain events e.g. payment related Stripe events

## CI/CD

A simple CI/CD pipeline is used to build Docker image from successful PRs. Currently used Node image in Dockerfile is node:12-alpine for lightweight images.
To configure your own Docker, register for Docker Hub account here https://hub.docker.com/.

Once done, add your Docker credentials as Github Repo secrets in the same format defined in node.js.yml, or you can edit the variable names to your liking.

All other secrets defined in test phase of the workflow should also be provided, so that automatic testing does not fail. As this sample server is connecting to a remote MySQL, it has been pre-configured on remote MySQL host to receive requests from any IP. It is advised that you configure/ set up own remote MySQL server and point the application to it with secrets.

## Local development

To work locally, you may want to add a .env file to the root of the project, with all environment variables provided as stated in node.js.yml file before running the application in dev mode.


