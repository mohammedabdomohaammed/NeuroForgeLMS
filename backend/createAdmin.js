// backend/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel'); // Ensure path is correct
const connectDB = require('./config/db');   // Ensure path is correct

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@neuroforge.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Create Admin
    const user = await User.create({
      name: 'NeuroForge Admin',
      email: 'admin@neuroforge.com',
      password: 'adminpassword123', // You can change this later
      role: 'admin', // <--- THE KEY PART
    });

    console.log('Admin User Created Successfully!');
    console.log('Email: admin@neuroforge.com');
    console.log('Pass:  adminpassword123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();