'use client'

import { useState, useEffect } from 'react'
import { User, Settings, LogOut, Edit, Save, X, Download } from 'lucide-react'
import { authService, User as UserType } from '../lib/auth'
import DataExport from './DataExport'

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
  user: UserType | null
  onLogout: () => void
}

export default function UserProfile({ isOpen, onClose, user, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || '',
    units: user?.preferences?.units || 'metric',
    theme: user?.preferences?.theme || 'light',
    notifications: user?.preferences?.notifications ?? true
  })
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showDataExport, setShowDataExport] = useState(false)

  useEffect(() => {
    if (isOpen && user) {
      setEditData({
        name: user.name || '',
        units: user.preferences?.units || 'metric',
        theme: user.preferences?.theme || 'light',
        notifications: user?.preferences?.notifications ?? true
      })
      setMessage(null)
    }
  }, [isOpen, user])

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const result = await authService.updateProfile({
        name: editData.name,
        preferences: {
          units: editData.units,
          theme: editData.theme,
          notifications: editData.notifications
        }
      })

      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        setIsEditing(false)
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (passwordData.new.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const result = await authService.changePassword(passwordData.current, passwordData.new)

      if (result.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setShowPasswordChange(false)
        setPasswordData({ current: '', new: '', confirm: '' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await authService.logout()
      onLogout()
      onClose()
    }
  }

  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          {/* Profile Form */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Display Name
                </label>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units
              </label>
              {isEditing ? (
                <select
                  value={editData.units}
                  onChange={(e) => setEditData({ ...editData, units: e.target.value as 'metric' | 'imperial' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="metric">Metric (kg, km)</option>
                  <option value="imperial">Imperial (lbs, miles)</option>
                </select>
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {user.preferences.units === 'metric' ? 'Metric (kg, km)' : 'Imperial (lbs, miles)'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              {isEditing ? (
                <select
                  value={editData.theme}
                  onChange={(e) => setEditData({ ...editData, theme: e.target.value as 'light' | 'dark' })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg capitalize">{user.preferences.theme}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notifications
              </label>
              {isEditing ? (
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.notifications}
                    onChange={(e) => setEditData({ ...editData, notifications: e.target.checked })}
                    className="mr-3"
                  />
                  <span>Enable notifications</span>
                </label>
              ) : (
                <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {user?.preferences?.notifications ? 'Enabled' : 'Disabled'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Data Export Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDataExport(true)}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between mb-2"
            >
              <span className="font-medium text-gray-900">Backup & Export Data</span>
              <Download className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Password Change Section */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <span className="font-medium text-gray-900">Change Password</span>
              <Settings className="h-5 w-5 text-gray-400" />
            </button>

            {showPasswordChange && (
              <div className="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowPasswordChange(false)
                      setPasswordData({ current: '', new: '', confirm: '' })
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={isLoading || !passwordData.current || !passwordData.new || !passwordData.confirm}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center justify-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Data Export Modal */}
      <DataExport 
        isOpen={showDataExport}
        onClose={() => setShowDataExport(false)}
      />
    </div>
  )
}
