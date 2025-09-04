import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table schemas based on PRD data model
export const TABLES = {
  USERS: 'users',
  GENERATED_ADS: 'generated_ads',
  SOCIAL_ACCOUNTS: 'social_accounts',
  SUBSCRIPTIONS: 'subscriptions'
}

// Helper functions for database operations
export const dbHelpers = {
  // User operations
  async createUser(userData) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from(TABLES.USERS)
      .update(updates)
      .eq('user_id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Generated ads operations
  async saveGeneratedAd(adData) {
    const { data, error } = await supabase
      .from(TABLES.GENERATED_ADS)
      .insert([adData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserAds(userId) {
    const { data, error } = await supabase
      .from(TABLES.GENERATED_ADS)
      .select('*')
      .eq('user_id', userId)
      .order('creation_timestamp', { ascending: false })
    
    if (error) throw error
    return data
  },

  async updateAdPerformance(adId, metrics) {
    const { data, error } = await supabase
      .from(TABLES.GENERATED_ADS)
      .update({ performance_metrics: metrics })
      .eq('ad_id', adId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Social accounts operations
  async saveSocialAccount(accountData) {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .upsert([accountData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserSocialAccounts(userId) {
    const { data, error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async deleteSocialAccount(accountId) {
    const { error } = await supabase
      .from(TABLES.SOCIAL_ACCOUNTS)
      .delete()
      .eq('account_id', accountId)
    
    if (error) throw error
    return true
  }
}
