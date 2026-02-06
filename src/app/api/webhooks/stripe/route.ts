import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      
      // TODO: Fulfill the order
      // - Get customer email from session.customer_details?.email
      // - Get subscription ID from session.subscription
      // - Create/update user in database
      // - Grant access to the product
      
      console.log('Checkout completed:', {
        sessionId: session.id,
        customerId: session.customer,
        subscriptionId: session.subscription,
        email: session.customer_details?.email,
      })
      
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      
      // TODO: Handle subscription updates
      // - Update user's plan in database
      // - Handle upgrades/downgrades
      
      console.log('Subscription updated:', subscription.id)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      
      // TODO: Handle subscription cancellation
      // - Revoke access
      // - Update user status in database
      
      console.log('Subscription canceled:', subscription.id)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      
      // TODO: Handle successful payment
      // - Send receipt email
      // - Update billing records
      
      console.log('Payment succeeded:', invoice.id)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      
      // TODO: Handle failed payment
      // - Send notification to user
      // - Possibly suspend access
      
      console.log('Payment failed:', invoice.id)
      break
    }

    default:
      console.log('Unhandled event type:', event.type)
  }

  return NextResponse.json({ received: true })
}
