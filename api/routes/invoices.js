const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateId } = require('../db');
const { requireAdmin, requireAuth } = require('../middleware/auth');

// GET /api/invoices
router.get('/', requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }
    const invoices = await Invoice.find(query).sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/invoices/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ error: 'Facture introuvable' });
    }
    // Allow if admin or if it's the customer's own invoice
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.customerId !== invoice.customerId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices — facture manuelle
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { customerName, customerEmail, customerId, items, taxRate = 20, notes = '' } = req.body;
    if (!customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nom client et au moins un article requis' });
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const lineItems = items.map(item => ({
      productId: item.productId || '',
      name: item.name,
      qty: item.qty,
      price: item.price,
      total: parseFloat((item.qty * item.price).toFixed(2)),
    }));

    const subtotal = parseFloat(lineItems.reduce((s, i) => s + i.total, 0).toFixed(2));
    const taxAmount = parseFloat((subtotal * taxRate / 100).toFixed(2));
    const total = parseFloat((subtotal + taxAmount).toFixed(2));

    const newInvoice = await Invoice.create({
      id: generateId('inv'),
      invoiceNumber,
      orderId: null,
      customerId: customerId || null,
      customerName,
      customerEmail: customerEmail || '',
      date: new Date(),
      items: lineItems,
      subtotal,
      taxRate,
      taxAmount,
      total,
      status: 'draft',
      notes,
      pdfPath: null,
    });

    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/invoices/:id/status — changer statut + déduire stock si paid
router.put('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'sent', 'paid', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) return res.status(404).json({ error: 'Facture introuvable' });

    const wasAlreadyPaid = invoice.status === 'paid';
    invoice.status = status;

    // Déduire le stock quand on passe à "paid" (une seule fois)
    if (status === 'paid' && !wasAlreadyPaid) {
      for (const item of invoice.items) {
        await Product.findOneAndUpdate(
          { id: item.productId },
          { $inc: { stock: -item.qty } }
        );
      }
    }

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/invoices/generate/:orderId
router.post('/generate/:orderId', requireAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ id: req.params.orderId });
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }
    const existing = await Invoice.findOne({ orderId: order.id });
    if (existing) {
      return res.json(existing);
    }
    const count = await Invoice.countDocuments();
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const subtotal = order.subtotal;
    const taxAmount = parseFloat((subtotal * 0.2).toFixed(2));
    const newInvoice = await Invoice.create({
      id: generateId('inv'),
      invoiceNumber,
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      date: new Date(),
      items: order.items.map(item => ({
        ...(item.toObject ? item.toObject() : item),
        total: item.qty * item.price,
      })),
      subtotal,
      taxRate: 20,
      taxAmount,
      total: order.total,
      status: 'draft',
      pdfPath: null,
    });

    await Order.findOneAndUpdate({ id: req.params.orderId }, { invoiceId: newInvoice.id });

    res.status(201).json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/invoices/:id/download
router.get('/:id/download', requireAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) {
      return res.status(404).json({ error: 'Facture introuvable' });
    }
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin' && req.user.customerId !== invoice.customerId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const itemsHtml = invoice.items.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.price.toFixed(2)} €</td>
        <td>${item.total.toFixed(2)} €</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Facture ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #333; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .brand { color: #546863; font-size: 24px; font-weight: bold; }
    h2 { color: #546863; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #546863; color: white; padding: 10px; text-align: left; }
    td { padding: 8px 10px; border-bottom: 1px solid #eee; }
    .total-section { text-align: right; margin-top: 20px; }
    .total-section p { margin: 5px 0; }
    .grand-total { font-size: 18px; font-weight: bold; color: #546863; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">La marcOnnête</div>
      <p>contact@lamarconnete.fr</p>
    </div>
    <div style="text-align:right">
      <h2>FACTURE</h2>
      <p>N° ${invoice.invoiceNumber}</p>
      <p>Date : ${new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
    </div>
  </div>
  <div>
    <strong>Facturée à :</strong>
    <p>${invoice.customerName}</p>
  </div>
  <table>
    <thead>
      <tr><th>Produit</th><th>Qté</th><th>Prix unitaire</th><th>Total</th></tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div class="total-section">
    <p>Sous-total HT : ${invoice.subtotal.toFixed(2)} €</p>
    <p>TVA (${invoice.taxRate}%) : ${invoice.taxAmount.toFixed(2)} €</p>
    <p class="grand-total">TOTAL TTC : ${invoice.total.toFixed(2)} €</p>
  </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoice.invoiceNumber}.html"`);
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
