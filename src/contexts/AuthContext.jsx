import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate auth check
    const storedUser = localStorage.getItem('adspin_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simulate login
    const mockUser = {
      userId: '1',
      email,
      subscriptionTier: 'pro',
      linkedSocialAccounts: {
        tiktok: null,
        instagram: null
      }
    }
    setUser(mockUser)
    localStorage.setItem('adspin_user', JSON.stringify(mockUser))
    return mockUser
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('adspin_user')
  }

  const connectSocialAccount = (platform, accountData) => {
    const updatedUser = {
      ...user,
      linkedSocialAccounts: {
        ...user.linkedSocialAccounts,
        [platform]: accountData
      }
    }
    setUser(updatedUser)
    localStorage.setItem('adspin_user', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    login,
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