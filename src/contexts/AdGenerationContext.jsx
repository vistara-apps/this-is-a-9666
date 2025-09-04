import React, { createContext, useContext, useState } from 'react'
import OpenAI from 'openai'

const AdGenerationContext = createContext({})

export function useAdGeneration() {
  return useContext(AdGenerationContext)
}

export function AdGenerationProvider({ children }) {
  const [generatedAds, setGeneratedAds] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Initialize OpenAI (you'll need to add your API key)
  const openai = new OpenAI({
    apiKey: process.env.VITE_OPENAI_API_KEY || 'your-api-key-here',
    baseURL: "https://openrouter.ai/api/v1",
    dangerouslyAllowBrowser: true,
  })

  const generateAdVariations = async (productImage, options = {}) => {
    setIsGenerating(true)
    
    try {
      // Generate ad copy variations
      const copyPrompts = await generateAdCopy(options.productType || 'product')
      
      // Generate visual variations (simulated)
      const variations = await Promise.all(
        copyPrompts.map(async (copy, index) => ({
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
            views: 0,
            likes: 0,
            shares: 0,
            clicks: 0
          }
        }))
      )

      setGeneratedAds(prev => [...prev, ...variations])
      return variations
    } catch (error) {
      console.error('Error generating ad variations:', error)
      // Return mock data for demo
      return generateMockVariations(productImage)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateAdCopy = async (productType) => {
    try {
      const response = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: "You are an expert social media ad copywriter. Generate engaging, trend-aware ad copy for different platforms."
          },
          {
            role: "user",
            content: `Generate 5 different ad copy variations for a ${productType}. Each should be optimized for social media (Instagram/TikTok), be engaging, and follow current trends. Keep them under 100 characters each.`
          }
        ],
        max_tokens: 500
      })

      const copyText = response.choices[0].message.content
      return copyText.split('\n').filter(line => line.trim()).slice(0, 5)
    } catch (error) {
      console.error('Error generating copy:', error)
      return [
        "🔥 This changes everything! Limited time only",
        "POV: You found the perfect solution ✨",
        "Warning: Highly addictive product ahead 😍",
        "The secret everyone's talking about 🤫",
        "Plot twist: It actually works! 💯"
      ]
    }
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
    // Simulate posting to social platforms
    const updatedAds = generatedAds.map(ad => {
      if (adIds.includes(ad.adId)) {
        return {
          ...ad,
          published: true,
          publishedPlatforms: platforms,
          publishedAt: new Date().toISOString()
        }
      }
      return ad
    })
    
    setGeneratedAds(updatedAds)
    return true
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