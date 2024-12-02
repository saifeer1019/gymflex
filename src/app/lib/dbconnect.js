import mongoose from 'mongoose';

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGO_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the cached variable at the module level
let cached = { conn: null, promise: null };

async function dbConnect() {
  // Check if the connection is already established
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        cached.conn = mongoose.connection; // Cache the connection
        return cached.conn;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }

  // Wait for the connection promise to resolve
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
