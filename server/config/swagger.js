const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HealthBridge NGO API",
            version: "1.0.0",
            description: "REST API for HealthBridge NGO Healthcare Management System. Supports patient registration, volunteer management, contact handling, and admin authentication.",
            contact: {
                name: "HealthBridge NGO",
                email: "support@healthbridge.org"
            }
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            },
            {
                url: "https://healthcare-r6to.onrender.com",
                description: "Production server"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            },
            schemas: {
                Patient: {
                    type: "object",
                    required: ["name", "age", "email", "phone", "condition", "supportNeeded"],
                    properties: {
                        name: { type: "string", example: "Ram Kumar" },
                        age: { type: "number", example: 45 },
                        email: { type: "string", example: "ram@test.com" },
                        phone: { type: "string", example: "9876543210" },
                        condition: { type: "string", example: "Diabetes" },
                        supportNeeded: { type: "string", example: "Medication assistance" },
                        urgency: { type: "string", enum: ["low", "medium", "high", "critical"], example: "high" },
                        status: { type: "string", enum: ["pending", "assigned", "resolved"], example: "pending" }
                    }
                },
                Volunteer: {
                    type: "object",
                    required: ["name", "email", "phone", "motivation"],
                    properties: {
                        name: { type: "string", example: "Priya Sharma" },
                        email: { type: "string", example: "priya@test.com" },
                        phone: { type: "string", example: "9876543210" },
                        skills: { type: "array", items: { type: "string" }, example: ["nursing", "first aid"] },
                        availability: { type: "string", enum: ["weekdays", "weekends", "both", "flexible"], example: "weekends" },
                        motivation: { type: "string", example: "Want to help the community" },
                        status: { type: "string", enum: ["pending", "approved", "active"], example: "pending" }
                    }
                },
                Contact: {
                    type: "object",
                    required: ["name", "email", "subject", "message"],
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john@test.com" },
                        subject: { type: "string", example: "Need appointment" },
                        message: { type: "string", example: "I need to schedule an appointment for my mother" }
                    }
                },
                LoginRequest: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "admin@healthbridge.com" },
                        password: { type: "string", example: "admin123" }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        accessToken: { type: "string" },
                        refreshToken: { type: "string" },
                        admin: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                email: { type: "string" }
                            }
                        }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        success: { type: "boolean", example: false },
                        message: { type: "string", example: "Error message" }
                    }
                }
            }
        }
    },
    apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);