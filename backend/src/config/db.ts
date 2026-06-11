import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Disable buffering globally so Mongoose operations fail immediately if disconnected
    mongoose.set('bufferCommands', false);

    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/worldcup_guardian',
      {
        serverSelectionTimeoutMS: 1000, // fail fast after 1 second if mongo is down
      }
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    // For hackathon ease, let's not crash if MongoDB fails to connect (fallback to in-memory mocks if MongoDB isn't ready)
    console.log('Using fallback mock database system if connection fails.');
  }
};
