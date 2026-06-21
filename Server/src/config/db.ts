import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI as string;
    await mongoose.connect(mongoUri);
    console.log('🍃 Connected to MongoDB Successfully!');
  } catch (err) {
    console.error('⚠️ MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
