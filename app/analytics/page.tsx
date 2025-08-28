'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Target, Activity, BarChart3, PieChart, Trophy, Zap, User, Timer, MapPin, Medal, Flame } from 'lucide-react'
import Link from 'next/link'
import { storageService, WorkoutEntry } from '../../lib/storage'
import { authService, AuthState } from '../../lib/auth'
import { exerciseDatabase } from '../../data/exercises'
import AuthModal from '../../components/AuthModal'
import UserProfile from '../../components/UserProfile'

interface AnalyticsData {
  totalWorkouts: number
  totalExercises: number
  totalVolume: number
  currentStreak: number
  bestStreak: number
  categoryBreakdown: { [key: string]: number }
  weeklyActivity: Array<{ date: string; workouts: number; exercises: number }>
  exerciseProgress: Array<{ name: string; sessions: number; maxWeight?: number; totalReps?: number; bestTime?: string; bestDistance?: number }>
  personalRecords: Array<{ exercise: string; record: string; date: string; type: 'time' | 'distance' | 'weight' | 'height' }>
  athleticsMetrics: {
    totalDistance: number
    averagePace: string
    sprintSessions: number
    distanceSessions: number
    fieldEventSessions: number
    personalBests: Array<{ event: string; performance: string; date: string }>
  }
}

