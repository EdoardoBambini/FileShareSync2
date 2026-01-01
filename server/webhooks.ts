import type { Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing required Stripe webhook secret: STRIPE_WEBHOOK_SECRET');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-04-30.basil",
});

/**
 * Stripe webhook handler with signature verification
 * Handles subscription lifecycle events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    console.error("No Stripe signature found");
    return res.status(400).send('No signature');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;

        if (userId && customerId) {
          console.log(`Checkout completed for user ${userId}`);
          await storage.updateUserSubscription(userId, 'premium', customerId, session.id);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const users = await storage.getUserByStripeCustomerId(customerId);
        if (users && subscription.status === 'active') {
          console.log(`Subscription ${subscription.status} for customer ${customerId}`);
          await storage.updateUserSubscription(users.id, 'premium', customerId, subscription.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find user by Stripe customer ID
        const users = await storage.getUserByStripeCustomerId(customerId);
        if (users) {
          console.log(`Subscription canceled for customer ${customerId}`);
          await storage.updateUserSubscription(users.id, 'free', customerId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find user and downgrade to free
        const users = await storage.getUserByStripeCustomerId(customerId);
        if (users) {
          console.log(`Payment failed for customer ${customerId}, downgrading to free`);
          await storage.updateUserSubscription(users.id, 'free', customerId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
