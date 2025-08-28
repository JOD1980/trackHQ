export interface UserProfile {
  id: string
  name: string
  email?: string
  avatar?: string
  createdAt: string
  preferences: {
    units: 'metric' | 'imperial'
    theme: 'light' | 'dark'
    notifications: boolean
  }
}

export class UserManager {
  private static readonly USERS_KEY = 'trackhq_users'
  private static readonly CURRENT_USER_KEY = 'trackhq_current_user'

  static getAllUsers(): UserProfile[] {
    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }

  static getCurrentUser(): UserProfile | null {
    try {
      const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY)
      if (!currentUserId) return null
      
      const users = this.getAllUsers()
      return users.find(user => user.id === currentUserId) || null
    } catch {
      return null
    }
  }

  static setCurrentUser(userId: string): boolean {
    const users = this.getAllUsers()
    const user = users.find(u => u.id === userId)
    
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, userId)
      return true
    }
    return false
  }

  static createUser(name: string, email?: string): UserProfile {
    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      createdAt: new Date().toISOString(),
      preferences: {
        units: 'metric',
        theme: 'light',
        notifications: true
      }
    }

    const users = this.getAllUsers()
    users.push(newUser)
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
    
    // Set as current user if it's the first user
    if (users.length === 1) {
      this.setCurrentUser(newUser.id)
    }

    return newUser
  }

  static updateUser(userId: string, updates: Partial<UserProfile>): boolean {
    const users = this.getAllUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    
    if (userIndex >= 0) {
      users[userIndex] = { ...users[userIndex], ...updates }
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      return true
    }
    return false
  }

  static deleteUser(userId: string): boolean {
    const users = this.getAllUsers()
    const filteredUsers = users.filter(u => u.id !== userId)
    
    if (filteredUsers.length !== users.length) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(filteredUsers))
      
      // Clear user-specific data
      this.clearUserData(userId)
      
      // If deleted user was current, switch to first available user
      const currentUserId = localStorage.getItem(this.CURRENT_USER_KEY)
      if (currentUserId === userId) {
        if (filteredUsers.length > 0) {
          this.setCurrentUser(filteredUsers[0].id)
        } else {
          localStorage.removeItem(this.CURRENT_USER_KEY)
        }
      }
      
      return true
    }
    return false
  }

  static clearUserData(userId: string): void {
    // Clear all user-specific localStorage data
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(`${userId}_`)) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }

  static getUserDataKey(userId: string, dataType: string): string {
    return `${userId}_${dataType}`
  }
}
