'use client'

import { useState, useEffect } from 'react'
import { User, Plus, Settings, Trash2, LogOut } from 'lucide-react'
import { UserManager, UserProfile } from '../lib/userManager'

interface UserSelectorProps {
  onUserSelected: (user: UserProfile) => void
  currentUser: UserProfile | null
}

export default function UserSelector({ onUserSelected, currentUser }: UserSelectorProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = UserManager.getAllUsers()
    setUsers(allUsers)
    
    // If no users exist, show create user form
    if (allUsers.length === 0) {
      setShowCreateUser(true)
    }
  }

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName.trim()) return

    const newUser = UserManager.createUser(newUserName.trim(), newUserEmail.trim() || undefined)
    setUsers(prev => [...prev, newUser])
    onUserSelected(newUser)
    
    setNewUserName('')
    setNewUserEmail('')
    setShowCreateUser(false)
  }

  const handleUserSelect = (user: UserProfile) => {
    UserManager.setCurrentUser(user.id)
    onUserSelected(user)
    setShowUserMenu(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) {
      alert('Cannot delete the last user')
      return
    }
    
    if (confirm('Are you sure you want to delete this user and all their data?')) {
      UserManager.deleteUser(userId)
      loadUsers()
      
      // If deleted user was current, the UserManager will switch to another user
      const newCurrentUser = UserManager.getCurrentUser()
      if (newCurrentUser) {
        onUserSelected(newCurrentUser)
      }
    }
  }

  if (showCreateUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h2 className="text-xl font-bold mb-4">Create User Profile</h2>
          <form onSubmit={handleCreateUser}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Email (optional)</label>
              <input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Create Profile
              </button>
              {users.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Current User Display */}
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-sm font-medium">{currentUser?.name || 'Select User'}</span>
        <Settings className="h-4 w-4 text-gray-400" />
      </button>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-64">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Switch User</div>
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors ${
                  currentUser?.id === user.id ? 'bg-blue-50 border border-blue-200' : ''
                }`}
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{user.name}</div>
                  {user.email && <div className="text-xs text-gray-500">{user.email}</div>}
                </div>
                {users.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteUser(user.id)
                    }}
                    className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </button>
            ))}
            
            <hr className="my-2" />
            
            <button
              onClick={() => {
                setShowCreateUser(true)
                setShowUserMenu(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-blue-600"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Add New User</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
