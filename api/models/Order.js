const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  qty: Number,
  price: Number,
  couleur: String,
  taille: String,
}, { _id: false });

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address: String,
  city: String,
  postalCode: String,
  country: { type: String, default: 'France' },
  phone: String,
}, { _id: false });

const colissimoLabelSchema = new mongoose.Schema({
  type: { type: String, enum: ['aller', 'retour', 'allerretour'], default: 'aller' },
  trackingNumber: String,
  labelUrl: String,
  labelBase64: String,
  insurance: { type: Boolean, default: false },
  insuranceValue: { type: Number, default: 0 },
  poids: Number,
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true },
  customerId: { type: String, default: '' },
  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  customerPhone: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  items: [orderItemSchema],
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  promoCode: { type: String, default: '' },
  total: { type: Number, default: 0 },
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  trackingNumber: { type: String, default: null },
  colissimoLabels: [colissimoLabelSchema],
  paymentStatus: { type: String, default: 'pending' },
  paymentIntentId: { type: String, default: '' },
  stripeChargeId: { type: String, default: '' },
  cardLast4: { type: String, default: '' },
  cardBrand: { type: String, default: '' },
  cardFunding: { type: String, default: '' },
  parrainMarraine: { type: String, default: '' },
  source: { type: String, default: '' },
  notes: { type: String, default: '' },
  invoiceId: { type: String, default: null },
  refundStatus: { type: String, default: 'none' },
  refundAmount: { type: Number, default: 0 },
  refundId: { type: String, default: '' },
}, { timestamps: true, strict: false });

orderSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; },
});

module.exports = mongoose.model('Order', orderSchema);
