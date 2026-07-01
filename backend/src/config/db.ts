import mongoose from 'mongoose';
import RoomModel from '../models/room.model';

export const connectDB = async () => {
  try {
    console.log("connecting to the database ");
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/openchat';
    await mongoose.connect(connString, {
      dbName: 'openchat'
    });
    console.log('MongoDB Connected successfully.');

    // Seed default rooms requested by user
    await seedDefaultRooms();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDefaultRooms = async () => {
  try {
    console.log("setting up the seed data");
    const defaultRooms = ['General', 'JavaScript', 'Movies', 'Sports'];
    for (const roomName of defaultRooms) {
      const exists = await RoomModel.findOne({ roomName });
      if (!exists) {
        await RoomModel.create({ roomName });
        console.log(`Seeded default room: #${roomName}`);
      }
      console.log("seed data setup successfully");
    }
  } catch (err) {
    console.error('Failed to seed default rooms:', err);
  }
};
