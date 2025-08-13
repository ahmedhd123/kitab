import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ahmedhd123:Ahmedhd123@kitabi1.8zozmw.mongodb.net/kitabi?retryWrites=true&w=majority';
const MONGODB_DB = process.env.MONGODB_DB || 'kitabi';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise;
    const db = client.db(MONGODB_DB);
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ Connected to MongoDB Atlas directly');
    
    return { client, db };
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error);
    throw error;
  }
}

export { clientPromise };
export default clientPromise;
