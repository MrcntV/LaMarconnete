const mongoose = require('mongoose');

// Single document model — always upsert with key: 'main'
const contentSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
}, { strict: false, timestamps: true });

contentSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; delete ret._id; delete ret.key; delete ret.createdAt; delete ret.updatedAt; return ret; }
});

module.exports = mongoose.model('Content', contentSchema);
