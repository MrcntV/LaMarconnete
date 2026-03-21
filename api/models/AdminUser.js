const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
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
    select: false,
  },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin',
  },
  active: { type: Boolean, default: true },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

adminUserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
