# AdSpin AI API Documentation

## Overview

AdSpin AI provides a comprehensive API for AI-powered ad generation and social media automation. This document outlines all the API endpoints, authentication methods, and integration requirements.

## Base URL

```
Production: https://api.adspin.ai/v1
Development: http://localhost:3001/v1
```

## Authentication

All API requests require authentication using Bearer tokens obtained through Supabase Auth.

```http
Authorization: Bearer <your_access_token>
```

## Core Endpoints

### Authentication

#### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "subscription_tier": "free"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

#### POST /auth/signin
Sign in an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

#### POST /auth/signout
Sign out the current user.

### Ad Generation

#### POST /ads/generate
Generate AI-powered ad variations from a product image.

**Request Body:**
```json
{
  "image_url": "https://example.com/product.jpg",
  "product_type": "skincare",
  "options": {
    "num_variations": 5,
    "platforms": ["instagram", "tiktok"],
    "style_preferences": ["trendy", "minimalist"]
  }
}
```

**Response:**
```json
{
  "ads": [
    {
      "ad_id": "uuid",
      "type": "image",
      "generated_content": {
        "copy": "POV: You found the perfect skincare routine ✨",
        "visual_style": "Clean, modern aesthetic with soft pastels",
        "platform": "instagram",
        "trend_elements": ["carousel", "before/after"],
        "color_palette": ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        "typography": {
          "primary": "Clean, modern sans-serif",
          "secondary": "Light, elegant serif"
        }
      },
      "performance_metrics": {
        "views": 0,
        "likes": 0,
        "shares": 0,
        "clicks": 0
      }
    }
  ]
}
```

#### GET /ads
Retrieve user's generated ads.

**Query Parameters:**
- `limit` (optional): Number of ads to return (default: 20)
- `offset` (optional): Pagination offset (default: 0)
- `platform` (optional): Filter by platform (instagram, tiktok)
- `status` (optional): Filter by status (draft, published)

**Response:**
```json
{
  "ads": [...],
  "total": 150,
  "has_more": true
}
```

#### GET /ads/:id
Get a specific ad by ID.

#### PUT /ads/:id
Update an ad's content or settings.

#### DELETE /ads/:id
Delete an ad.

### Social Media Integration

#### POST /social/connect
Connect a social media account.

**Request Body:**
```json
{
  "platform": "instagram",
  "auth_code": "authorization_code_from_oauth",
  "redirect_uri": "https://app.adspin.ai/callback"
}
```

#### GET /social/accounts
Get connected social media accounts.

#### DELETE /social/accounts/:id
Disconnect a social media account.

#### POST /social/publish
Publish ads to connected social media platforms.

**Request Body:**
```json
{
  "ad_ids": ["uuid1", "uuid2"],
  "platforms": ["instagram", "tiktok"],
  "schedule_time": "2024-01-15T10:00:00Z" // optional
}
```

**Response:**
```json
{
  "results": [
    {
      "ad_id": "uuid1",
      "platform": "instagram",
      "success": true,
      "post_id": "instagram_post_id",
      "url": "https://instagram.com/p/post_id"
    }
  ]
}
```

### Analytics

#### GET /analytics/overview
Get analytics overview for user's ads.

**Query Parameters:**
- `period` (optional): Time period (7d, 30d, 90d, 1y)
- `platform` (optional): Filter by platform

**Response:**
```json
{
  "total_views": 15420,
  "total_likes": 2341,
  "total_shares": 456,
  "total_clicks": 789,
  "engagement_rate": 12.5,
  "top_performing_ads": [...],
  "platform_breakdown": {
    "instagram": { "views": 8500, "engagement_rate": 14.2 },
    "tiktok": { "views": 6920, "engagement_rate": 10.8 }
  }
}
```

#### GET /analytics/ads/:id
Get detailed analytics for a specific ad.

#### GET /analytics/trends
Get trending content insights.

### Subscription Management

#### GET /subscription
Get current subscription details.

#### POST /subscription/checkout
Create Stripe checkout session for subscription upgrade.

**Request Body:**
```json
{
  "plan_id": "pro",
  "success_url": "https://app.adspin.ai/success",
  "cancel_url": "https://app.adspin.ai/cancel"
}
```

