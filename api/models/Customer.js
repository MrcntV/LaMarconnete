const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, // never returned by default
  },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  phone:     { type: String, default: '' },
  address:   { type: String, default: '' },
  city:      { type: String, default: '' },
  postalCode:{ type: String, default: '' },
  country:   { type: String, default: 'France' },
  orders:    [{ type: String }], // order IDs (JSON-side)
  newsletter:{ type: Boolean, default: false },
  active:    { type: Boolean, default: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

// Hash password before saving
customerSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

// Compare password helper
customerSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Safe public representation (no passwordHash)
customerSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('Customer', customerSchema);
