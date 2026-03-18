import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tanzania Tech Nexus API',
      version: '1.0.0',
      description: 'E-commerce platform API documentation',
      contact: {
        name: 'Tanzania Tech Nexus',
        email: 'support@tanzaniatechnexus.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://tanzania-tech-nexus-backend.onrender.com/api'
          : 'http://localhost:3001/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            phone: { type: 'string', example: '+255123456789' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Profile: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            full_name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', example: '+255123456789' },
            address: { type: 'string' },
            city: { type: 'string' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'iPhone 15 Pro' },
            description: { type: 'string' },
            price: { type: 'number', format: 'decimal', example: 1299.99 },
            discount_price: { type: 'number', format: 'decimal', example: 1199.99 },
            stock: { type: 'integer', example: 50 },
            category_id: { type: 'string', format: 'uuid' },
            image_url: { type: 'string', format: 'uri' },
            images: { type: 'array', items: { type: 'string' } },
            brand: { type: 'string', example: 'Apple' },
            specifications: { type: 'object' },
            is_featured: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'Smartphones' },
            description: { type: 'string' },
            image_url: { type: 'string', format: 'uri' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            total_amount: { type: 'number', format: 'decimal', example: 1299.99 },
            status: { type: 'string', enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] },
            shipping_address: { type: 'string' },
            phone: { type: 'string' },
            payment_method: { type: 'string', example: 'cash_on_delivery' },
            tracking_number: { type: 'string' },
            tracking_url: { type: 'string', format: 'uri' },
            estimated_delivery: { type: 'string', format: 'date-time' },
            coupon_code: { type: 'string' },
            discount_amount: { type: 'number', format: 'decimal' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            order_id: { type: 'string', format: 'uuid' },
            product_id: { type: 'string', format: 'uuid' },
            quantity: { type: 'integer', example: 2 },
            price: { type: 'number', format: 'decimal', example: 1299.99 }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            product_id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
            comment: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        ChatMessage: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sender_id: { type: 'string', format: 'uuid' },
            receiver_id: { type: 'string', format: 'uuid' },
            message: { type: 'string' },
            is_from_admin: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Coupon: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            code: { type: 'string', example: 'SAVE20' },
            discount_percentage: { type: 'integer', minimum: 1, maximum: 100, example: 20 },
            discount_amount: { type: 'number', format: 'decimal' },
            min_purchase_amount: { type: 'number', format: 'decimal' },
            max_uses: { type: 'integer' },
            used_count: { type: 'integer' },
            valid_from: { type: 'string', format: 'date-time' },
            valid_until: { type: 'string', format: 'date-time' },
            is_active: { type: 'boolean' },
            created_at: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation successful' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/swagger/endpoints.js'], // Path to the API files
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };