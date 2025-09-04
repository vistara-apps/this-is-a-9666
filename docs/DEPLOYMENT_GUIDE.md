# AdSpin AI Deployment Guide

This guide covers various deployment options for AdSpin AI, from development to production environments.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended for Frontend)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vistara-apps/adspin-ai)

**Steps:**
1. Click the deploy button above
2. Connect your GitHub account
3. Configure environment variables
4. Deploy!

**Environment Variables for Vercel:**
```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_TIKTOK_CLIENT_ID=your_tiktok_client_id
VITE_INSTAGRAM_CLIENT_ID=your_instagram_client_id
```

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/vistara-apps/adspin-ai)

**Steps:**
1. Click the deploy button
2. Connect your GitHub account
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Configure environment variables

### 3. Docker

```bash
# Clone the repository
git clone https://github.com/vistara-apps/adspin-ai.git
cd adspin-ai

# Build and run with Docker Compose
docker-compose up --build
```

## 🔧 Detailed Setup Instructions

### Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project set up
- [ ] OpenAI API key
- [ ] Stripe account configured
- [ ] Social media API credentials (Instagram, TikTok)
- [ ] Domain name (for production)

### 1. Supabase Setup

#### Create Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

#### Database Setup
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `database/schema.sql`
3. Run the SQL to create tables and policies

#### Authentication Setup
1. Go to Authentication > Settings
2. Configure your site URL: `https://yourdomain.com`
3. Add redirect URLs for social auth if needed

#### Storage Setup (Optional)
1. Go to Storage
2. Create a bucket named `ad-images`
3. Set appropriate policies for file uploads

### 2. OpenAI Configuration

1. Get API key from [OpenAI Platform](https://platform.openai.com)
2. Set usage limits and billing alerts
3. Consider using OpenRouter for better rates

### 3. Stripe Setup

#### Create Products
```bash
# Create products in Stripe Dashboard or via CLI
stripe products create --name="AdSpin AI Pro" --description="Pro subscription plan"
stripe prices create --product=prod_xxx --unit-amount=2900 --currency=usd --recurring[interval]=month
```

#### Webhook Configuration
1. Create webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
2. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### 4. Social Media API Setup

#### Instagram
1. Create Facebook Developer account
2. Create app and add Instagram Basic Display product
3. Configure OAuth redirect: `https://yourdomain.com/auth/instagram/callback`
4. Get Client ID and Client Secret

#### TikTok
1. Apply for TikTok for Developers
2. Create app with Content Posting API access
3. Configure OAuth redirect: `https://yourdomain.com/auth/tiktok/callback`
4. Get Client ID and Client Secret

## 🌐 Production Deployment

### Option 1: Vercel + Supabase (Recommended)

**Pros:**
- Serverless and scalable
- Built-in CDN and edge functions
- Easy CI/CD with GitHub
- Excellent performance

**Setup:**
1. Deploy frontend to Vercel
2. Use Supabase for backend
3. Configure custom domain
4. Set up monitoring

### Option 2: Docker + VPS

**Pros:**
- Full control over infrastructure
- Cost-effective for high traffic
- Can run additional services

**Setup:**
```bash
# On your VPS
git clone https://github.com/vistara-apps/adspin-ai.git
cd adspin-ai

# Create production environment file
cp .env.example .env.production
# Edit .env.production with your values

# Deploy with Docker Compose
docker-compose --profile production up -d
```

### Option 3: AWS/GCP/Azure

**Using AWS:**
1. Deploy to AWS Amplify or S3 + CloudFront
2. Use RDS for database (or keep Supabase)
3. Set up Lambda functions for API endpoints
4. Configure Route 53 for DNS

**Using GCP:**
1. Deploy to Firebase Hosting
2. Use Cloud Run for API services
3. Cloud SQL for database
4. Cloud CDN for static assets

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate API keys regularly
- Use secrets management in production

### HTTPS/SSL
- Always use HTTPS in production
- Configure SSL certificates (Let's Encrypt recommended)
- Set up HSTS headers
- Use secure cookies

### CORS Configuration
```javascript
// In your API configuration
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
}
```

### Rate Limiting
- Implement rate limiting on API endpoints
- Use Redis for distributed rate limiting
- Set up monitoring and alerts

## 📊 Monitoring and Analytics

### Application Monitoring
- Set up error tracking (Sentry recommended)
- Monitor performance metrics
- Set up uptime monitoring
- Configure log aggregation

### Business Metrics
- Track user signups and conversions
- Monitor subscription metrics
- Analyze ad generation usage
- Track social media posting success rates

### Example Monitoring Setup
```javascript
// Sentry configuration
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

## 🚀 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🔧 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Implement code splitting
- Optimize images and assets
- Use service workers for caching
- Implement lazy loading

### Backend Optimization
- Use database indexing
- Implement caching (Redis)
- Optimize API queries
- Use CDN for static assets
- Enable database connection pooling

### Example Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## 🧪 Testing in Production

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})
```

### Smoke Tests
```bash
#!/bin/bash
# smoke-test.sh
echo "Running smoke tests..."

# Test main page
curl -f https://yourdomain.com/ || exit 1

# Test API health
curl -f https://yourdomain.com/health || exit 1

# Test authentication
curl -f https://yourdomain.com/auth/health || exit 1

echo "All smoke tests passed!"
```

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all environment variables are set
- Clear npm cache: `npm cache clean --force`

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check network connectivity
- Ensure RLS policies are correct

**API Rate Limits:**
- Monitor OpenAI usage
- Implement request queuing
- Add retry logic with exponential backoff

**Social Media API Issues:**
- Check OAuth configuration
- Verify redirect URLs
- Monitor API rate limits

### Debugging Commands
```bash
# Check application logs
docker-compose logs -f adspin-frontend

# Check database connectivity
npx supabase status

# Test API endpoints
curl -X POST https://yourdomain.com/api/ads/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image_url": "test.jpg"}'
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Implement session storage (Redis)
- Use database read replicas
- Consider microservices architecture

### Vertical Scaling
- Monitor resource usage
- Optimize database queries
- Implement caching strategies
- Use CDN for static assets

### Cost Optimization
- Monitor usage and costs
- Implement auto-scaling
- Use spot instances where appropriate
- Optimize API usage

## 🔄 Backup and Recovery

### Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
```

### Disaster Recovery Plan
1. Regular automated backups
2. Test restore procedures
3. Document recovery steps
4. Monitor backup integrity
5. Have rollback procedures ready

---

## 📞 Support

If you encounter issues during deployment:

- 📧 Email: support@adspin.ai
- 💬 Discord: [Join our community](https://discord.gg/adspin)
- 📖 Documentation: [docs.adspin.ai](https://docs.adspin.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/vistara-apps/adspin-ai/issues)
