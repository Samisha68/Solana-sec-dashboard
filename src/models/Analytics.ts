import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  metric: { 
    type: String, 
    required: true,
    enum: ['Response Time', 'Funds Recovered', 'Impact Score', 'Total Value Lost', 'Recovery Rate']
  },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  category: { 
    type: String, 
    required: true,
    enum: ['Smart Contract', 'Oracle', 'Social Engineering', 'Key Management', 'General']
  },
  period: { 
    type: String, 
    required: true,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly']
  }
});

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema); 