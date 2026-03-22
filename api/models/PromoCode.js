const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, default: '' },

  // Type de réduction
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping', 'buy_x_get_y'],
    required: true,
  },
  value: { type: Number, default: 0 }, // % ou € selon le type

  // Conditions d'application
  minAmount: { type: Number, default: 0 },       // montant minimum du panier
  minQuantity: { type: Number, default: 0 },     // quantité minimum d'articles
  productIds: [{ type: String }],                // si vide = applicable à tout
  excludedProductIds: [{ type: String }],

  // Buy X Get Y
  buyQuantity: { type: Number, default: 0 },
  getQuantity: { type: Number, default: 0 },
  getProductId: { type: String, default: '' },   // si vide = même produit

  // Limites d'utilisation
  maxUses: { type: Number, default: 0 },         // 0 = illimité
  usedCount: { type: Number, default: 0 },
  usedByCustomers: [{ type: String }],           // customer IDs ayant utilisé ce code
  maxUsesPerCustomer: { type: Number, default: 0 }, // 0 = illimité

  // Période de validité
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },

  active: { type: Boolean, default: true },
}, { timestamps: true });

promoCodeSchema.set('toJSON', {
  transform: (doc, ret) => { delete ret.__v; return ret; },
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
