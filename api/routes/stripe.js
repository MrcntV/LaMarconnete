const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/stripe/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;
    if (!amount) {
      return res.status(400).json({ error: 'Montant requis' });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      // Placeholder when Stripe is not configured
      console.log('[Stripe] STRIPE_SECRET_KEY not set — returning mock payment intent');
      return res.json({
        clientSecret: 'pi_mock_client_secret_for_development',
        paymentIntentId: 'pi_mock_' + Date.now(),
        mock: true
      });
    }

    const stripe = require('stripe')(stripeKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      metadata
    });
    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/webhook
// IMPORTANT: This route requires raw body parser — configured in server.js
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    if (webhookSecret && sig) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || '');
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err) {
        console.error('[Stripe Webhook] Signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }
    } else {
      // No secret configured — parse raw body
      try {
        event = JSON.parse(req.body.toString());
      } catch (e) {
        return res.status(400).json({ error: 'Invalid payload' });
      }
    }

    console.log('[Stripe Webhook] Event type:', event.type);

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const order = await Order.findOneAndUpdate(
          { paymentIntentId: pi.id },
          { paymentStatus: 'paid', status: 'confirmed' },
          { new: true }
        );
        if (order) {
          console.log(`[Stripe] Order ${order.orderNumber} payment confirmed`);
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        await Order.findOneAndUpdate(
          { paymentIntentId: pi.id },
          { paymentStatus: 'failed' }
        );
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
