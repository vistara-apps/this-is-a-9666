import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const platformConfig = {
  tiktok: {
    name: 'TikTok',
    color: 'bg-black',
    icon: '🎵'
  },
  instagram: {
    name: 'Instagram',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    icon: '📷'
  }
}

export default function SocialConnectButton({ platform, className = '' }) {
  const { user, connectSocialAccount } = useAuth()
  const config = platformConfig[platform]
  const isConnected = user?.linkedSocialAccounts?.[platform]

  const handleConnect = () => {
    // Simulate OAuth connection
    const mockAccountData = {
      accountId: `${platform}_${Date.now()}`,
      username: `@user_${platform}`,
      accessToken: 'mock_access_token',
      refreshToken: 'mock_refresh_token'
    }
    
    connectSocialAccount(platform, mockAccountData)
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnected}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md font-medium transition-all ${
        isConnected
          ? 'bg-accent text-white cursor-default'
          : `${config.color} text-white hover:opacity-90`
      } ${className}`}
    >
      <span className="text-lg">{config.icon}</span>
      <span>
        {isConnected ? `Connected to ${config.name}` : `Connect ${config.name}`}
      </span>
      {isConnected && <span className="text-sm opacity-75">✓</span>}
    </button>
  )
}