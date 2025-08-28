'use client'

import { useState, useEffect } from 'react'
import { Activity, Target, Users, BarChart3, Star, Calendar, Trophy, TrendingUp, MessageCircle, User, ArrowRight, Plus } from 'lucide-react'
import PWAInstallPrompt from '../components/PWAInstallPrompt'
import UserSelector from '../components/UserSelector'
import Link from 'next/link'
import { authService, AuthState } from '../lib/auth'
import { UserManager, UserProfile as UserProfileType } from '../lib/userManager'
import AuthModal from '../components/AuthModal'
import UserProfile from '../components/UserProfile'

export default function Home() {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfileType | null>(null)

  useEffect(() => {
    // Initialize auth state
    const currentState = authService.getAuthState()
    setAuthState(currentState)

    // Initialize user profile state
    const currentProfile = UserManager.getCurrentUser()
    setCurrentUserProfile(currentProfile)

    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const handleAuthSuccess = () => {
    const newState = authService.getAuthState()
    setAuthState(newState)
  }

  const handleUserSelected = (user: UserProfileType) => {
    setCurrentUserProfile(user)
    // Force re-render of components that depend on user data
    window.location.reload()
  }

  const handleLogout = () => {
    setAuthState({ user: null, isAuthenticated: false, isLoading: false })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* User Selector */}
              <UserSelector 
                onUserSelected={handleUserSelected}
                currentUser={currentUserProfile}
              />
              {!authState.isAuthenticated ? (
                <>
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => setShowUserProfile(true)}
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <User className="h-4 w-4 mr-1" />
                    {authState.user?.name || 'Profile'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Track Your Journey to
              <span className="text-blue-600 block">Athletic Excellence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The ultimate platform for athletes to log training, set goals, track progress, and connect with a community of champions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium flex items-center justify-center"
              >
                Start Training <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600">Powerful tools designed for serious athletes</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <Link href="/dashboard" className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Daily Training Log</h3>
              <p className="text-gray-600">Track workouts, mood, energy levels, and reflections every day</p>
            </Link>

            <Link href="/goals" className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Setting</h3>
              <p className="text-gray-600">Set and track season, monthly, weekly, and event-specific goals</p>
            </Link>

            <Link href="/mindfulness" className="text-center p-6 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mindfulness Journal</h3>
              <p className="text-gray-600">Strengthen your mental game with daily mindfulness and visualization</p>
            </Link>

            <Link href="/analytics" className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Analytics</h3>
              <p className="text-gray-600">Visualize your improvement with detailed charts and insights</p>
            </Link>

            <Link href="/community" className="text-center p-6 rounded-xl bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
              <div className="bg-red-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Connect with athletes, share wins, and get motivated together</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Preview Section */}
      {authState.isAuthenticated && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Training Hub</h2>
              <p className="text-xl text-gray-600">Quick access to your most important tools</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <Link href="/dashboard" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Session</h3>
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">Log your training session and reflections</p>
                <div className="text-sm text-blue-600 font-medium">Add Entry →</div>
              </Link>

              <Link href="/goals" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Goals Progress</h3>
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-gray-600 mb-4">3 of 5 weekly goals completed</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
                <div className="text-sm text-green-600 font-medium">View Details →</div>
              </Link>

              <Link href="/mindfulness" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Mindfulness Journal</h3>
                  <Star className="h-5 w-5 text-orange-600" />
                </div>
                <p className="text-gray-600 mb-4">Daily mindfulness and mental training</p>
                <div className="text-sm text-orange-600 font-medium">Open Journal →</div>
              </Link>

              <Link href="/analytics" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Progress Analytics</h3>
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="text-gray-600 mb-4">Track patterns and improvements</p>
                <div className="text-sm text-indigo-600 font-medium">View Analytics →</div>
              </Link>

              <Link href="/community" className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-4">12 new posts from your network</p>
                <div className="text-sm text-purple-600 font-medium">Join Discussion →</div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Trophy className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-2xl font-bold">TrackHQ</span>
          </div>
          <div className="text-center text-gray-400">
            <p>&copy; 2024 TrackHQ. Built for athletes, by athletes.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* User Profile Modal */}
      {authState.user && (
        <UserProfile 
          isOpen={showUserProfile}
          onClose={() => setShowUserProfile(false)}
          user={authState.user}
          onLogout={handleLogout}
        />
      )}
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}
