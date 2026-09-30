# Projeto-Final-BackEnd

Final project of the Web Back-End course: a **Node.js / Express** REST API for a blog application.

## Features

- Authentication with **JWT**; protected routes.
- Roles: regular users and administrators.
- **MongoDB** persistence with Mongoose models.
- API documentation with **Swagger** (`swagger.js` / `swagger_doc.json`).

## Structure

`model/` (Mongoose schemas), `routes/` (endpoints), `helpers/` (auth and utilities), `app.js` (entry point).

## Running

```bash
npm install
# set the MongoDB connection string and JWT secret as environment variables
npm start
```

Swagger UI is served by the app once it is running.
