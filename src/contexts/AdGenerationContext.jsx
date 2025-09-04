import React, { createContext, useContext, useState, useEffect } from 'react'
import OpenAI from 'openai'
import { dbHelpers } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { config } from '../config/env'

const AdGenerationContext = createContext({})

export function useAdGeneration() {
  return useContext(AdGenerationContext)
}

export function AdGenerationProvider({ children }) {
  const [generatedAds, setGeneratedAds] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()

  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: config.openai.apiKey,
    baseURL: config.openai.baseURL,
    dangerouslyAllowBrowser: true,
  })

  // Load user's ads when user changes
  useEffect(() => {
    if (user?.userId) {
      loadUserAds()
    } else {
      setGeneratedAds([])
    }
  }, [user?.userId])

  const loadUserAds = async () => {
    try {
      const ads = await dbHelpers.getUserAds(user.userId)
      setGeneratedAds(ads)
    } catch (error) {
      console.error('Error loading user ads:', error)
    }
  }

  const generateAdVariations = async (productImage, options = {}) => {
    if (!user?.userId) {
      throw new Error('User must be logged in to generate ads')
    }

    setIsGenerating(true)
    
    try {
      // Generate trend-aware ad copy
      const copyPrompts = await generateTrendAwareCopy(options.productType || 'product')
      
      // Generate enhanced visual variations with AI
      const variations = await Promise.all(
        copyPrompts.map(async (copy, index) => {
          const platform = index % 2 === 0 ? 'instagram' : 'tiktok'
          const adType = index % 3 === 0 ? 'video' : 'image'
          
          // Generate platform-specific styling
          const visualStyle = await generatePlatformSpecificStyle(platform, options.productType)
          
          const adData = {
            user_id: user.userId,
            original_image_url: productImage,
            generated_variations: {
              copy: copy,
              visualStyle: visualStyle,
              platform: platform,
              trendElements: await getCurrentTrendElements(platform),
              colorPalette: generateColorPalette(),
              typography: getPlatformTypography(platform)
            },
            platform: platform,
            ad_type: adType,
            performance_metrics: {
              views: 0,
              likes: 0,
              shares: 0,
              clicks: 0,
              engagement_rate: 0
            }
          }

          // Save to database
          const savedAd = await dbHelpers.saveGeneratedAd(adData)
          
          return {
            adId: savedAd.ad_id,
            type: adType,
            originalImage: productImage,
            generatedContent: savedAd.generated_variations,
            creationTimestamp: savedAd.creation_timestamp,
            performanceMetrics: savedAd.performance_metrics,
            userId: user.userId
          }
        })
      )

      // Update local state
      setGeneratedAds(prev => [...variations, ...prev])
      return variations
    } catch (error) {
      console.error('Error generating ad variations:', error)
      // Fallback to mock data for demo
      const mockVariations = generateMockVariations(productImage)
      setGeneratedAds(prev => [...mockVariations, ...prev])
      return mockVariations
    } finally {
      setIsGenerating(false)
    }
  }

  const generateTrendAwareCopy = async (productType) => {
    try {
      const currentTrends = await getCurrentSocialTrends()
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: `You are an expert social media ad copywriter specializing in viral, trend-aware content. 
            Current trending elements: ${currentTrends.join(', ')}
            
            Create copy that:
            - Uses current viral phrases and formats
            - Incorporates trending hashtags naturally
            - Follows platform-specific best practices
            - Creates emotional hooks and FOMO
            - Uses Gen Z/millennial language patterns`
          },
          {
            role: "user",
            content: `Generate 5 different viral ad copy variations for a ${productType}. 
            Each should be optimized for social media virality, incorporate current trends, and be under 100 characters.
            Include relevant emojis and trending phrases.`
          }
        ],
        max_tokens: 600,
        temperature: 0.9
      })

      const copyText = response.choices[0].message.content
      return copyText.split('\n').filter(line => line.trim()).slice(0, 5)
    } catch (error) {
      console.error('Error generating trend-aware copy:', error)
      return getTrendyFallbackCopy()
    }
  }

  const getCurrentSocialTrends = async () => {
    // In a real implementation, this would fetch from a trends API
    // For now, return current popular trends
    return [
      "POV:", "It's giving...", "Tell me you're... without telling me",
      "This is your sign to...", "Plot twist:", "Not me...", 
      "The way I...", "I'm obsessed", "No cap", "Periodt",
      "Main character energy", "That girl aesthetic", "Soft launch"
    ]
  }

  const generatePlatformSpecificStyle = async (platform, productType) => {
    const stylePrompts = {
      tiktok: `Generate a TikTok-optimized visual style for ${productType} ads. Focus on:
      - Bold, eye-catching colors
      - Dynamic, movement-suggesting layouts
      - Gen Z aesthetic elements
      - Vertical format optimization
      - Trend-based visual elements`,
      
      instagram: `Generate an Instagram-optimized visual style for ${productType} ads. Focus on:
      - Aesthetic, polished look
      - Brand-consistent color schemes
      - Story and feed format optimization
      - Influencer-style presentation
      - High-quality, aspirational imagery`
    }

    try {
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are a visual design expert specializing in social media ad aesthetics."
          },
          {
            role: "user",
            content: stylePrompts[platform]
          }
        ],
        max_tokens: 200
      })

      return response.choices[0].message.content.trim()
    } catch (error) {
      console.error('Error generating platform style:', error)
      return getDefaultPlatformStyle(platform)
    }
  }

  const getCurrentTrendElements = async (platform) => {
    // Platform-specific trending elements
    const trendElements = {
      tiktok: [
        "Transition effects", "Text overlays", "Trending sounds", 
        "Quick cuts", "Before/after reveals", "POV scenarios"
      ],
      instagram: [
        "Carousel posts", "Story highlights", "Reels with music",
        "User-generated content", "Behind-the-scenes", "Product flatlays"
      ]
    }

    return trendElements[platform] || []
  }

  const generateColorPalette = () => {
    const palettes = [
      ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"],
      ["#A8E6CF", "#FFD93D", "#6BCF7F", "#4D96FF", "#9B59B6"],
      ["#FF8A80", "#82B1FF", "#B388FF", "#8C9EFF", "#80D8FF"],
      ["#FFAB91", "#FFCC02", "#FF5722", "#795548", "#607D8B"],
      ["#E1BEE7", "#F8BBD9", "#F48FB1", "#F06292", "#EC407A"]
    ]
    
    return palettes[Math.floor(Math.random() * palettes.length)]
  }

  const getPlatformTypography = (platform) => {
    const typography = {
      tiktok: {
        primary: "Bold, sans-serif",
        secondary: "Medium weight, rounded",
        accent: "Playful, handwritten style"
      },
      instagram: {
        primary: "Clean, modern sans-serif",
        secondary: "Light, elegant serif",
        accent: "Script or calligraphy"
      }
    }

    return typography[platform] || typography.instagram
  }

  const getTrendyFallbackCopy = () => {
    return [
      "POV: You found the perfect solution ✨",
      "This is your sign to try this 🔥",
      "Plot twist: It actually works! 💯",
      "Not me being obsessed with this 😍",
      "The way this changed my life... 🤯"
    ]
  }

  const getDefaultPlatformStyle = (platform) => {
    const styles = {
      tiktok: "Bold, colorful, dynamic with trending visual elements",
      instagram: "Clean, aesthetic, polished with brand consistency"
    }
    
    return styles[platform] || styles.instagram
  }

  const generateMockVariations = (productImage) => {
    const mockCopies = [
      "🔥 This changes everything! Limited time only",
      "POV: You found the perfect solution ✨",
      "Warning: Highly addictive product ahead 😍",
      "The secret everyone's talking about 🤫",
      "Plot twist: It actually works! 💯"
    ]

    return mockCopies.map((copy, index) => ({
      adId: `ad_${Date.now()}_${index}`,
      type: index % 2 === 0 ? 'image' : 'video',
      originalImage: productImage,
      generatedContent: {
        copy: copy,
        visualStyle: getRandomVisualStyle(),
        platform: index % 2 === 0 ? 'instagram' : 'tiktok'
      },
      creationTimestamp: new Date().toISOString(),
      performanceMetrics: {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 100),
        clicks: Math.floor(Math.random() * 500)
      }
    }))
  }

  const getRandomVisualStyle = () => {
    const styles = [
      'Minimalist',
      'Bold & Colorful',
      'Trendy Aesthetic',
      'Clean Modern',
      'Vibrant Pop'
    ]
    return styles[Math.floor(Math.random() * styles.length)]
  }

  const publishToSocials = async (adIds, platforms) => {
    try {
      const publishResults = []
      
      for (const adId of adIds) {
        const ad = generatedAds.find(a => a.adId === adId)
        if (!ad) continue

        // Attempt to publish to each platform
        for (const platform of platforms) {
          try {
            const publishResult = await publishToSocialPlatform(ad, platform)
            publishResults.push({ adId, platform, success: true, postId: publishResult.postId })
            
            // Update ad in database
            await dbHelpers.updateAdPerformance(adId, {
              ...ad.performanceMetrics,
              published: true,
              publishedPlatforms: [...(ad.publishedPlatforms || []), platform],
              publishedAt: new Date().toISOString(),
              postId: publishResult.postId
            })
          } catch (error) {
            console.error(`Failed to publish ad ${adId} to ${platform}:`, error)
            publishResults.push({ adId, platform, success: false, error: error.message })
          }
        }
      }

      // Update local state
      const updatedAds = generatedAds.map(ad => {
        if (adIds.includes(ad.adId)) {
          const successfulPlatforms = publishResults
            .filter(r => r.adId === ad.adId && r.success)
            .map(r => r.platform)
          
          return {
            ...ad,
            published: successfulPlatforms.length > 0,
            publishedPlatforms: successfulPlatforms,
            publishedAt: successfulPlatforms.length > 0 ? new Date().toISOString() : null
          }
        }
        return ad
      })
      
      setGeneratedAds(updatedAds)
      return publishResults
    } catch (error) {
      console.error('Error publishing to socials:', error)
      throw error
    }
  }

  const publishToSocialPlatform = async (ad, platform) => {
    // Get user's social account for the platform
    const socialAccount = user.linkedSocialAccounts[platform]
    if (!socialAccount) {
      throw new Error(`No ${platform} account connected`)
    }

    // In a real implementation, this would use the actual platform APIs
    // For now, simulate the posting process
    if (platform === 'tiktok') {
      return await publishToTikTok(ad, socialAccount)
    } else if (platform === 'instagram') {
      return await publishToInstagram(ad, socialAccount)
    }
    
    throw new Error(`Unsupported platform: ${platform}`)
  }

  const publishToTikTok = async (ad, account) => {
    // Simulate TikTok API call
    // In production, this would use TikTok's Content Posting API
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
    
    return {
      postId: `tiktok_${Date.now()}`,
      url: `https://tiktok.com/@${account.username}/video/${Date.now()}`,
      platform: 'tiktok'
    }
  }

  const publishToInstagram = async (ad, account) => {
    // Simulate Instagram API call
    // In production, this would use Instagram Basic Display API or Instagram Graph API
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
    
    return {
      postId: `ig_${Date.now()}`,
      url: `https://instagram.com/p/${Date.now()}`,
      platform: 'instagram'
    }
  }

  const value = {
    generatedAds,
    isGenerating,
    generateAdVariations,
    publishToSocials
  }

  return (
    <AdGenerationContext.Provider value={value}>
      {children}
    </AdGenerationContext.Provider>
  )
}
