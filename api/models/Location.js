const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  address:    { type: String, default: '' },
  city:       { type: String, required: true, trim: true },
  postalCode: { type: String, required: true },
  département:{ type: String, default: '' },
  lat:        { type: Number },
  lng:        { type: Number },
  phone:      { type: String, default: '' },
  email:      { type: String, default: '' },
  schedule:   { type: String, default: '' },
  image:      { type: String, default: '' },
  active:     { type: Boolean, default: true },
}, { timestamps: true });

locationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Location', locationSchema);
