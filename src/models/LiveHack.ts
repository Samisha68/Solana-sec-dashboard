import mongoose from 'mongoose';

const LiveHackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['Active', 'Resolved', 'False Alarm']
  },
  reportedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  severity: { 
    type: String, 
    required: true,
    enum: ['High', 'Medium', 'Low']
  },
  project: { type: String },
  txHash: { type: String },
  tags: [{ type: String }]
});

LiveHackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.LiveHack || mongoose.model('LiveHack', LiveHackSchema); 