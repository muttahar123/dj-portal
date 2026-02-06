import 'dotenv/config';
import setupDNS from './utils/dns.js';
setupDNS();

import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

const createAdmin = async () => {
    try {
        await connectDB();

        const adminData = {
            name: "Admin User",
            email: "admin@djcollege.com",
            password: "admin@123",
            role: "ADMIN", // Forced to ADMIN as requested for an admin user
            department: "Administration"
        };

        // Check if user already exists
        const existingUser = await User.findOne({ email: adminData.email });
        if (existingUser) {
            console.log('User already exists! Updating role to ADMIN...');
            existingUser.role = 'ADMIN';
            await existingUser.save();
            console.log('User updated successfully.');
        } else {
            const user = await User.create(adminData);
            console.log('Admin User created successfully:', user.email);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