#### POST /subscription/portal
Create Stripe customer portal session.

#### GET /usage
Get current usage statistics.

**Response:**
```json
{
  "current_period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "usage": {
    "ad_generations": 15,
    "social_posts": 32
  },
  "limits": {
    "ad_generations": 50,
    "social_posts": 100
  }
}
```

## Webhooks

### Stripe Webhooks

#### POST /webhooks/stripe
Handle Stripe webhook events for subscription management.

**Events Handled:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Social Media Webhooks

#### POST /webhooks/instagram
Handle Instagram webhook events for performance data.

#### POST /webhooks/tiktok
Handle TikTok webhook events for performance data.

## Rate Limits

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1,000 requests per hour
- **Enterprise Tier**: 10,000 requests per hour

Rate limit headers are included in all responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

All errors follow a consistent format:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {
      "field": "email",
      "issue": "Email format is invalid"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing authentication
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `RATE_LIMITED` (429): Rate limit exceeded
- `VALIDATION_ERROR` (422): Request validation failed
- `INTERNAL_ERROR` (500): Server error

## SDKs and Libraries

### JavaScript/Node.js

```bash
npm install @adspin/api-client
```

```javascript
import { AdSpinAPI } from '@adspin/api-client'

const client = new AdSpinAPI({
  apiKey: 'your_api_key',
  baseURL: 'https://api.adspin.ai/v1'
})

// Generate ads
const ads = await client.ads.generate({
  image_url: 'https://example.com/product.jpg',
  product_type: 'fashion'
})

// Publish to social media
await client.social.publish({
  ad_ids: [ads[0].ad_id],
  platforms: ['instagram']
})
```

### Python

```bash
pip install adspin-api
```

```python
from adspin import AdSpinAPI

client = AdSpinAPI(api_key='your_api_key')

# Generate ads
ads = client.ads.generate(
    image_url='https://example.com/product.jpg',
    product_type='fashion'
)

# Get analytics
analytics = client.analytics.overview(period='30d')
```

## Integration Examples

### E-commerce Platform Integration

```javascript
// Shopify App Integration
app.post('/shopify/product-created', async (req, res) => {
  const product = req.body
  
  // Generate ads for new product
  const ads = await adspinClient.ads.generate({
    image_url: product.image.src,
    product_type: product.product_type,
    options: {
      num_variations: 3,
      platforms: ['instagram', 'tiktok']
    }
  })
  
  // Auto-publish best performing style
  await adspinClient.social.publish({
    ad_ids: [ads[0].ad_id],
    platforms: ['instagram']
  })
  
  res.json({ success: true, ads_generated: ads.length })
})
```

### Marketing Automation

```javascript
// Automated A/B Testing
const runAdTest = async (productId) => {
  // Generate multiple variations
  const ads = await adspinClient.ads.generate({
    image_url: `https://cdn.example.com/products/${productId}.jpg`,
    options: { num_variations: 5 }
  })
  
  // Publish all variations
  for (const ad of ads) {
    await adspinClient.social.publish({
      ad_ids: [ad.ad_id],
      platforms: ['instagram']
    })
  }
  
  // Check performance after 24 hours
  setTimeout(async () => {
    const analytics = await adspinClient.analytics.overview()
    const bestAd = analytics.top_performing_ads[0]
    
    // Scale the best performing ad
    await adspinClient.social.publish({
      ad_ids: [bestAd.ad_id],
      platforms: ['tiktok', 'facebook']
    })
  }, 24 * 60 * 60 * 1000)
}
```

## Support

- **Documentation**: https://docs.adspin.ai
- **API Status**: https://status.adspin.ai
- **Support Email**: api-support@adspin.ai
- **Discord Community**: https://discord.gg/adspin

## Changelog

### v1.2.0 (2024-01-15)
- Added TikTok integration
- Enhanced trend analysis
- Improved error handling

### v1.1.0 (2023-12-01)
- Added webhook support
- Instagram Reels support
- Performance optimizations

### v1.0.0 (2023-10-01)
- Initial API release
- Basic ad generation
- Instagram integration
