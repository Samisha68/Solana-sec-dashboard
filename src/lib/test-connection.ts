import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    // Log the MongoDB URI (without credentials for security)
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    // Log the URI format (without credentials)
    const uriParts = uri.split('@');
    if (uriParts.length > 1) {
      console.log('Connection string format:', `mongodb+srv://****:****@${uriParts[1]}`);
    } else {
      console.log('Connection string format:', uri);
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB!');

    // Test creating a document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });

    const Test = mongoose.model('Test', TestSchema);
    
    // Create a test document
    const testDoc = await Test.create({
      name: 'Test Connection'
    });
    console.log('✅ Successfully created test document:', testDoc);

    // Read the test document
    const readDoc = await Test.findById(testDoc._id);
    console.log('✅ Successfully read test document:', readDoc);

    // Clean up
    await Test.findByIdAndDelete(testDoc._id);
    console.log('✅ Successfully cleaned up test document');

  } catch (error) {
    console.error('❌ Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testConnection(); 