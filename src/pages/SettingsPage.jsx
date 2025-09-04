import React, { useState, useEffect } from 'react'
import { Crown, CreditCard, User, Bell, Shield, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { stripeService, SUBSCRIPTION_PLANS, usageHelpers } from '../lib/stripe'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [usage, setUsage] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.userId) {
      loadUsageData()
    }
  }, [user?.userId])

  const loadUsageData = async () => {
    try {
      const adGenerationUsage = await usageHelpers.getUserUsage(user.userId, 'adGenerations')
      const socialPostUsage = await usageHelpers.getUserUsage(user.userId, 'socialPosts')
      
      setUsage({
        adGenerations: adGenerationUsage.count || 0,
        socialPosts: socialPostUsage.count || 0
      })
    } catch (error) {
      console.error('Error loading usage data:', error)
    }
  }

  const handleUpgrade = async (planId) => {
    setLoading(true)
    try {
      await stripeService.createCheckoutSession(planId, user.userId, user.email)
    } catch (error) {
      console.error('Error upgrading subscription:', error)
      alert('Failed to start upgrade process. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      // In a real implementation, you'd get the customer ID from your database
      await stripeService.createPortalSession('cus_customer_id')
    } catch (error) {
      console.error('Error opening customer portal:', error)
      alert('Failed to open subscription management. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const currentPlan = stripeService.getPlanByTier(user?.subscriptionTier || 'free')
  const remainingGenerations = stripeService.getRemainingUsage(
    user?.subscriptionTier || 'free', 
    'adGenerations', 
    usage.adGenerations
  )

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'subscription', name: 'Subscription', icon: Crown },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card space-y-6">
              <h3 className="text-lg font-semibold text-text">Profile Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input bg-gray-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Subscription Tier
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentPlan.id === 'free' 
                        ? 'bg-gray-100 text-gray-800'
                        : currentPlan.id === 'pro'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {currentPlan.name}
                    </span>
                    {currentPlan.id !== 'free' && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={logout}
                  className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-6">
              {/* Current Plan */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text">Current Plan</h3>
                  {currentPlan.id !== 'free' && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={loading}
                      className="btn-secondary"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Manage Subscription
                    </button>
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`p-2 rounded-lg ${
                      currentPlan.id === 'free' 
                        ? 'bg-gray-200'
                        : currentPlan.id === 'pro'
                        ? 'bg-blue-100'
                        : 'bg-purple-100'
                    }`}>
                      <Crown className={`w-6 h-6 ${
                        currentPlan.id === 'free' 
                          ? 'text-gray-600'
                          : currentPlan.id === 'pro'
                          ? 'text-blue-600'
                          : 'text-purple-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-text">{currentPlan.name}</h4>
                      <p className="text-gray-600">
                        {currentPlan.price === 0 
                          ? 'Free forever' 
                          : `${stripeService.formatPrice(currentPlan.price)}/${currentPlan.interval}`
                        }
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ad Generations</span>
                      <span className="text-sm font-medium text-text">
                        {remainingGenerations === -1 
                          ? 'Unlimited' 
                          : `${usage.adGenerations || 0} / ${currentPlan.limits.adGenerations}`
                        }
                      </span>
                    </div>
                    
                    {remainingGenerations !== -1 && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, (usage.adGenerations / currentPlan.limits.adGenerations) * 100)}%` 
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Available Plans */}
              <div className="card">
                <h3 className="text-lg font-semibold text-text mb-6">Available Plans</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                    <div
                      key={plan.id}
                      className={`border rounded-lg p-6 ${
                        plan.id === currentPlan.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-semibold text-text">{plan.name}</h4>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-text">
                            {plan.price === 0 ? 'Free' : stripeService.formatPrice(plan.price)}
                          </span>
                          {plan.price > 0 && (
                            <span className="text-gray-600">/{plan.interval}</span>
                          )}
                        </div>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Zap className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {plan.id === currentPlan.id ? (
                        <button disabled className="w-full btn-secondary opacity-50">
                          Current Plan
                        </button>
                      ) : plan.id === 'free' ? (
                        <button disabled className="w-full btn-secondary opacity-50">
                          Downgrade via Support
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan.id)}
                          disabled={loading}
                          className="w-full btn-primary"
                        >
                          {loading ? 'Processing...' : 'Upgrade'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card space-y-6">
              <h3 className="text-lg font-semibold text-text">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Email Notifications</h4>
                    <p className="text-sm text-gray-600">Receive updates about your campaigns</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Performance Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified when ads perform well</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text">Usage Warnings</h4>
                    <p className="text-sm text-gray-600">Alert when approaching plan limits</p>
                  </div>
                  <input type="checkbox" className="toggle" defaultChecked />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card space-y-6">
              <h3 className="text-lg font-semibold text-text">Security Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-text mb-2">Change Password</h4>
                  <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="input"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="input"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="input"
                    />
                    <button className="btn-primary">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-text mb-2">Connected Accounts</h4>
                  <div className="space-y-3">
                    {Object.entries(user?.linkedSocialAccounts || {}).map(([platform, account]) => (
                      <div key={platform} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            platform === 'tiktok' ? 'bg-black' : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            <span className="text-white text-sm">
                              {platform === 'tiktok' ? '🎵' : '📷'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text capitalize">{platform}</p>
                            <p className="text-sm text-gray-600">
                              {account ? `Connected as ${account.username}` : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <button className="btn-secondary text-sm">
                          {account ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
