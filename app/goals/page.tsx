'use client'

import { useState } from 'react'
import { Target, Plus, Calendar, TrendingUp, CheckCircle, Clock, Trophy } from 'lucide-react'
import Link from 'next/link'

export default function Goals() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    type: 'weekly',
    target: '',
    deadline: '',
    description: ''
  })

  const goals = {
    season: [
      {
        id: 1,
        title: 'Sub-12 Second 100m Sprint',
        target: '11.99s',
        current: '12.34s',
        progress: 68,
        deadline: '2024-08-15',
        status: 'active',
        category: 'sprints',
        icon: '⚡',
        milestones: [
          { time: '12.20s', achieved: true, date: '2024-01-05' },
          { time: '12.10s', achieved: false, target: '2024-02-15' },
          { time: '12.00s', achieved: false, target: '2024-04-01' },
          { time: '11.99s', achieved: false, target: '2024-08-15' }
        ]
      },
      {
        id: 2,
        title: 'Long Jump 7.00m Personal Best',
        target: '7.00m',
        current: '6.45m',
        progress: 45,
        deadline: '2024-07-20',
        status: 'active',
        category: 'field',
        icon: '🦘',
        milestones: [
          { distance: '6.50m', achieved: false, target: '2024-03-01' },
          { distance: '6.70m', achieved: false, target: '2024-05-01' },
          { distance: '6.85m', achieved: false, target: '2024-06-15' },
          { distance: '7.00m', achieved: false, target: '2024-07-20' }
        ]
      },
      {
        id: 3,
        title: 'Sub-2:00 800m Race Time',
        target: '1:59.99',
        current: '2:05.8',
        progress: 35,
        deadline: '2024-06-30',
        status: 'active',
        category: 'middle-distance',
        icon: '🏃',
        milestones: [
          { time: '2:04.0', achieved: false, target: '2024-02-28' },
          { time: '2:02.0', achieved: false, target: '2024-04-15' },
          { time: '2:00.5', achieved: false, target: '2024-05-30' },
          { time: '1:59.99', achieved: false, target: '2024-06-30' }
        ]
      }
    ],
    monthly: [
      {
        id: 4,
        title: 'Complete 20 Sprint Sessions',
        target: '20 sessions',
        current: '14 sessions',
        progress: 70,
        deadline: '2024-01-31',
        status: 'active',
        category: 'training',
        icon: '💨'
      },
      {
        id: 5,
        title: 'Log 15 Field Event Practices',
        target: '15 sessions',
        current: '9 sessions',
        progress: 60,
        deadline: '2024-01-31',
        status: 'active',
        category: 'training',
        icon: '🥇'
      },
      {
        id: 6,
        title: 'Achieve 12 Mindfulness Sessions',
        target: '12 sessions',
        current: '8 sessions',
        progress: 67,
        deadline: '2024-01-31',
        status: 'active',
        category: 'mental',
        icon: '🧠'
      }
    ],
    weekly: [
      {
        id: 7,
        title: 'Complete 5 Quality Training Sessions',
        target: '5 sessions',
        current: '3 sessions',
        progress: 60,
        deadline: '2024-01-21',
        status: 'active',
        category: 'consistency',
        icon: '📈'
      },
      {
        id: 8,
        title: 'Hit 3 Speed Work Sessions',
        target: '3 sessions',
        current: '2 sessions',
        progress: 67,
        deadline: '2024-01-21',
        status: 'active',
        category: 'speed',
        icon: '⚡'
      },
      {
        id: 9,
        title: 'Practice Technique Drills 4x',
        target: '4 sessions',
        current: '2 sessions',
        progress: 50,
        deadline: '2024-01-21',
        status: 'active',
        category: 'technique',
        icon: '🎯'
      }
    ]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save to database
    console.log('Adding goal:', newGoal)
    setShowAddGoal(false)
    setNewGoal({ title: '', type: 'weekly', target: '', deadline: '', description: '' })
  }

  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500'
    if (progress >= 70) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getStatusText = (progress: number) => {
    if (progress >= 90) return 'Almost there!'
    if (progress >= 70) return 'Good progress'
    return 'Getting started'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Target className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/goals" className="text-blue-600 font-medium">Goals</Link>
              <Link href="/mindfulness" className="text-gray-700 hover:text-blue-600">Mindfulness</Link>
              <Link href="/community" className="text-gray-700 hover:text-blue-600">Community</Link>
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600">Analytics</Link>
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 Athletics Goals & Targets</h1>
            <p className="text-gray-600">Set ambitious athletics goals and track your progress toward excellence</p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </button>
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Goal</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sub-12 100m Sprint, 7m Long Jump, Sub-2:00 800m"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                  <select
                    value={newGoal.type}
                    onChange={(e) => setNewGoal({...newGoal, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="weekly">📅 Weekly Goal</option>
                    <option value="monthly">🗓️ Monthly Goal</option>
                    <option value="season">🏆 Season/Competition Goal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target</label>
                  <input
                    type="text"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 11.99s, 7.00m, 1:59.99, 20 sessions"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Why is this goal important to you?"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Add Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Goals Sections */}
        <div className="space-y-8">
          {/* Season Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Season Goals</h2>
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {goals.season.length} active
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {goals.season.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          goal.category === 'sprints' ? 'bg-red-100 text-red-700' :
                          goal.category === 'field' ? 'bg-yellow-100 text-yellow-700' :
                          goal.category === 'middle-distance' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">🎯 Target: <span className="font-mono font-semibold">{goal.target}</span></span>
                      <span className="text-gray-600">📊 Current: <span className="font-mono font-semibold">{goal.current}</span></span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getStatusColor(goal.progress)}`}
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{getStatusText(goal.progress)}</span>
                      <span className="text-xs font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                    
                    {/* Milestones */}
                    {goal.milestones && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="text-xs font-medium text-gray-700 mb-2">🏁 Milestones</h4>
                        <div className="space-y-1">
                          {goal.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  milestone.achieved ? 'bg-green-500' : 'bg-gray-300'
                                }`}></div>
                                <span className={`font-mono ${
                                  milestone.achieved ? 'text-green-700 line-through' : 'text-gray-600'
                                }`}>
                                  {milestone.time || milestone.distance}
                                </span>
                              </div>
                              <span className="text-gray-500">
                                {milestone.achieved ? milestone.date : milestone.target}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <Calendar className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Monthly Goals</h2>
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {goals.monthly.length} active
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goals.monthly.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{goal.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{goal.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          goal.category === 'training' ? 'bg-blue-100 text-blue-700' :
                          goal.category === 'mental' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{goal.current.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">of {goal.target}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(goal.progress)}`}
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{getStatusText(goal.progress)}</span>
                      <span className="text-xs font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Goals */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Weekly Goals</h2>
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {goals.weekly.length} active
              </span>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {goals.weekly.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="text-center mb-3">
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{goal.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      goal.category === 'consistency' ? 'bg-green-100 text-green-700' :
                      goal.category === 'speed' ? 'bg-red-100 text-red-700' :
                      goal.category === 'technique' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {goal.category}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{goal.current.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">of {goal.target}</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(goal.progress)}`}
                        style={{width: `${goal.progress}%`}}
                      ></div>
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-medium text-gray-700">{goal.progress}%</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Templates */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Quick Goal Templates</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Sub-11 100m Sprint', target: '10.99s', category: 'sprints', icon: '⚡' },
              { title: '8m Long Jump', target: '8.00m', category: 'field', icon: '🦘' },
              { title: 'Sub-1:50 800m', target: '1:49.99', category: 'middle-distance', icon: '🏃' },
              { title: '20 Training Sessions', target: '20 sessions', category: 'consistency', icon: '📈' }
            ].map((template, index) => (
              <button
                key={index}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                onClick={() => {
                  setNewGoal({
                    title: template.title,
                    target: template.target,
                    type: template.category === 'consistency' ? 'monthly' : 'season',
                    deadline: '',
                    description: ''
                  })
                  setShowAddGoal(true)
                }}
              >
                <div className="text-2xl mb-2">{template.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{template.title}</h3>
                <p className="text-xs text-gray-500">{template.target}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                  template.category === 'sprints' ? 'bg-red-100 text-red-700' :
                  template.category === 'field' ? 'bg-yellow-100 text-yellow-700' :
                  template.category === 'middle-distance' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {template.category}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        <div className="mt-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🔥 Athletics Excellence!</h2>
            <p className="text-red-100 mb-4">
              "Champions are made when nobody's watching. Every rep, every sprint, every jump matters."
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">58%</div>
                <div className="text-red-100">Avg Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">9</div>
                <div className="text-red-100">Active Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">3</div>
                <div className="text-red-100">Season Goals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1</div>
                <div className="text-red-100">Milestone Hit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
