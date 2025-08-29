'use client'

import { useState } from 'react'
import { Users, Plus, MessageCircle, TrendingUp, Calendar, Target, Eye, Shield, Settings } from 'lucide-react'
import Link from 'next/link'

export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('athletes')
  const [showAddAthlete, setShowAddAthlete] = useState(false)

  const athletes = [
    {
      id: 1,
      name: 'Sarah Martinez',
      avatar: 'SM',
      events: ['800m', '1500m'],
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      currentGoals: 2,
      completedWorkouts: 18,
      personalBests: {
        '800m': '2:05.4',
        '1500m': '4:32.1'
      },
      recentActivity: [
        { date: '2024-01-20', workout: '6x400m intervals', result: 'Avg 68s' },
        { date: '2024-01-18', workout: '800m time trial', result: '2:05.4 PB!' },
        { date: '2024-01-16', workout: 'Tempo run 3 miles', result: '6:45/mile pace' }
      ]
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      avatar: 'MJ',
      events: ['100m', '200m'],
      joinDate: '2024-01-10',
      lastActive: '5 hours ago',
      currentGoals: 3,
      completedWorkouts: 22,
      personalBests: {
        '100m': '10.89s',
        '200m': '22.15s'
      },
      recentActivity: [
        { date: '2024-01-20', workout: '6x60m blocks', result: 'Avg 7.1s' },
        { date: '2024-01-19', workout: 'Speed endurance 3x150m', result: 'Strong finish' },
        { date: '2024-01-17', workout: '100m time trial', result: '10.89s season best' }
      ]
    },
    {
      id: 3,
      name: 'Emma Chen',
      avatar: 'EC',
      events: ['Long Jump', 'Triple Jump'],
      joinDate: '2024-01-08',
      lastActive: '1 day ago',
      currentGoals: 1,
      completedWorkouts: 15,
      personalBests: {
        'Long Jump': '6.45m',
        'Triple Jump': '13.20m'
      },
      recentActivity: [
        { date: '2024-01-19', workout: 'Long jump technique', result: '6.45m PB' },
        { date: '2024-01-17', workout: 'Approach run practice', result: 'Consistent steps' },
        { date: '2024-01-15', workout: 'Triple jump drills', result: 'Phase work' }
      ]
    }
  ]

  const trainingPlans = [
    {
      id: 1,
      name: 'Sprint Development Program',
      athletes: 5,
      duration: '12 weeks',
      focus: 'Speed and Power',
      sessions: 36
    },
    {
      id: 2,
      name: 'Middle Distance Base Building',
      athletes: 3,
      duration: '16 weeks',
      focus: 'Aerobic Capacity',
      sessions: 48
    },
    {
      id: 3,
      name: 'Field Events Technique',
      athletes: 4,
      duration: '8 weeks',
      focus: 'Technical Skills',
      sessions: 24
    }
  ]

  const upcomingEvents = [
    {
      date: '2024-02-15',
      name: 'Regional Indoor Championships',
      location: 'State University',
      athletes: ['Sarah Martinez', 'Marcus Johnson']
    },
    {
      date: '2024-03-02',
      name: 'Spring Training Meet',
      location: 'City Track Complex',
      athletes: ['Emma Chen', 'Marcus Johnson']
    },
    {
      date: '2024-03-20',
      name: 'Conference Championships',
      location: 'Metro Stadium',
      athletes: ['Sarah Martinez', 'Emma Chen', 'Marcus Johnson']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
                <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Coach</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/coach" className="text-blue-600 font-medium">Coach Portal</Link>
              <Link href="/community" className="text-gray-700 hover:text-blue-600">Community</Link>
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600">Analytics</Link>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">CD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏃‍♂️ Coach Dashboard</h1>
            <p className="text-gray-600">Manage your athletes and track their progress</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddAthlete(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Athlete
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Athletes</p>
                <p className="text-2xl font-semibold text-gray-900">{athletes.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {athletes.reduce((sum, athlete) => sum + athlete.currentGoals, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Training Plans</p>
                <p className="text-2xl font-semibold text-gray-900">{trainingPlans.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-2xl font-semibold text-gray-900">{upcomingEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('athletes')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'athletes' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Athletes
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'plans' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Training Plans
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'events' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Upcoming Events
          </button>
        </div>

        {/* Add Athlete Modal */}
        {showAddAthlete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Athlete</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Athlete Email or Username</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="athlete@example.com or @username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Events</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select event category</option>
                    <option value="sprints">Sprints (100m, 200m, 400m)</option>
                    <option value="middle">Middle Distance (800m, 1500m)</option>
                    <option value="distance">Distance (5K, 10K, Marathon)</option>
                    <option value="hurdles">Hurdles</option>
                    <option value="jumps">Jumps (Long, High, Triple, Pole)</option>
                    <option value="throws">Throws (Shot, Discus, Javelin, Hammer)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personal Message (Optional)</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Welcome message to your new athlete..."
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddAthlete(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'athletes' && (
              <div className="space-y-6">
                {athletes.map((athlete) => (
                  <div key={athlete.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">{athlete.avatar}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{athlete.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Events: {athlete.events.join(', ')}</span>
                            <span>•</span>
                            <span>Joined: {new Date(athlete.joinDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Last active: {athlete.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{athlete.currentGoals}</div>
                        <div className="text-xs text-gray-500">Active Goals</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{athlete.completedWorkouts}</div>
                        <div className="text-xs text-gray-500">Workouts Completed</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-900">{Object.keys(athlete.personalBests).length}</div>
                        <div className="text-xs text-gray-500">Personal Bests</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Personal Bests */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">🏆 Personal Bests</h4>
                        <div className="space-y-1">
                          {Object.entries(athlete.personalBests).map(([event, time]) => (
                            <div key={event} className="flex justify-between text-sm">
                              <span className="text-gray-600">{event}</span>
                              <span className="font-mono font-semibold text-gray-900">{time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">📈 Recent Activity</h4>
                        <div className="space-y-2">
                          {athlete.recentActivity.slice(0, 3).map((activity, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">{activity.workout}</span>
                                <span className="text-xs text-gray-500">{activity.date}</span>
                              </div>
                              <div className="text-blue-600 font-medium">{activity.result}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'plans' && (
              <div className="space-y-6">
                {trainingPlans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-600">Focus: {plan.focus}</p>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                        Edit Plan
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{plan.athletes}</div>
                        <div className="text-xs text-gray-500">Athletes</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">{plan.duration}</div>
                        <div className="text-xs text-gray-500">Duration</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-900">{plan.sessions}</div>
                        <div className="text-xs text-gray-500">Sessions</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                        <p className="text-gray-600">{event.location}</p>
                        <p className="text-sm text-gray-500">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Competing Athletes</h4>
                      <div className="flex flex-wrap gap-2">
                        {event.athletes.map((athleteName, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {athleteName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Privacy Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-yellow-800">Privacy Protection</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You can only view training data and goals. Personal mindfulness entries remain private to each athlete.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">Create Training Plan</div>
                  <div className="text-sm text-gray-500">Design a new program</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">Schedule Team Meeting</div>
                  <div className="text-sm text-gray-500">Plan group session</div>
                </button>
                <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="font-medium text-gray-900">Send Group Message</div>
                  <div className="text-sm text-gray-500">Communicate with team</div>
                </button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 text-xs">SM</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah Martinez</p>
                    <p className="text-xs text-gray-500">New 800m PB: 2:05.4</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xs">MJ</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marcus Johnson</p>
                    <p className="text-xs text-gray-500">Consistent 7.1s 60m splits</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xs">EC</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Emma Chen</p>
                    <p className="text-xs text-gray-500">Long Jump PB: 6.45m</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
