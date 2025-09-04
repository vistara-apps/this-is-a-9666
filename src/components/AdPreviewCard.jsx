import React from 'react'
import { Play, Eye, Heart, Share2, MousePointer } from 'lucide-react'

export default function AdPreviewCard({ ad, onSelect, isSelected }) {
  const { generatedContent, performanceMetrics, type } = ad

  return (
    <div
      className={`card cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={() => onSelect(ad.adId)}
    >
      <div className="space-y-4">
        {/* Preview Image/Video */}
        <div className="relative">
          <img
            src={ad.originalImage || '/api/placeholder/300/200'}
            alt="Ad preview"
            className="w-full h-40 object-cover rounded-md"
          />
          
          {type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
              <div className="p-3 bg-white/90 rounded-full">
                <Play className="w-6 h-6 text-gray-800" />
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              generatedContent.platform === 'tiktok'
                ? 'bg-black text-white'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            }`}>
              {generatedContent.platform === 'tiktok' ? 'TikTok' : 'Instagram'}
            </span>
          </div>
        </div>

        {/* Ad Content */}
        <div>
          <p className="text-sm font-medium text-text mb-2">
            {generatedContent.copy}
          </p>
          <p className="text-xs text-gray-500">
            Style: {generatedContent.visualStyle}
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Eye className="w-3 h-3 text-gray-400" />
            </div>
            <div className="text-xs font-medium text-text">
              {(performanceMetrics.views || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Views</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Heart className="w-3 h-3 text-gray-400" />
            </div>
            <div className="text-xs font-medium text-text">
              {(performanceMetrics.likes || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Likes</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Share2 className="w-3 h-3 text-gray-400" />
            </div>
            <div className="text-xs font-medium text-text">
              {(performanceMetrics.shares || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <MousePointer className="w-3 h-3 text-gray-400" />
            </div>
            <div className="text-xs font-medium text-text">
              {(performanceMetrics.clicks || 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
        </div>
      </div>
    </div>
  )
}