// Authentication service for TrackHQ
// Simple implementation that can be extended with Firebase/Supabase later

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin: string
  preferences: {
    units: 'metric' | 'imperial'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

class AuthService {
  private readonly AUTH_KEY = 'trackhq_auth'
  private readonly USERS_KEY = 'trackhq_users'
  private listeners: ((state: AuthState) => void)[] = []

  // Get current auth state
  getAuthState(): AuthState {
    try {
      const authData = localStorage.getItem(this.AUTH_KEY)
      if (authData) {
        const user = JSON.parse(authData)
        return {
          user,
          isAuthenticated: true,
          isLoading: false
        }
      }
    } catch (error) {
      console.error('Failed to get auth state:', error)
    }
    
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false
    }
  }

  // Subscribe to auth state changes
  subscribe(callback: (state: AuthState) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback)
    }
  }

  // Notify all listeners of auth state changes
  private notifyListeners() {
    const state = this.getAuthState()
    this.listeners.forEach(listener => listener(state))
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate input
      if (!email || !password || !name) {
        return { success: false, error: 'All fields are required' }
      }

      if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' }
      }

      // Check if user already exists
      const existingUsers = this.getUsers()
      if (existingUsers.find(u => u.email === email)) {
        return { success: false, error: 'User with this email already exists' }
      }

      // Create new user
      const user: User = {
        id: this.generateId(),
        email,
        name,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        preferences: {
          units: 'metric',
          theme: 'light',
          notifications: true
        }
      }

      // Save user to users list
      const users = [...existingUsers, user]
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))

      // Save hashed password (simple implementation)
      const userAuth = {
        userId: user.id,
        email,
        passwordHash: this.hashPassword(password)
      }
      const authList = this.getAuthList()
      authList.push(userAuth)
      localStorage.setItem('trackhq_auth_list', JSON.stringify(authList))

      // Set current user
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user))
      this.notifyListeners()

      return { success: true }
    } catch (error) {
      console.error('Registration failed:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!email || !password) {
        return { success: false, error: 'Email and password are required' }
      }

      // Find user credentials
      const authList = this.getAuthList()
      const userAuth = authList.find(auth => auth.email === email)
      
      if (!userAuth) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Verify password
      const passwordHash = this.hashPassword(password)
      if (userAuth.passwordHash !== passwordHash) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Get user data
      const users = this.getUsers()
      const user = users.find(u => u.id === userAuth.userId)
      
      if (!user) {
        return { success: false, error: 'User data not found' }
      }

      // Update last login
      user.lastLogin = new Date().toISOString()
      const updatedUsers = users.map(u => u.id === user.id ? user : u)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers))

      // Set current user
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(user))
      this.notifyListeners()

      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: 'Login failed. Please try again.' }
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      localStorage.removeItem(this.AUTH_KEY)
      this.notifyListeners()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<Pick<User, 'name' | 'preferences'>>): Promise<{ success: boolean; error?: string }> {
    try {
      const currentState = this.getAuthState()
      if (!currentState.isAuthenticated || !currentState.user) {
        return { success: false, error: 'Not authenticated' }
      }

      const updatedUser = { ...currentState.user, ...updates }
      
      // Update in users list
      const users = this.getUsers()
      const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(updatedUsers))

      // Update current user
      localStorage.setItem(this.AUTH_KEY, JSON.stringify(updatedUser))
      this.notifyListeners()

      return { success: true }
    } catch (error) {
      console.error('Profile update failed:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentState = this.getAuthState()
      if (!currentState.isAuthenticated || !currentState.user) {
        return { success: false, error: 'Not authenticated' }
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters' }
      }

      // Verify current password
      const authList = this.getAuthList()
      const userAuth = authList.find(auth => auth.email === currentState.user!.email)
      
      if (!userAuth || userAuth.passwordHash !== this.hashPassword(currentPassword)) {
        return { success: false, error: 'Current password is incorrect' }
      }

      // Update password
      const updatedAuthList = authList.map(auth => 
        auth.userId === currentState.user!.id 
          ? { ...auth, passwordHash: this.hashPassword(newPassword) }
          : auth
      )
      localStorage.setItem('trackhq_auth_list', JSON.stringify(updatedAuthList))

      return { success: true }
    } catch (error) {
      console.error('Password change failed:', error)
      return { success: false, error: 'Failed to change password' }
    }
  }

  // Helper methods
  private getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get users:', error)
      return []
    }
  }

  private getAuthList(): Array<{ userId: string; email: string; passwordHash: string }> {
    try {
      const data = localStorage.getItem('trackhq_auth_list')
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Failed to get auth list:', error)
      return []
    }
  }

  private hashPassword(password: string): string {
    // Simple hash implementation - in production, use proper bcrypt or similar
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString()
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Data migration helpers for moving from localStorage to user-specific storage
  async migrateLocalData(): Promise<void> {
    const currentState = this.getAuthState()
    if (!currentState.isAuthenticated || !currentState.user) return

    try {
      // Get existing local data
      const workouts = localStorage.getItem('trackhq_workouts')
      const templates = localStorage.getItem('trackhq_templates')
      const preferences = localStorage.getItem('trackhq_user_prefs')

      // Move to user-specific keys
      const userId = currentState.user.id
      if (workouts) {
        localStorage.setItem(`trackhq_workouts_${userId}`, workouts)
        localStorage.removeItem('trackhq_workouts')
      }
      if (templates) {
        localStorage.setItem(`trackhq_templates_${userId}`, templates)
        localStorage.removeItem('trackhq_templates')
      }
      if (preferences) {
        localStorage.setItem(`trackhq_user_prefs_${userId}`, preferences)
        localStorage.removeItem('trackhq_user_prefs')
      }
    } catch (error) {
      console.error('Data migration failed:', error)
    }
  }

  // Get user-specific storage keys
  getUserStorageKeys(userId?: string): { workouts: string; templates: string; preferences: string } {
    const currentUserId = userId || this.getAuthState().user?.id
    if (!currentUserId) {
      // Fallback to global keys for non-authenticated users
      return {
        workouts: 'trackhq_workouts',
        templates: 'trackhq_templates',
        preferences: 'trackhq_user_prefs'
      }
    }

    return {
      workouts: `trackhq_workouts_${currentUserId}`,
      templates: `trackhq_templates_${currentUserId}`,
      preferences: `trackhq_user_prefs_${currentUserId}`
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
