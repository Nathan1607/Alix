import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { Article } from "../class/Article";
import { Registration } from "../class/Registration";
import { Workshop } from "../class/Workshop";

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
              description: "Identifiant unique de l'utilisateur", 
              example: 1 
            },
            first_name: { 
              type: "string", 
              description: "Prénom de l'utilisateur", 
              example: "John" 
            },
            last_name: { 
              type: "string", 
              description: "Nom de l'utilisateur", 
              example: "Doe" 
            },
            commune: { 
              $ref: '#/components/schemas/Commune'
            },
            address: { 
              type: "string", 
              description: "Adresse de l'utilisateur", 
              example: "123 Rue Exemple" 
            },
            phone_landline: { 
              type: "string", 
              description: "Numéro de téléphone fixe", 
              example: "0123456789" 
            },
            phone_mobile: { 
              type: "string", 
              description: "Numéro de téléphone mobile", 
              example: "0698765432" 
            },
            created_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date de création de l'utilisateur", 
              example: "2025-06-13T10:00:00Z"
            },
            registrations: {
              type: "array",
              items: { $ref: "#/components/schemas/Registration" },
              description: "Liste des inscriptions associées à l'utilisateur"
            }
          },
          required: ["id", "first_name", "last_name", "address", "phone_landline", "phone_mobile", "created_at"],
        },
        Commune: {
          type: "object",
          properties: {
            id: { 
              type: "string", 
              description: "Code INSEE ou identifiant unique", 
              example: "72132" 
            },
            name: { 
              type: "string", 
              description: "Nom de la commune", 
              example: "Paris" 
            },
            postal_code: { 
              type: "string", 
              description: "Code postal de la commune", 
              example: "75000" 
            },
            region: { 
              type: "string", 
              description: "Région de la commune", 
              example: "Île-de-France" 
            },
            department: { 
              type: "string", 
              description: "Département de la commune", 
              example: "Paris" 
            },
            country: { 
              type: "string", 
              description: "Pays de la commune", 
              example: "France" 
            },
            created_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date de création de la commune", 
              example: "2025-06-13T10:00:00Z" 
            },
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
              description: "Liste des utilisateurs associés à la commune"
            },
            articles: {
              type: "array",
              items: { $ref: "#/components/schemas/Article" },
              description: "Liste des articles associés à la commune"
            },
            events: {
              type: "array",
              items: { $ref: "#/components/schemas/Event" },
              description: "Liste des événements associés à la commune"
            },
            workshops: {
              type: "array",
              items: { $ref: "#/components/schemas/Workshop" },
              description: "Liste des ateliers associés à la commune"
            }
          },
          required: ["id", "name", "postal_code", "region", "department", "country"],
        },
        Article: {
          type: "object",
          properties: {
            id: { 
              type: "integer", 
              description: "Identifiant unique de l'article", 
              example: 1 
            },
            commune: { 
              $ref: '#/components/schemas/Commune' 
            },
            title_1: { 
              type: "string", 
              description: "Titre 1 de l'article", 
              example: "Introduction" 
            },
            title_2: { 
              type: "string", 
              description: "Titre 2 de l'article", 
              example: "Détails" 
            },
            title_3: { 
              type: "string", 
              description: "Titre 3 de l'article", 
              example: "Conclusion" 
            },
            text_1: { 
              type: "string", 
              description: "Contenu du premier paragraphe", 
              example: "Voici un texte d'exemple pour le premier titre" 
            },
            text_2: { 
              type: "string", 
              description: "Contenu du deuxième paragraphe", 
              example: "Voici un texte d'exemple pour le deuxième titre" 
            },
            text_3: { 
              type: "string", 
              description: "Contenu du troisième paragraphe", 
              example: "Voici un texte d'exemple pour le troisième titre" 
            },
            img_1: { 
              type: "string", 
              description: "Image associée au premier titre", 
              example: "image1.jpg" 
            },
            img_2: { 
              type: "string", 
              description: "Image associée au deuxième titre", 
              example: "image2.jpg" 
            },
            img_3: { 
              type: "string", 
              description: "Image associée au troisième titre", 
              example: "image3.jpg" 
            },
            img_4: { 
              type: "string", 
              description: "Image 4", 
              example: "image4.jpg" 
            },
            img_5: { 
              type: "string", 
              description: "Image 5", 
              example: "image5.jpg" 
            },
            img_6: { 
              type: "string", 
              description: "Image 6", 
              example: "image6.jpg" 
            },
            published_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date de publication de l'article", 
              example: "2025-06-13T10:00:00Z" 
            }
          },
          required: ["id", "commune", "published_at", "title_1", "text_1"],
        },
        Event: {
          type: "object",
          properties: {
            id: { 
              type: "integer", 
              description: "Identifiant unique de l'événement", 
              example: 1 
            },
            commune: { 
              $ref: '#/components/schemas/Commune' 
            },
            title_1: { 
              type: "string", 
              description: "Titre 1 de l'événement", 
              example: "Festival de musique" 
            },
            title_2: { 
              type: "string", 
              description: "Titre 2 de l'événement", 
              example: "Concert à Paris" 
            },
            title_3: { 
              type: "string", 
              description: "Titre 3 de l'événement", 
              example: "Conclusion" 
            },
            text_1: { 
              type: "string", 
              description: "Description du premier titre", 
              example: "Détails sur le festival" 
            },
            text_2: { 
              type: "string", 
              description: "Description du deuxième titre", 
              example: "Détails sur le concert" 
            },
            text_3: { 
              type: "string", 
              description: "Description du troisième titre", 
              example: "Autres informations" 
            },
            img_1: { 
              type: "string", 
              description: "Image de l'événement", 
              example: "event_image1.jpg" 
            },
            img_2: { 
              type: "string", 
              description: "Autre image de l'événement", 
              example: "event_image2.jpg" 
            },
            img_3: { 
              type: "string", 
              description: "Autre image de l'événement", 
              example: "event_image3.jpg" 
            },
            start_time: { 
              type: "string", 
              format: "date-time", 
              description: "Date et heure de début de l'événement", 
              example: "2025-06-13T10:00:00Z" 
            },
            end_time: { 
              type: "string", 
              format: "date-time", 
              description: "Date et heure de fin de l'événement", 
              example: "2025-06-13T18:00:00Z" 
            },
            published_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date de publication de l'événement", 
              example: "2025-06-10T10:00:00Z" 
            },
            registrations: {
              type: "array",
              items: { $ref: "#/components/schemas/Registration" },
              description: "Liste des inscriptions associées à l'événement"
            }
          },
          required: ["id", "commune", "start_time", "end_time", "published_at", "title_1", "text_1"],
        },        
        Registration: {
          type: "object",
          properties: {
            id: { 
              type: "integer", 
              description: "Identifiant unique de l'inscription", 
              example: 1 
            },
            user: { 
              $ref: '#/components/schemas/User' 
            },
            content_type: { 
              type: "string", 
              description: "Type de contenu associé (par défaut : 'evenement')", 
              example: "evenement" 
            },
            content_id: { 
              type: "integer", 
              description: "Identifiant du contenu associé", 
              example: 2 
            },
            registered_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date et heure d'inscription", 
              example: "2025-06-13T10:00:00Z" 
            },
            event: { 
              $ref: '#/components/schemas/Event'
            },
            workshop: { 
              $ref: '#/components/schemas/Workshop'
            }
          },
          required: ["id", "user", "content_type", "content_id", "registered_at", "event"],
        },
        Workshop: {
          type: "object",
          properties: {
            id: { 
              type: "integer", 
              description: "Identifiant unique de l'atelier", 
              example: 1 
            },
            commune: { 
              $ref: '#/components/schemas/Commune' 
            },
            title_1: { 
              type: "string", 
              description: "Titre 1 de l'atelier", 
              example: "Atelier de peinture" 
            },
            title_2: { 
              type: "string", 
              description: "Titre 2 de l'atelier", 
              example: "Atelier créatif" 
            },
            title_3: { 
              type: "string", 
              description: "Titre 3 de l'atelier", 
              example: "Conclusion" 
            },
            text_1: { 
              type: "string", 
              description: "Description du premier titre", 
              example: "Atelier pour les débutants" 
            },
            text_2: { 
              type: "string", 
              description: "Description du deuxième titre", 
              example: "Présentation des matériaux" 
            },
            text_3: { 
              type: "string", 
              description: "Description du troisième titre", 
              example: "Conseils pour débuter" 
            },
            img_1: { 
              type: "string", 
              description: "Image de l'atelier", 
              example: "workshop_image1.jpg" 
            },
            img_2: { 
              type: "string", 
              description: "Autre image de l'atelier", 
              example: "workshop_image2.jpg" 
            },
            img_3: { 
              type: "string", 
              description: "Autre image de l'atelier", 
              example: "workshop_image3.jpg" 
            },
            start_time: { 
              type: "string", 
              format: "date-time", 
              description: "Date et heure de début de l'atelier", 
              example: "2025-06-13T10:00:00Z" 
            },
            end_time: { 
              type: "string", 
              format: "date-time", 
              description: "Date et heure de fin de l'atelier", 
              example: "2025-06-13T18:00:00Z" 
            },
            published_at: { 
              type: "string", 
              format: "date-time", 
              description: "Date de publication de l'atelier", 
              example: "2025-06-10T10:00:00Z" 
            },
            registrations: {
              type: "array",
              items: { $ref: "#/components/schemas/Registration" },
              description: "Liste des inscriptions associées à l'atelier"
            }
          },
          required: ["id", "commune", "start_time", "end_time", "published_at", "title_1", "text_1"],
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
