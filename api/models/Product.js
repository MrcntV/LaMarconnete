const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // keep original string ID for frontend compat
  Titre: { type: String, required: true },
  type: { type: String, default: '' },
  reference: { type: String, default: '' },
  enStock: { type: Boolean, default: true },
  ImageProduit: { type: String, default: '' },
  ImageProduitSup: { type: String, default: '' },
  to: { type: String, default: '' },
  Prix: { type: Number, default: 0 },
  PrixBarre: { type: Number, default: null },
  Description: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  stockAlert: { type: Number, default: 5 },
  active: { type: Boolean, default: true },
}, { timestamps: true, strict: false });

productSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; }
});

module.exports = mongoose.model('Product', productSchema);
