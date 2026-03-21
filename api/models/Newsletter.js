const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  firstName: { type: String, default: '' },
  subscribedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  unsubscribeToken: { type: String, required: true },
}, { timestamps: true });

newsletterSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; }
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
