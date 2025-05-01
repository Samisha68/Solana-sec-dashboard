import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exploit from '@/models/Exploit';
import LiveHack from '@/models/LiveHack';
import Analytics from '@/models/Analytics';
import BestPractice from '@/models/BestPractice';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Create indexes for Exploits collection
    await Exploit.collection.createIndexes([
      { key: { date: -1 } },
      { key: { type: 1 } },
      { key: { status: 1 } },
      { key: { project: 1 } },
      { key: { tags: 1 } }
    ]);
    console.log('✅ Created indexes for Exploits collection');

    // Create indexes for LiveHacks collection
    await LiveHack.collection.createIndexes([
      { key: { reportedAt: -1 } },
      { key: { status: 1 } },
      { key: { severity: 1 } },
      { key: { project: 1 } }
    ]);
    console.log('✅ Created indexes for LiveHacks collection');

    // Create indexes for Analytics collection
    await Analytics.collection.createIndexes([
      { key: { timestamp: -1 } },
      { key: { metric: 1 } },
      { key: { category: 1 } },
      { key: { period: 1 } }
    ]);
    console.log('✅ Created indexes for Analytics collection');

    // Create indexes for BestPractices collection
    await BestPractice.collection.createIndexes([
      { key: { category: 1 } },
      { key: { priority: 1 } },
      { key: { tags: 1 } }
    ]);
    console.log('✅ Created indexes for BestPractices collection');

    console.log('✅ Database initialization completed successfully');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeDatabase(); 