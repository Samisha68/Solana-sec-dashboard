import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exploit from '../models/Exploit';
import LiveHack from '../models/LiveHack';
import Analytics from '../models/Analytics';
import BestPractice from '../models/BestPractice';

// Load environment variables
dotenv.config({ path: '.env.local' });


const sampleExploits = [
  {
    title: 'Mango Markets Price Manipulation',
    description: 'Price manipulation attack on Mango Markets leading to significant losses',
    date: new Date('2022-10-11'),
    amountLost: 114000000,
    type: 'Price Manipulation',
    status: 'Resolved',
    project: 'Mango Markets',
    txHash: '4VvGGKGJQYJKkF9hhqGp4dqVJGYqkNYPxW4jYFYpZg2Q',
    analysis: 'The attacker manipulated the MNGO/USD price through oracle manipulation',
    lessons: 'Implement robust oracle security and circuit breakers',
    tags: ['defi', 'oracle', 'price-manipulation']
  },
  {
    title: 'Wormhole Bridge Exploit',
    description: 'Exploit of the Wormhole bridge leading to loss of wrapped ETH',
    date: new Date('2022-02-02'),
    amountLost: 320000000,
    type: 'Smart Contract',
    status: 'Resolved',
    project: 'Wormhole',
    txHash: '2zCz6ZBM7qHo7ELjP5z8ryuKGWJFLKyxPkRJQAPs5hHu',
    analysis: 'The attacker exploited a vulnerability in the bridge contract',
    lessons: 'Implement thorough security audits and multi-sig controls',
    tags: ['bridge', 'smart-contract', 'cross-chain']
  },
  {
    title: 'Solend Oracle Attack',
    description: 'Price oracle manipulation on Solend protocol',
    date: new Date('2022-11-02'),
    amountLost: 1100000,
    type: 'Oracle',
    status: 'Resolved',
    project: 'Solend',
    txHash: '5VqztFckgNyKJWzZH9HnVgzqfxKKW1oZApYQJxmFCGPF',
    analysis: 'The attacker manipulated the price oracle to drain funds',
    lessons: 'Use multiple price oracles and implement circuit breakers',
    tags: ['defi', 'oracle', 'lending']
  }
];

const sampleLiveHacks = [
  {
    title: 'Suspicious Transaction Pattern Detected',
    description: 'Multiple large transactions to unknown addresses',
    status: 'Active',
    severity: 'High',
    project: 'Solana Protocol',
    txHash: '0x789...ghi',
    tags: ['suspicious', 'large-transactions']
  }
];

const sampleAnalytics = [
  {
    metric: 'Total Value Lost',
    value: 435100000, // Sum of all exploits
    timestamp: new Date(),
    category: 'Smart Contract',
    period: 'Daily'
  },
  {
    metric: 'Recovery Rate',
    value: 45, // 45% recovery rate
    timestamp: new Date(),
    category: 'Smart Contract',
    period: 'Daily'
  }
];

const sampleBestPractices = [
  {
    title: 'Implement Circuit Breakers',
    description: 'Add circuit breakers to prevent large value movements and protect against price manipulation attacks',
    category: 'Smart Contract',
    priority: 1,
    tags: ['security', 'circuit-breaker', 'price-manipulation']
  },
  {
    title: 'Multiple Oracle Sources',
    description: 'Use multiple price feed sources and implement median pricing to prevent oracle manipulation',
    category: 'Operational',
    priority: 1,
    tags: ['oracle', 'price-feed', 'security']
  },
  {
    title: 'Regular Security Audits',
    description: 'Conduct regular security audits and bug bounty programs',
    category: 'General',
    priority: 2,
    tags: ['audit', 'security', 'best-practice']
  },
  {
    title: 'Secure Key Management',
    description: 'Implement secure key management practices including multi-sig and hardware wallets',
    category: 'Key Management',
    priority: 1,
    tags: ['keys', 'security', 'multi-sig']
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Exploit.deleteMany({}),
      LiveHack.deleteMany({}),
      Analytics.deleteMany({}),
      BestPractice.deleteMany({})
    ]);
    console.log('✅ Cleared existing data');

    // Insert sample data
    await Promise.all([
      Exploit.insertMany(sampleExploits),
      LiveHack.insertMany(sampleLiveHacks),
      Analytics.insertMany(sampleAnalytics),
      BestPractice.insertMany(sampleBestPractices)
    ]);
    console.log('✅ Inserted sample data');

    console.log('✅ Database seeding completed successfully');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeding
seedDatabase(); 