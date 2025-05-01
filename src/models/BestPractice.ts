import mongoose from 'mongoose';

const BestPracticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Smart Contract', 'Key Management', 'General', 'Operational']
  },
  priority: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [{ type: String }]
});

BestPracticeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.BestPractice || mongoose.model('BestPractice', BestPracticeSchema); 