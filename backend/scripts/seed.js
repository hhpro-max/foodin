const mongoose = require('mongoose');
const User = require('../models/user.model');
const Ingredient = require('../models/ingredient.model');
const config = require('../config/development');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ingredient.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@foodin.com',
      password: 'admin123',
      role: 'admin',
      address: {
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country'
      }
    });

    // Create regular user
    const regularUser = await User.create({
      name: 'Regular User',
      email: 'user@foodin.com',
      password: 'user123',
      role: 'user',
      address: {
        street: '456 User St',
        city: 'User City',
        state: 'User State',
        zipCode: '67890',
        country: 'User Country'
      }
    });

    // Create test ingredients
    const ingredients = await Ingredient.create([
      {
        name: 'Fresh Tomatoes',
        description: 'Ripe, juicy tomatoes perfect for salads and cooking',
        price: 2.99,
        category: 'vegetables',
        image: 'tomatoes.jpg',
        stock: 100,
        unit: 'kg'
      },
      {
        name: 'Chicken Breast',
        description: 'Fresh, boneless chicken breast',
        price: 8.99,
        category: 'meat',
        image: 'chicken.jpg',
        stock: 50,
        unit: 'kg'
      },
      {
        name: 'Olive Oil',
        description: 'Extra virgin olive oil from Italy',
        price: 12.99,
        category: 'other',
        image: 'olive-oil.jpg',
        stock: 30,
        unit: 'l'
      },
      {
        name: 'Black Pepper',
        description: 'Freshly ground black pepper',
        price: 4.99,
        category: 'spices',
        image: 'pepper.jpg',
        stock: 200,
        unit: 'g'
      }
    ]);

    console.log('Test data seeded successfully');
    console.log('Admin user:', adminUser.email);
    console.log('Regular user:', regularUser.email);
    console.log('Ingredients created:', ingredients.length);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData(); 