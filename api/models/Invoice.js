const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  productId: String,
  name: String,
  qty: Number,
  price: Number,
  total: Number,
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, required: true },
  orderId: { type: String, default: null },
  customerId: { type: String, default: null },
  customerName: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  items: [invoiceItemSchema],
  subtotal: { type: Number, default: 0 },
  taxRate: { type: Number, default: 20 },
  taxAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, default: 'draft' },
  notes: { type: String, default: '' },
  pdfPath: { type: String, default: null },
}, { timestamps: true, strict: false });

invoiceSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
