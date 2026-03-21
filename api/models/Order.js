const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  qty: Number,
  price: Number,
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  postalCode: String,
  country: { type: String, default: 'France' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  items: [orderItemSchema],
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  shippingAddress: shippingAddressSchema,
  trackingNumber: { type: String, default: null },
  colissimoLabel: { type: String, default: null },
  paymentStatus: { type: String, default: 'pending' },
  paymentIntentId: { type: String, default: '' },
  notes: { type: String, default: '' },
  invoiceId: { type: String, default: null },
}, { timestamps: true, strict: false });

orderSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; }
});

module.exports = mongoose.model('Order', orderSchema);
