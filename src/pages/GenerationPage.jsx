import React, { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'
import { useAdGeneration } from '../contexts/AdGenerationContext'
import { useAuth } from '../contexts/AuthContext'
import ImageUploader from '../components/ImageUploader'
import AdPreviewCard from '../components/AdPreviewCard'

export default function GenerationPage() {
  const [productImage, setProductImage] = useState(null)
  const [productType, setProductType] = useState('')
  const [selectedAds, setSelectedAds] = useState(new Set())
  const [generationOptions, setGenerationOptions] = useState({
    numVariations: 5,
    platforms: ['instagram', 'tiktok']
  })

  const { generateAdVariations, publishToSocials, isGenerating } = useAdGeneration()
  const { user } = useAuth()
  const [currentVariations, setCurrentVariations] = useState([])

  const handleGenerate = async () => {
    if (!productImage) return

    try {
      const variations = await generateAdVariations(productImage, {
        productType,
        ...generationOptions
      })
      setCurrentVariations(variations)
      setSelectedAds(new Set())
    } catch (error) {
      console.error('Generation failed:', error)
    }
  }

  const handleSelectAd = (adId) => {
    const newSelected = new Set(selectedAds)
    if (newSelected.has(adId)) {
      newSelected.delete(adId)
    } else {
      newSelected.add(adId)
    }
    setSelectedAds(newSelected)
  }

  const handlePublish = async () => {
    if (selectedAds.size === 0) return

    const platforms = []
    if (user?.linkedSocialAccounts?.tiktok) platforms.push('tiktok')
    if (user?.linkedSocialAccounts?.instagram) platforms.push('instagram')

    if (platforms.length === 0) {
      alert('Please connect your social media accounts first')
      return
    }

    try {
      await publishToSocials(Array.from(selectedAds), platforms)
      alert(`Successfully published ${selectedAds.size} ads!`)
      setSelectedAds(new Set())
    } catch (error) {
      console.error('Publishing failed:', error)
      alert('Failed to publish ads. Please try again.')
    }
  }

  const canPublish = user?.linkedSocialAccounts?.tiktok || user?.linkedSocialAccounts?.instagram

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Generate Ad Variations</h1>
        <p className="text-gray-600 mt-2">
          Upload your product image and let AI create engaging ad variations for social media.
        </p>
      </div>

      {/* Upload Section */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text mb-4">1. Upload Product Image</h3>
        <ImageUploader onImageUpload={setProductImage} />
      </div>

      {/* Configuration */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text mb-4">2. Configure Generation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Product Type (Optional)
            </label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="input"
              placeholder="e.g., skincare, electronics, fashion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Number of Variations
            </label>
            <select
              value={generationOptions.numVariations}
              onChange={(e) => setGenerationOptions({
                ...generationOptions,
                numVariations: parseInt(e.target.value)
              })}
              className="input"
            >
              <option value={3}>3 variations</option>
              <option value={5}>5 variations</option>
              <option value={7}>7 variations</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleGenerate}
            disabled={!productImage || isGenerating}
            className="btn-primary flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isGenerating ? 'Generating...' : 'Generate Ad Variations'}</span>
          </button>
        </div>
      </div>

      {/* Generated Variations */}
      {currentVariations.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">3. Select Ads to Publish</h3>
            <div className="text-sm text-gray-600">
              {selectedAds.size} of {currentVariations.length} selected
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {currentVariations.map((ad) => (
              <AdPreviewCard
                key={ad.adId}
                ad={ad}
                onSelect={handleSelectAd}
                isSelected={selectedAds.has(ad.adId)}
              />
            ))}
          </div>

          {selectedAds.size > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {!canPublish && (
                  <span className="text-red-500">
                    Connect your social media accounts to publish
                  </span>
                )}
              </div>

              <button
                onClick={handlePublish}
                disabled={!canPublish || selectedAds.size === 0}
                className="btn-primary flex items-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Publish Selected Ads</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Account Connection Reminder */}
      {!canPublish && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h4 className="font-medium text-text">Connect Your Social Accounts</h4>
              <p className="text-sm text-gray-600 mt-1">
                To publish ads directly, connect your TikTok and Instagram accounts from the dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}