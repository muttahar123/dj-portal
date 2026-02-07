import 'dotenv/config';
import setupDNS from './dns.js';
setupDNS();

import mongoose from 'mongoose';
import User from '../models/User.js';
import connectDB from '../config/db.js';

const fixDuplicateIds = async () => {
    try {
        await connectDB();

        console.log('Searching for users with empty studentId or teacherId...');

        // Find users where studentId or teacherId is an empty string
        const usersToFix = await User.find({
            $or: [
                { studentId: "" },
                { teacherId: "" }
            ]
        });

        console.log(`Found ${usersToFix.length} users to fix.`);

        for (const user of usersToFix) {
            let updated = false;
            if (user.studentId === "") {
                user.studentId = undefined;
                updated = true;
            }
            if (user.teacherId === "") {
                user.teacherId = undefined;
                updated = true;
            }

            if (updated) {
                // We use findByIdAndUpdate to bypass validation if necessary, 
                // but since we updated the model, a simple save should also work.
                // However, $unset is cleaner for sparse indexes.
                await User.updateOne(
                    { _id: user._id },
                    { $unset: { studentId: user.studentId === undefined ? 1 : undefined, teacherId: user.teacherId === undefined ? 1 : undefined } }
                );
                console.log(`Fixed user: ${user.email}`);
            }
        }

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error.message);
        process.exit(1);
    }
};

fixDuplicateIds();
