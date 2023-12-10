const SwaggerAutogen = require('swagger-autogen')();

output = './swagger_doc.json'
endpoints = ['./app.js']

SwaggerAutogen(output, endpoints)