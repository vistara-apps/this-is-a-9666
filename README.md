# AdSpin AI 🚀

> Generate and launch ad variations on social media in seconds with AI.

AdSpin AI is a cutting-edge web application that uses artificial intelligence to generate multiple ad creatives from a single product image and automates their posting to social media platforms for testing.

![AdSpin AI Dashboard](https://via.placeholder.com/800x400/6366f1/ffffff?text=AdSpin+AI+Dashboard)

## ✨ Features

### 🎨 AI-Powered Ad Creative Generation
- Upload a base product image and generate 3-5 distinct ad variations
- Different image compositions, text overlays, and basic video edits
- Tailored to current social media trends (TikTok, Instagram Reels)

### 📈 Trend-Adaptive Content Styling
- AI automatically applies popular aesthetic styles and visual elements
- Leverages current viral trends on platforms like TikTok and Instagram
- Ensures generated ads resonate with target audiences

### 🚀 One-Click Multi-Platform Posting
- Connect your TikTok and Instagram test accounts
- Post selected ad variations simultaneously across platforms
- Streamlined A/B testing process

### 📊 Basic Performance Tracking
- Simple dashboard with key engagement metrics
- Track views, likes, clicks for each ad variation
- Identify top-performing ad creatives quickly

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: OpenAI GPT-4 for content generation
- **Payments**: Stripe for subscription management
- **Social APIs**: Instagram Graph API, TikTok Content Posting API
- **Deployment**: Docker, Vercel/Netlify

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key
- Stripe account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/adspin-ai.git
   cd adspin-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # OpenAI Configuration
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Set up the database**
   
   Run the SQL schema in your Supabase dashboard:
   ```bash
   # Copy the contents of database/schema.sql and run in Supabase SQL editor
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📋 Project Structure

```
adspin-ai/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdPreviewCard.jsx
│   │   ├── ImageUploader.jsx
│   │   ├── SocialConnectButton.jsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx
│   │   └── AdGenerationContext.jsx
│   ├── lib/               # Utility libraries
│   │   ├── supabase.js
│   │   └── stripe.js
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── GenerationPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── SettingsPage.jsx
│   └── App.jsx
├── database/
│   └── schema.sql         # Database schema
├── docs/
│   └── API_DOCUMENTATION.md
├── public/
└── package.json
```

## 🎯 Usage

### 1. Sign Up & Connect Accounts
- Create an account or sign in
- Connect your TikTok and Instagram test accounts
- Choose your subscription plan

### 2. Generate Ad Variations
- Upload a product image
- Specify product type (optional)
- Select number of variations (3-7)
- Click "Generate Ad Variations"

### 3. Review & Select
- Preview all generated ad variations
- Each shows platform-specific styling and copy
- Select the ads you want to publish

### 4. Publish & Track
- Click "Publish Selected Ads"
- Ads are posted to connected social accounts
- Monitor performance in the Analytics dashboard

## 📊 Subscription Plans

### 🆓 Free Plan
- 5 ad generations per month
- Basic analytics
- Instagram posting
- Community support

### 💎 Pro Plan - $29/month
- Unlimited ad generations
- Advanced analytics
- Instagram & TikTok posting
- Trend analysis
- Priority support
- Custom branding

### 🏢 Enterprise Plan - $99/month
- Everything in Pro
- Team collaboration
- API access
- Custom integrations
- Dedicated account manager
- SLA guarantee

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database schema from `database/schema.sql`
3. Enable Row Level Security (RLS)
4. Configure authentication providers if needed

### OpenAI Setup

1. Get an API key from OpenAI
2. Add it to your environment variables
3. Configure rate limits based on your usage

### Stripe Setup

1. Create a Stripe account
2. Set up your products and pricing
3. Configure webhooks for subscription events
4. Add publishable key to environment variables

### Social Media APIs

#### Instagram
1. Create a Facebook Developer account
2. Set up Instagram Basic Display API
3. Configure OAuth redirect URLs
4. Implement webhook endpoints for performance data

#### TikTok
1. Apply for TikTok for Developers
2. Set up Content Posting API access
3. Configure OAuth flow
4. Implement webhook endpoints

## 🚀 Deployment

### Using Docker

```bash
# Build the image
docker build -t adspin-ai .

# Run the container
docker run -p 3000:3000 adspin-ai
```

### Using Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `VITE_OPENAI_API_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_TIKTOK_CLIENT_ID`
- `VITE_INSTAGRAM_CLIENT_ID`

## 📚 API Documentation

Comprehensive API documentation is available at [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

### Quick API Example

```javascript
// Generate ads
const response = await fetch('/api/ads/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/product.jpg',
    product_type: 'skincare',
    options: {
      num_variations: 5,
      platforms: ['instagram', 'tiktok']
    }
  })
})

const { ads } = await response.json()
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@adspin.ai
- 💬 **Discord**: [Join our community](https://discord.gg/adspin)
- 📖 **Documentation**: [docs.adspin.ai](https://docs.adspin.ai)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/vistara-apps/adspin-ai/issues)

## 🗺️ Roadmap

### Q1 2024
- [ ] Facebook Ads integration
- [ ] Advanced video generation
- [ ] Team collaboration features
- [ ] Mobile app (React Native)

### Q2 2024
- [ ] LinkedIn Ads support
- [ ] AI-powered A/B testing
- [ ] Advanced analytics dashboard
- [ ] White-label solutions

### Q3 2024
- [ ] YouTube Shorts integration
- [ ] Multi-language support
- [ ] Advanced automation workflows
- [ ] Enterprise SSO

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Supabase](https://supabase.com) for backend infrastructure
- [Stripe](https://stripe.com) for payment processing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons

---

<div align="center">
  <p>Made with ❤️ by the AdSpin AI team</p>
  <p>
    <a href="https://adspin.ai">Website</a> •
    <a href="https://docs.adspin.ai">Documentation</a> •
    <a href="https://discord.gg/adspin">Discord</a> •
    <a href="https://twitter.com/adspinai">Twitter</a>
  </p>
</div>
