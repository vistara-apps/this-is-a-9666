import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'usd',
    interval: 'month',
    features: [
      '5 ad generations per month',
      'Basic analytics',
      'Instagram posting',
      'Community support'
    ],
    limits: {
      adGenerations: 5,
      socialPosts: 10,
      analyticsHistory: 30 // days
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    features: [
      'Unlimited ad generations',
      'Advanced analytics',
      'Instagram & TikTok posting',
      'Trend analysis',
      'Priority support',
      'Custom branding'
    ],
    limits: {
      adGenerations: -1, // unlimited
      socialPosts: -1, // unlimited
      analyticsHistory: 365 // days
    }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    currency: 'usd',
    interval: 'month',
    stripePriceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee'
    ],
    limits: {
      adGenerations: -1, // unlimited
      socialPosts: -1, // unlimited
      analyticsHistory: -1, // unlimited
      teamMembers: 10
    }
  }
}

export class StripeService {
  constructor() {
    this.stripe = null
    this.init()
  }

  async init() {
    this.stripe = await stripePromise
  }

  async createCheckoutSession(planId, userId, userEmail) {
    const plan = SUBSCRIPTION_PLANS[planId.toUpperCase()]
    if (!plan || plan.id === 'free') {
      throw new Error('Invalid plan selected')
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          userId,
          userEmail,
          planId: plan.id
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      const result = await this.stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        throw new Error(result.error.message)
      }

      return result
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    }
  }

  async createPortalSession(customerId) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId
        })
      })

      const session = await response.json()
      
      if (!response.ok) {
        throw new Error(session.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = session.url
      
      return session
    } catch (error) {
      console.error('Error creating portal session:', error)
      throw error
    }
  }

  getPlanByTier(tier) {
    return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === tier) || SUBSCRIPTION_PLANS.FREE
  }

  canPerformAction(userTier, actionType, currentUsage = 0) {
    const plan = this.getPlanByTier(userTier)
    const limit = plan.limits[actionType]
    
    // -1 means unlimited
    if (limit === -1) return true
    
    return currentUsage < limit
  }

  getRemainingUsage(userTier, actionType, currentUsage = 0) {
    const plan = this.getPlanByTier(userTier)
    const limit = plan.limits[actionType]
    
    if (limit === -1) return -1 // unlimited
    
    return Math.max(0, limit - currentUsage)
  }

  formatPrice(price, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price)
  }
}

// Export singleton instance
export const stripeService = new StripeService()

// Usage tracking helpers
export const usageHelpers = {
  async trackUsage(userId, actionType, resourceConsumed = 1, metadata = {}) {
    try {
      const response = await fetch('/api/track-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          actionType,
          resourceConsumed,
          metadata
        })
      })

      if (!response.ok) {
        throw new Error('Failed to track usage')
      }

      return await response.json()
    } catch (error) {
      console.error('Error tracking usage:', error)
      // Don't throw - usage tracking shouldn't break the main flow
    }
  },

  async getUserUsage(userId, actionType, period = 'month') {
    try {
      const response = await fetch(`/api/user-usage?userId=${userId}&actionType=${actionType}&period=${period}`)
      
      if (!response.ok) {
        throw new Error('Failed to get user usage')
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting user usage:', error)
      return { count: 0 }
    }
  }
}
