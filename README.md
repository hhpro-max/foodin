# Foodin - Food Ingredients E-commerce Backend

A Node.js backend for a food ingredients e-commerce platform where users can browse and purchase various food ingredients.

## Features

- User authentication (JWT)
- Role-based access control (Admin/User)
- Ingredient management (CRUD operations)
- Order management
- Image upload support
- MongoDB database with Mongoose ODM

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foodin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodin
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user profile

### Ingredients
- GET /api/ingredients - Get all ingredients
- GET /api/ingredients/:id - Get single ingredient
- POST /api/ingredients - Create new ingredient (Admin only)
- PUT /api/ingredients/:id - Update ingredient (Admin only)
- DELETE /api/ingredients/:id - Delete ingredient (Admin only)

### Orders
- GET /api/orders - Get all orders (Admin) or user's orders
- GET /api/orders/:id - Get single order
- POST /api/orders - Create new order
- PUT /api/orders/:id - Update order status (Admin only)
- DELETE /api/orders/:id - Cancel order

## Request Examples

### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

### Create Ingredient
```json
POST /api/ingredients
{
  "name": "Mozzarella Cheese",
  "description": "Fresh Italian mozzarella cheese",
  "price": 5.99,
  "category": "dairy",
  "stock": 100,
  "unit": "kg"
}
```

### Create Order
```json
POST /api/orders
{
  "items": [
    {
      "ingredient": "ingredient_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

## Error Handling

The API uses standard HTTP response codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Security

- JWT authentication
- Password hashing with bcrypt
- Role-based access control
- Environment variables for sensitive data
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 