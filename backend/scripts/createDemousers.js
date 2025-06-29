// backend/scripts/createDemoUsers.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

const createDemoUsers = async () => {
  try {
    await connectDB();
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    const demoUsers = [
      {
        name: 'Demo Student',
        email: 'student@demo.com',
        password: hashedPassword,
        role: 'student',
        isVerified: true
      },
      {
        name: 'Demo Teacher',
        email: 'teacher@demo.com',
        password: hashedPassword,
        role: 'teacher',
        isVerified: true
      },
      {
        name: 'Demo Admin',
        email: 'admin@demo.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created demo user: ${userData.email}`);
      }
    }

    console.log('Demo users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating demo users:', error);
    process.exit(1);
  }
};

createDemoUsers();
