// Environment configuration with fallbacks for build process
export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'placeholder-key',
    baseURL: "https://openrouter.ai/api/v1"
  },
  
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'
  },
  
  // Social Media API Keys
  social: {
    tiktok: {
      clientId: import.meta.env.VITE_TIKTOK_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_TIKTOK_CLIENT_SECRET || ''
    },
    instagram: {
      clientId: import.meta.env.VITE_INSTAGRAM_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_INSTAGRAM_CLIENT_SECRET || ''
    }
  },
  
  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'
  },
  
  // App Configuration
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001'
  }
}

// Validation function for runtime checks
export const validateConfig = () => {
  const requiredKeys = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const missing = requiredKeys.filter(key => !import.meta.env[key] || import.meta.env[key].includes('placeholder'))
  
  if (missing.length > 0 && import.meta.env.PROD) {
    console.warn('Missing required environment variables:', missing)
  }
  
  return missing.length === 0
}