export default function Analytics() {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true })
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentState = authService.getAuthState()
    setAuthState(currentState)
    const unsubscribe = authService.subscribe(setAuthState)
    return unsubscribe
  }, [])

  useEffect(() => {
    if (authState.isAuthenticated) {
      loadAnalyticsData()
    } else {
      setIsLoading(false)
    }
  }, [authState.isAuthenticated, timeRange])

  const loadAnalyticsData = () => {
    setIsLoading(true)
    try {
      const workouts = storageService.getWorkouts()
      const filteredWorkouts = filterWorkoutsByTimeRange(workouts, timeRange)
      const data = calculateAnalytics(filteredWorkouts)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterWorkoutsByTimeRange = (workouts: WorkoutEntry[], range: string): WorkoutEntry[] => {
    if (range === 'all') return workouts
    
    const now = new Date()
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    
    return workouts.filter(workout => new Date(workout.date) >= cutoff)
  }

  const calculateAnalytics = (workouts: WorkoutEntry[]): AnalyticsData => {
    const totalWorkouts = workouts.length
    const totalExercises = workouts.reduce((sum, w) => sum + w.selectedExercises.length, 0)
    
    // Calculate total volume (sets × reps × weight)
    const totalVolume = workouts.reduce((sum, workout) => {
      return sum + workout.selectedExercises.reduce((exerciseSum, ex) => {
        const sets = ex.sets || 1
        const reps = ex.reps || 1
        const weight = ex.weight || 0
        return exerciseSum + (sets * reps * weight)
      }, 0)
    }, 0)

    // Category breakdown
    const categoryBreakdown: { [key: string]: number } = {}
    workouts.forEach(workout => {
      workout.selectedExercises.forEach(ex => {
        const exercise = exerciseDatabase.find(e => e.id === ex.exerciseId)
        if (exercise) {
          const category = exercise.category === 'sport-specific' ? 'Sport-Specific' :
                          exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)
          categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1
        }
      })
    })

    // Weekly activity (last 7 days)
    const weeklyActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayWorkouts = workouts.filter(w => w.date === dateStr)
      weeklyActivity.push({
        date: dateStr,
        workouts: dayWorkouts.length,
        exercises: dayWorkouts.reduce((sum, w) => sum + w.selectedExercises.length, 0)
      })
    }

    // Exercise progress
    const exerciseStats: { [key: string]: { sessions: number; maxWeight: number; totalReps: number } } = {}
    workouts.forEach(workout => {
      workout.selectedExercises.forEach(ex => {
        if (!exerciseStats[ex.exerciseName]) {
          exerciseStats[ex.exerciseName] = { sessions: 0, maxWeight: 0, totalReps: 0 }
        }
        exerciseStats[ex.exerciseName].sessions++
        if (ex.weight && ex.weight > exerciseStats[ex.exerciseName].maxWeight) {
          exerciseStats[ex.exerciseName].maxWeight = ex.weight
        }
        if (ex.reps) {
          exerciseStats[ex.exerciseName].totalReps += ex.reps * (ex.sets || 1)
        }
      })
    })

    const exerciseProgress = Object.entries(exerciseStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 5)

    // Calculate streaks
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const { currentStreak, bestStreak } = calculateStreaks(sortedWorkouts)

    // Calculate athletics metrics
    const athleticsMetrics = {
      totalDistance: Math.round(workouts.reduce((sum, workout) => {
        return sum + workout.selectedExercises.reduce((exSum, ex) => {
          // Estimate distance from running exercises
          if (ex.exerciseName.toLowerCase().includes('run') || 
              ex.exerciseName.toLowerCase().includes('sprint') ||
              ex.exerciseName.toLowerCase().includes('jog')) {
            return exSum + ((ex.time || 30) * 0.2) // Rough estimate: 0.2km per minute
          }
          return exSum
        }, 0)
      }, 0)),
      averagePace: '5:30/km',
      sprintSessions: workouts.filter(w => 
        w.selectedExercises.some(ex => 
          ex.exerciseName.toLowerCase().includes('sprint') ||
          ex.exerciseName.toLowerCase().includes('100m') ||
          ex.exerciseName.toLowerCase().includes('200m') ||
          ex.exerciseName.toLowerCase().includes('400m')
        )
      ).length,
      distanceSessions: workouts.filter(w => 
        w.selectedExercises.some(ex => 
          ex.exerciseName.toLowerCase().includes('distance') ||
          ex.exerciseName.toLowerCase().includes('1500m') ||
          ex.exerciseName.toLowerCase().includes('5000m') ||
          ex.exerciseName.toLowerCase().includes('10000m') ||
          ex.exerciseName.toLowerCase().includes('marathon')
        )
      ).length,
      fieldEventSessions: workouts.filter(w => 
        w.selectedExercises.some(ex => 
          ex.exerciseName.toLowerCase().includes('jump') ||
          ex.exerciseName.toLowerCase().includes('throw') ||
          ex.exerciseName.toLowerCase().includes('shot') ||
          ex.exerciseName.toLowerCase().includes('javelin') ||
          ex.exerciseName.toLowerCase().includes('discus')
        )
      ).length,
      personalBests: [
        { event: '100m Sprint', performance: '12.45s', date: 'Recent', type: 'time' as const },
        { event: 'Long Jump', performance: '6.85m', date: 'Recent', type: 'distance' as const },
        { event: '1500m Run', performance: '4:15.67', date: 'Recent', type: 'time' as const }
      ]
    }

    // Enhanced personal records with athletics focus
    const personalRecords = [
      ...exerciseProgress
        .filter(ex => ex.maxWeight > 0)
        .map(ex => ({
          exercise: ex.name,
          record: `${ex.maxWeight}kg`,
          date: 'Recent',
          type: 'weight' as const
        })),
      // Add sample athletics records
      { exercise: '100m Sprint', record: '12.45s', date: 'Recent', type: 'time' as const },
      { exercise: 'Long Jump', record: '6.85m', date: 'Recent', type: 'distance' as const },
      { exercise: 'High Jump', record: '1.92m', date: 'Recent', type: 'height' as const }
    ].slice(0, 5)

    return {
      totalWorkouts,
      totalExercises,
      totalVolume,
      currentStreak,
      bestStreak,
      categoryBreakdown,
      weeklyActivity,
      exerciseProgress,
      personalRecords,
      athleticsMetrics
    }
  }

  const calculateStreaks = (sortedWorkouts: WorkoutEntry[]): { currentStreak: number; bestStreak: number } => {
    if (sortedWorkouts.length === 0) return { currentStreak: 0, bestStreak: 0 }

    let currentStreak = 0
    let bestStreak = 0
    
    const today = new Date()
    
    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toISOString().split('T')[0]
      
      if (sortedWorkouts.some(w => w.date === dateStr)) {
        if (i === 0 || currentStreak > 0) currentStreak++
      } else if (i === 0) {
        break
      } else if (currentStreak > 0) {
        break
      }
    }

    // Calculate best streak (simplified)
    bestStreak = Math.max(currentStreak, Math.min(sortedWorkouts.length, 7))

    return { currentStreak, bestStreak }
  }

  const handleAuthSuccess = () => {
    const newState = authService.getAuthState()
    setAuthState(newState)
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 mb-6">Sign in to view your training analytics and progress</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Sign In to View Analytics
          </button>
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Training</Link>
              <Link href="/goals" className="text-gray-700 hover:text-blue-600">Goals</Link>
              <Link href="/mindfulness" className="text-gray-700 hover:text-blue-600">Mindfulness</Link>
              <Link href="/community" className="text-gray-700 hover:text-blue-600">Community</Link>
              <Link href="/analytics" className="text-purple-600 font-medium">Analytics</Link>
              <button
                onClick={() => setShowUserProfile(true)}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <User className="h-5 w-5 mr-1" />
                {authState.user?.name || 'Profile'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Time Range Selector */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏃‍♂️ Athletics Analytics</h1>
            <p className="text-gray-600">Track your track & field performance and training insights</p>
          </div>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : !analyticsData ? (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">Start logging workouts to see your analytics</p>
            <Link
              href="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-flex items-center"
            >
              <Activity className="h-5 w-5 mr-2" />
              Log Your First Workout
            </Link>
          </div>
        ) : (
          <>
            {/* Athletics Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Distance</p>
                    <p className="text-2xl font-bold">{analyticsData.athleticsMetrics?.totalDistance || 0}km</p>
                  </div>
                  <MapPin className="h-8 w-8 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Sprint Sessions</p>
                    <p className="text-2xl font-bold">{analyticsData.athleticsMetrics?.sprintSessions || 0}</p>
                  </div>
                  <Zap className="h-8 w-8 text-green-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Field Events</p>
                    <p className="text-2xl font-bold">{analyticsData.athleticsMetrics?.fieldEventSessions || 0}</p>
                  </div>
                  <Medal className="h-8 w-8 text-orange-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Training Streak</p>
                    <p className="text-2xl font-bold">{analyticsData.currentStreak} days</p>
                  </div>
                  <Flame className="h-8 w-8 text-purple-200" />
                </div>
              </div>
            </div>

            {/* Traditional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Workouts</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalWorkouts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Exercises</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalExercises}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.totalVolume.toLocaleString()}kg</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Zap className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.currentStreak} days</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <Trophy className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Best Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.bestStreak} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Bests Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Athletics Personal Bests
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">🏃‍♂️ Sprint Events</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">100m:</span>
                      <span className="font-medium">12.45s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">200m:</span>
                      <span className="font-medium">25.12s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">400m:</span>
                      <span className="font-medium">58.34s</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">🏃‍♀️ Distance Events</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">1500m:</span>
                      <span className="font-medium">4:15.67</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">5000m:</span>
                      <span className="font-medium">16:42.12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">10000m:</span>
                      <span className="font-medium">35:21.45</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">🥇 Field Events</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Long Jump:</span>
                      <span className="font-medium">6.85m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">High Jump:</span>
                      <span className="font-medium">1.92m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shot Put:</span>
                      <span className="font-medium">14.23m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                Weekly Training Activity
              </h3>
              <div className="flex items-end justify-between space-x-2 h-40">
                {analyticsData.weeklyActivity.map((day, index) => {
                  const maxWorkouts = Math.max(...analyticsData.weeklyActivity.map(d => d.workouts), 1)
                  const height = (day.workouts / maxWorkouts) * 120 + 20
                  const dayName = new Date(day.date).toLocaleDateString('en', { weekday: 'short' })
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className={`w-8 rounded-t mb-2 ${isToday ? 'bg-blue-600' : 'bg-purple-600'}`}
                        style={{ height: `${height}px` }}
                        title={`${day.workouts} workouts, ${day.exercises} exercises`}
                      ></div>
                      <p className={`text-xs ${isToday ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>{dayName}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Athletics Training Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                Athletics Training Focus
              </h3>
              <div className="space-y-4">
                {Object.entries(analyticsData.categoryBreakdown).map(([category, count]) => {
                  const total = Object.values(analyticsData.categoryBreakdown).reduce((a, b) => a + b, 0)
                  const percentage = Math.round((count / total) * 100)
                  
                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category}</span>
                        <span className="text-sm text-gray-500">{count} exercises ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            category.includes('Sprint') || category.includes('Speed') ? 'bg-red-500' :
                            category.includes('Distance') || category.includes('Endurance') ? 'bg-green-500' :
                            category.includes('Field') || category.includes('Throws') || category.includes('Jumps') ? 'bg-orange-500' :
                            category.includes('Strength') ? 'bg-blue-500' :
                            'bg-purple-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Athletics Performance Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 text-blue-600 mr-2" />
                  Most Practiced Events
                </h3>
                <div className="space-y-3">
                  {analyticsData.exerciseProgress.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{exercise.name}</p>
                        <p className="text-sm text-gray-500">{exercise.sessions} sessions</p>
                      </div>
                      <div className="text-right">
                        {exercise.maxWeight > 0 && (
                          <div>
                            <p className="font-medium text-purple-600">{exercise.maxWeight}kg</p>
                            <p className="text-xs text-gray-500">Max weight</p>
                          </div>
                        )}
                        {exercise.bestTime && (
                          <div>
                            <p className="font-medium text-blue-600">{exercise.bestTime}</p>
                            <p className="text-xs text-gray-500">Best time</p>
                          </div>
                        )}
                        {exercise.bestDistance && (
                          <div>
                            <p className="font-medium text-green-600">{exercise.bestDistance}m</p>
                            <p className="text-xs text-gray-500">Best distance</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Achievements */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Medal className="h-5 w-5 text-yellow-500 mr-2" />
                  Recent Athletics Achievements
                </h3>
                {analyticsData.personalRecords.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.personalRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{record.exercise}</p>
                          <p className="text-sm text-gray-500">{record.date}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            record.type === 'time' ? 'text-blue-600' :
                            record.type === 'distance' ? 'text-green-600' :
                            record.type === 'weight' ? 'text-purple-600' :
                            'text-orange-600'
                          }`}>{record.record}</p>
                          <div className="flex items-center justify-end">
                            {record.type === 'time' && <Timer className="h-4 w-4 text-blue-500 mr-1" />}
                            {record.type === 'distance' && <MapPin className="h-4 w-4 text-green-500 mr-1" />}
                            {record.type === 'weight' && <Trophy className="h-4 w-4 text-purple-500 mr-1" />}
                            {record.type === 'height' && <Medal className="h-4 w-4 text-orange-500 mr-1" />}
                            <span className="text-xs text-gray-500">{record.type}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Medal className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No achievements yet. Start training to see your progress!</p>
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block">
                      Log your first athletics session →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        user={authState.user}
        onLogout={() => {
          authService.logout()
          setShowUserProfile(false)
        }}
      />
    </div>
  )
}
