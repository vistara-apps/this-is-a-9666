import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react'
import { useAdGeneration } from '../contexts/AdGenerationContext'
import { useAuth } from '../contexts/AuthContext'
import SocialConnectButton from '../components/SocialConnectButton'

export default function Dashboard() {
  const { generatedAds } = useAdGeneration()
  const { user } = useAuth()

  const stats = [
    {
      name: 'Total Ads Generated',
      value: generatedAds.length,
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      name: 'Total Views',
      value: generatedAds.reduce((sum, ad) => sum + (ad.performanceMetrics?.views || 0), 0).toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      name: 'Engagement Rate',
      value: '12.5%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      name: 'Revenue Generated',
      value: '$2,847',
      icon: DollarSign,
      color: 'text-yellow-600'
    }
  ]

  const recentAds = generatedAds.slice(-4)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's your ad performance overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/generate"
          className="card hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">Generate New Ads</h3>
              <p className="text-gray-600">Upload a product image and create ad variations</p>
            </div>
          </div>
        </Link>

        <Link
          to="/analytics"
          className="card hover:shadow-lg transition-all group cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
              <BarChart3 className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text">View Analytics</h3>
              <p className="text-gray-600">Track performance of your ad campaigns</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-text mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gray-50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Account Connections */}
      <div className="card">
        <h3 className="text-lg font-semibold text-text mb-4">Social Media Connections</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SocialConnectButton platform="tiktok" />
          <SocialConnectButton platform="instagram" />
        </div>
      </div>

      {/* Recent Ads */}
      {recentAds.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-text">Recent Ad Variations</h3>
            <Link to="/analytics" className="text-primary hover:underline text-sm">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentAds.map((ad) => (
              <div key={ad.adId} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={ad.originalImage || '/api/placeholder/200/150'}
                  alt="Ad preview"
                  className="w-full h-24 object-cover rounded-md mb-3"
                />
                <p className="text-sm font-medium text-text mb-2 line-clamp-2">
                  {ad.generatedContent.copy}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{ad.generatedContent.platform}</span>
                  <span>{ad.performanceMetrics.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}