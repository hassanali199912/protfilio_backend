// src/config/swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const PORT = process.env.PORT || 8080;
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Backend API",
      version: "1.0.0",
      description: "API documentation for Hassan's portfolio backend",
    },
    servers: [
      { url: `http://localhost:${PORT}`, description: "Local server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
  },
  apis: [
    "./config/docs/*.js",       
    // "./main-routes/*.js",   
    // "*.js"
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
