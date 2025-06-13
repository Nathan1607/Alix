import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { Article } from "../class/Article";

// Configuration de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de l'API Alix",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            first_name: {
              type: "string",
              example: "John",
            },
            last_name: {
              type: "string",
              example: "Doe",
            },
          },
          required: ["id", "first_name", "last_name"],
        },
        Commune: {
          type: "object",
          properties: {
            id: { type: "string", description: "Code INSEE ou identifiant unique", example: "72132" },
          },
          required: ["id"],
        },
        Article: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Identifiant unique de l'article", example: 1 },
          },
          required: ["id"],
        },
        Event: {
          type: "object",
          properties: {
            id: { type: "integer", description: "Identifiant unique de l'événement", example: 1 },  
          },
          required: ["id"],
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger documentation available at http://localhost:3000/api-docs");
};
