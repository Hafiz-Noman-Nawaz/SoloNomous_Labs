import mongoose from 'mongoose';

let mongod: any = null;

export const connectDB = async (): Promise<void> => {
  // Connection caching for Serverless (Vercel) and warm containers
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    let uri = process.env.MONGODB_URI;

    if (!uri || uri.trim() === '') {
      // In serverless Vercel environments, MONGODB_URI is required
      if (process.env.VERCEL) {
        throw new Error('MONGODB_URI environment variable is missing in Vercel deployment. Please add MONGODB_URI in your Vercel Project Settings.');
      }

      console.log('⚡ No MONGODB_URI provided. Initializing in-memory MongoMemoryServer for development...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: {
          dbName: 'solonomous_labs'
        }
      });
      uri = mongod.getUri();
      console.log(`✅ In-memory MongoDB initialized at: ${uri}`);
    }

    if (!uri) {
      throw new Error('Failed to resolve valid MongoDB connection URI.');
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log(`🚀 Connected to MongoDB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);

    // Attempt in-memory fallback only in local development (never on Vercel)
    if (!process.env.VERCEL && !mongod) {
      try {
        console.log('🔄 Attempting fallback to in-memory MongoMemoryServer...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongod = await MongoMemoryServer.create({
          instance: { dbName: 'solonomous_labs' }
        });
        const fallbackUri = mongod.getUri();
        await mongoose.connect(fallbackUri, { maxPoolSize: 10 });
        console.log(`✅ Connected to fallback in-memory MongoDB at: ${fallbackUri}`);
        return;
      } catch (fallbackError) {
        console.error('❌ Failed in-memory fallback:', fallbackError);
      }
    }

    if (!process.env.VERCEL) {
      process.exit(1);
    } else {
      throw error;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (error) {
    console.error('Error disconnecting from DB:', error);
  }
};
