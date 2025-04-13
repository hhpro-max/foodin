import { mockIngredients, mockOrders, mockUsers } from '../mock/data';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Ingredients API
export const ingredientsApi = {
  getAll: async () => {
    await delay(500);
    return mockIngredients;
  },
  getById: async (id) => {
    await delay(300);
    const ingredient = mockIngredients.find(i => i.id === parseInt(id));
    if (!ingredient) throw new Error('Ingredient not found');
    return ingredient;
  },
  create: async (data) => {
    await delay(500);
    const newIngredient = {
      id: mockIngredients.length + 1,
      ...data,
      status: 'active'
    };
    mockIngredients.push(newIngredient);
    return newIngredient;
  },
  update: async (id, data) => {
    await delay(500);
    const index = mockIngredients.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Ingredient not found');
    mockIngredients[index] = { ...mockIngredients[index], ...data };
    return mockIngredients[index];
  },
  delete: async (id) => {
    await delay(500);
    const index = mockIngredients.findIndex(i => i.id === parseInt(id));
    if (index === -1) throw new Error('Ingredient not found');
    mockIngredients.splice(index, 1);
    return { success: true };
  }
};

// Orders API
export const ordersApi = {
  getAll: async () => {
    await delay(500);
    return mockOrders;
  },
  getById: async (id) => {
    await delay(300);
    const order = mockOrders.find(o => o.id === parseInt(id));
    if (!order) throw new Error('Order not found');
    return order;
  },
  create: async (data) => {
    await delay(500);
    const newOrder = {
      id: mockOrders.length + 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
  update: async (id, data) => {
    await delay(500);
    const index = mockOrders.findIndex(o => o.id === parseInt(id));
    if (index === -1) throw new Error('Order not found');
    mockOrders[index] = { ...mockOrders[index], ...data };
    return mockOrders[index];
  },
  delete: async (id) => {
    await delay(500);
    const index = mockOrders.findIndex(o => o.id === parseInt(id));
    if (index === -1) throw new Error('Order not found');
    mockOrders.splice(index, 1);
    return { success: true };
  }
};

// Auth API
export const authApi = {
  login: async (credentials) => {
    await delay(500);
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) throw new Error('Invalid credentials');
    return {
      user,
      token: 'mock-jwt-token'
    };
  },
  register: async (userData) => {
    await delay(500);
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) throw new Error('Email already exists');
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      isAdmin: false
    };
    mockUsers.push(newUser);
    return {
      user: newUser,
      token: 'mock-jwt-token'
    };
  },
  getCurrentUser: async () => {
    await delay(300);
    // In a real app, this would decode the JWT token
    return mockUsers[0];
  }
}; 