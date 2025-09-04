import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, dbHelpers } from '../lib/supabase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setUser(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId) => {
    try {
      const userData = await dbHelpers.getUserById(userId)
      const socialAccounts = await dbHelpers.getUserSocialAccounts(userId)
      
      const linkedSocialAccounts = {}
      socialAccounts.forEach(account => {
        linkedSocialAccounts[account.platform] = {
          accountId: account.account_id,
          username: account.username,
          isActive: account.is_active
        }
      })

      setUser({
        userId: userData.user_id,
        email: userData.email,
        subscriptionTier: userData.subscription_tier,
        linkedSocialAccounts,
        profileData: userData.profile_data
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
      // If user doesn't exist in our database, create them
      if (error.message?.includes('No rows')) {
        await createUserProfile(userId)
      }
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async (userId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const userData = await dbHelpers.createUser({
          user_id: userId,
          email: authUser.email,
          subscription_tier: 'free'
        })
        
        setUser({
          userId: userData.user_id,
          email: userData.email,
          subscriptionTier: userData.subscription_tier,
          linkedSocialAccounts: {},
          profileData: userData.profile_data
        })
      }
    } catch (error) {
      console.error('Error creating user profile:', error)
    }
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data.user
  }

  const signup = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return data.user
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  const connectSocialAccount = async (platform, accountData) => {
    try {
      const socialAccountData = {
        user_id: user.userId,
        platform,
        platform_user_id: accountData.platformUserId,
        username: accountData.username,
        access_token: accountData.accessToken,
        refresh_token: accountData.refreshToken,
        account_data: accountData.additionalData || {}
      }

      await dbHelpers.saveSocialAccount(socialAccountData)
      
      // Update local user state
      const updatedUser = {
        ...user,
        linkedSocialAccounts: {
          ...user.linkedSocialAccounts,
          [platform]: {
            accountId: socialAccountData.account_id,
            username: accountData.username,
            isActive: true
          }
        }
      }
      setUser(updatedUser)
      return true
    } catch (error) {
      console.error('Error connecting social account:', error)
      throw error
    }
  }

  const value = {
    user,
    login,
    signup,
    logout,
    connectSocialAccount,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
