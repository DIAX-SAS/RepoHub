import mongoose from 'mongoose';

const connection: Record<string, any> = {};

async function connectDB() {
  if (connection.isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(
      'mongodb://127.0.0.1:27017/development-projects'
    );
    connection.isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

export default connectDB;
