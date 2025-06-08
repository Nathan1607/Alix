import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

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
            name: { type: "string", description: "Nom de la commune", example: "La Ferté-Bernard" },
            postal_code: { type: "string", description: "Code postal", example: "72400" },
            region: { type: "string", description: "Région administrative", example: "Pays de la Loire" },
            department: { type: "string", description: "Département", example: "Sarthe" },
            country: { type: "string", description: "Pays", example: "France" },
          },
          required: ["id", "name", "postal_code", "region", "department", "country"],
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
