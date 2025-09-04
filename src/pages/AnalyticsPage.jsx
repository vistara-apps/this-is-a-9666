import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useAdGeneration } from '../contexts/AdGenerationContext'
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react'

export default function AnalyticsPage() {
  const { generatedAds } = useAdGeneration()

  // Mock analytics data
  const performanceData = [
    { name: 'Mon', views: 1200, likes: 180, shares: 45 },
    { name: 'Tue', views: 1900, likes: 280, shares: 65 },
    { name: 'Wed', views: 800, likes: 120, shares: 25 },
    { name: 'Thu', views: 2400, likes: 350, shares: 80 },
    { name: 'Fri', views: 3200, likes: 480, shares: 120 },
    { name: 'Sat', views: 2800, likes: 420, shares: 95 },
    { name: 'Sun', views: 2100, likes: 315, shares: 70 },
  ]

  const totalViews = generatedAds.reduce((sum, ad) => sum + (ad.performanceMetrics?.views || 0), 0)
  const totalLikes = generatedAds.reduce((sum, ad) => sum + (ad.performanceMetrics?.likes || 0), 0)
  const totalShares = generatedAds.reduce((sum, ad) => sum + (ad.performanceMetrics?.shares || 0), 0)

  const topPerformingAds = [...generatedAds]
    .sort((a, b) => (b.performanceMetrics?.views || 0) - (a.performanceMetrics?.views || 0))
    .slice(0, 5)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track the performance of your ad campaigns across platforms.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-text mt-1">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +12.5% from last week
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-text mt-1">
                {totalLikes.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +8.3% from last week
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Shares</p>
              <p className="text-2xl font-bold text-text mt-1">
                {totalShares.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 mt-1">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                +15.2% from last week
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text mb-6">Weekly Performance</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="likes" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="shares" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Ads */}
      {topPerformingAds.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-6">Top Performing Ads</h3>
          <div className="space-y-4">
            {topPerformingAds.map((ad, index) => (
              <div key={ad.adId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0">
                  <img
                    src={ad.originalImage || '/api/placeholder/100/100'}
                    alt="Ad preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">
                    {ad.generatedContent.copy}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ad.generatedContent.platform} • {ad.generatedContent.visualStyle}
                  </p>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-text">
                      {(ad.performanceMetrics.views || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Views</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-text">
                      {(ad.performanceMetrics.likes || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Likes</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm font-medium text-text">
                      {((ad.performanceMetrics.likes || 0) / (ad.performanceMetrics.views || 1) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Platform Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-black rounded-full"></div>
                <span className="text-sm text-text">TikTok</span>
              </div>
              <span className="text-sm font-medium text-text">
                {generatedAds.filter(ad => ad.generatedContent.platform === 'tiktok').length} ads
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <span className="text-sm text-text">Instagram</span>
              </div>
              <span className="text-sm font-medium text-text">
                {generatedAds.filter(ad => ad.generatedContent.platform === 'instagram').length} ads
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">Content Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Image Ads</span>
              <span className="text-sm font-medium text-text">
                {generatedAds.filter(ad => ad.type === 'image').length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Video Ads</span>
              <span className="text-sm font-medium text-text">
                {generatedAds.filter(ad => ad.type === 'video').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}