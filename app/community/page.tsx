'use client'

import { useState } from 'react'
import { Users, MessageCircle, Heart, Trophy, Plus, Filter, Search, TrendingUp, Calendar, Target } from 'lucide-react'
import Link from 'next/link'

export default function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({
    type: 'win',
    title: '',
    content: '',
    tags: []
  })

  const communityPosts = [
    {
      id: 1,
      user: { name: 'Sarah Martinez', avatar: 'SM', sport: '800m Runner', location: 'California' },
      type: 'workout',
      title: 'Sub-2:00 800m! 🔥',
      content: 'Finally broke the 2-minute barrier with a 1:58.4! Workout: 4x400m @ 56s with 90s rest. The speed endurance work is paying off!',
      workout: {
        event: '800m',
        time: '1:58.4',
        splits: ['58.2', '60.2'],
        conditions: 'Track, 72°F, slight headwind'
      },
      timestamp: '2 hours ago',
      likes: 34,
      comments: 12,
      tags: ['800m', 'PR', 'sub2', 'track']
    },
    {
      id: 2,
      user: { name: 'Marcus Johnson', avatar: 'MJ', sport: 'Sprinter', location: 'Texas' },
      type: 'workout',
      title: 'Speed work session 💨',
      content: 'Solid 100m training today: 6x60m from blocks averaging 7.1s. Working on drive phase mechanics. Feeling explosive!',
      workout: {
        event: '100m Training',
        times: ['7.08', '7.12', '7.09', '7.15', '7.06', '7.11'],
        distance: '60m',
        conditions: 'Perfect weather, new spikes'
      },
      timestamp: '4 hours ago',
      likes: 28,
      comments: 8,
      tags: ['100m', 'speed', 'blocks', 'training']
    },
    {
      id: 3,
      user: { name: 'Emma Chen', avatar: 'EC', sport: 'Long Jump', location: 'Oregon' },
      type: 'achievement',
      title: 'New PB in Long Jump! 🦘',
      content: 'Jumped 6.45m today! Finally got my approach dialed in. The runway felt perfect and I hit the board clean. Next goal: 6.50m!',
      workout: {
        event: 'Long Jump',
        distance: '6.45m',
        attempts: ['6.32m', '6.41m', '6.45m', 'FOUL', '6.38m', '6.42m'],
        conditions: 'Slight tailwind (+1.2 m/s)'
      },
      timestamp: '6 hours ago',
      likes: 41,
      comments: 15,
      tags: ['longjump', 'PB', 'fieldEvents', 'technique']
    },
    {
      id: 4,
      user: { name: 'David Kim', avatar: 'DK', sport: 'Distance Runner', location: 'Colorado' },
      type: 'training',
      title: 'Altitude training grind 🏔️',
      content: 'Week 3 at 7,000ft elevation. Today: 12x400m @ 68s with 200m jog recovery. Legs felt heavy but splits were consistent. Adaptation happening!',
      workout: {
        event: 'Interval Training',
        workout: '12x400m',
        pace: '68s per 400m',
        elevation: '7,000ft',
        conditions: 'Cool morning, 45°F'
      },
      timestamp: '8 hours ago',
      likes: 22,
      comments: 9,
      tags: ['altitude', 'intervals', '400m', 'endurance']
    },
    {
      id: 5,
      user: { name: 'Aisha Patel', avatar: 'AP', sport: 'Hurdler', location: 'Florida' },
      type: 'tip',
      title: 'Hurdle mobility routine 🏃‍♀️',
      content: 'Game-changing warm-up for hurdlers: Walking hurdle drills → Trail leg swings → Lead leg marching → 3-step rhythm runs. Do this before every session!',
      timestamp: '12 hours ago',
      likes: 35,
      comments: 18,
      tags: ['hurdles', 'mobility', 'warmup', 'technique']
    },
    {
      id: 6,
      user: { name: 'Jake Thompson', avatar: 'JT', sport: 'Shot Put', location: 'Michigan' },
      type: 'achievement',
      title: 'Threw over 18m! 💪',
      content: 'Personal best of 18.24m today! Been working on my glide technique all season. The power transfer finally clicked. Coach says I can hit 19m this year!',
      workout: {
        event: 'Shot Put',
        distance: '18.24m',
        attempts: ['17.89m', '18.01m', '18.24m', 'FOUL', '17.95m', '18.12m'],
        technique: 'Glide',
        conditions: 'Indoor facility'
      },
      timestamp: '1 day ago',
      likes: 29,
      comments: 11,
      tags: ['shotput', 'PB', 'throws', 'technique']
    }
  ]

  const challenges = [
    {
      id: 1,
      title: 'Sub-12 Second 100m Club',
      description: 'Break 12.00 seconds in the 100m sprint',
      participants: 89,
      timeLeft: '45 days left',
      progress: 34,
      category: 'sprints',
      icon: '⚡',
      reward: 'Exclusive sprint training plan'
    },
    {
      id: 2,
      title: 'Distance Demon Challenge',
      description: 'Complete a sub-5:00 mile or sub-17:00 5K',
      participants: 156,
      timeLeft: '60 days left',
      progress: 67,
      category: 'distance',
      icon: '🏃',
      reward: 'Advanced endurance program'
    },
    {
      id: 3,
      title: 'Field Event Mastery',
      description: 'Achieve a new PB in any field event',
      participants: 73,
      timeLeft: '30 days left',
      progress: 52,
      category: 'field',
      icon: '🥇',
      reward: 'Technique analysis session'
    },
    {
      id: 4,
      title: 'January Training Consistency',
      description: 'Log at least 5 quality sessions per week',
      participants: 234,
      timeLeft: '18 days left',
      progress: 78,
      category: 'consistency',
      icon: '📈',
      reward: 'Training plan customization'
    },
    {
      id: 5,
      title: 'Mental Toughness Month',
      description: 'Complete mindfulness entries with every workout',
      participants: 127,
      timeLeft: '25 days left',
      progress: 61,
      category: 'mindfulness',
      icon: '🧠',
      reward: 'Advanced meditation content'
    }
  ]

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'workout': return <TrendingUp className="h-5 w-5 text-blue-500" />
      case 'achievement': return <Trophy className="h-5 w-5 text-yellow-500" />
      case 'training': return <Target className="h-5 w-5 text-green-500" />
      case 'tip': return <MessageCircle className="h-5 w-5 text-purple-500" />
      case 'reflection': return <MessageCircle className="h-5 w-5 text-indigo-500" />
      default: return <MessageCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'workout': return 'bg-blue-100 text-blue-800'
      case 'achievement': return 'bg-yellow-100 text-yellow-800'
      case 'training': return 'bg-green-100 text-green-800'
      case 'tip': return 'bg-purple-100 text-purple-800'
      case 'reflection': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting post:', newPost)
    setShowNewPost(false)
    setNewPost({ type: 'win', title: '', content: '', tags: [] })
  }

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
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/goals" className="text-gray-700 hover:text-blue-600">Goals</Link>
              <Link href="/mindfulness" className="text-gray-700 hover:text-blue-600">Mindfulness</Link>
              <Link href="/community" className="text-blue-600 font-medium">Community</Link>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
            <p className="text-gray-600">Connect, share, and get motivated with fellow athletes</p>
          </div>
          <button
            onClick={() => setShowNewPost(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Share Update
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'feed' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Community Feed
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'challenges' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Challenges
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'resources' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Resources
          </button>
        </div>

        {/* New Post Modal */}
        {showNewPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Share with the Community</h2>
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post Type</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="workout">📊 Workout Results</option>
                    <option value="achievement">🏆 Achievement/PR</option>
                    <option value="training">🎯 Training Session</option>
                    <option value="tip">💡 Training Tip</option>
                    <option value="reflection">💭 Reflection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Give your post a catchy title..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Share your story, tip, or thoughts with the community..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Share Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex space-x-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Posts */}
                {communityPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{post.user.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.user.sport}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          {getPostIcon(post.type)}
                          <h4 className="font-semibold text-gray-900">{post.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPostTypeColor(post.type)}`}>
                            {post.type}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{post.content}</p>
                        
                        {/* Workout Details */}
                        {post.workout && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                              📈 Workout Details
                            </h5>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-600">Event:</span>
                                <span className="ml-2 text-gray-900">{post.workout.event}</span>
                              </div>
                              {post.workout.time && (
                                <div>
                                  <span className="font-medium text-gray-600">Time:</span>
                                  <span className="ml-2 text-gray-900 font-mono">{post.workout.time}</span>
                                </div>
                              )}
                              {post.workout.distance && (
                                <div>
                                  <span className="font-medium text-gray-600">Distance:</span>
                                  <span className="ml-2 text-gray-900 font-mono">{post.workout.distance}</span>
                                </div>
                              )}
                              {post.workout.pace && (
                                <div>
                                  <span className="font-medium text-gray-600">Pace:</span>
                                  <span className="ml-2 text-gray-900 font-mono">{post.workout.pace}</span>
                                </div>
                              )}
                              {post.workout.conditions && (
                                <div className="col-span-2">
                                  <span className="font-medium text-gray-600">Conditions:</span>
                                  <span className="ml-2 text-gray-900">{post.workout.conditions}</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Splits or Attempts */}
                            {post.workout.splits && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-600">Splits:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {post.workout.splits.map((split, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                      {split}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {post.workout.attempts && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-600">Attempts:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {post.workout.attempts.map((attempt, index) => (
                                    <span key={index} className={`px-2 py-1 rounded text-xs font-mono ${
                                      attempt === 'FOUL' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                      {attempt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {post.workout.times && (
                              <div className="mt-3">
                                <span className="font-medium text-gray-600">Times:</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {post.workout.times.map((time, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                      {time}s
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <button className="flex items-center space-x-1 hover:text-red-500">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-blue-500">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Athletics Challenges</h2>
                  <div className="space-y-4">
                    {challenges.map((challenge) => (
                      <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{challenge.icon}</div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                              <p className="text-gray-600 text-sm">{challenge.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className={`px-2 py-1 rounded-full ${
                                  challenge.category === 'sprints' ? 'bg-red-100 text-red-700' :
                                  challenge.category === 'distance' ? 'bg-blue-100 text-blue-700' :
                                  challenge.category === 'field' ? 'bg-yellow-100 text-yellow-700' :
                                  challenge.category === 'consistency' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {challenge.category}
                                </span>
                                <span>🎁 {challenge.reward}</span>
                              </div>
                            </div>
                          </div>
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Join Challenge
                          </button>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>👥 {challenge.participants} athletes</span>
                          <span>⏰ {challenge.timeLeft}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-300 ${
                              challenge.progress >= 75 ? 'bg-green-500' :
                              challenge.progress >= 50 ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{width: `${challenge.progress}%`}}
                          ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {challenge.progress}% community completion rate
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Leaderboards */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Weekly Leaderboards</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Sprint Leaderboard */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        ⚡ 100m Sprint
                      </h3>
                      <div className="space-y-2">
                        {[
                          { name: 'Marcus Johnson', time: '10.89s', avatar: 'MJ', rank: 1 },
                          { name: 'Alex Rivera', time: '11.12s', avatar: 'AR', rank: 2 },
                          { name: 'Sarah Chen', time: '11.34s', avatar: 'SC', rank: 3 },
                          { name: 'David Kim', time: '11.45s', avatar: 'DK', rank: 4 },
                          { name: 'Emma Wilson', time: '11.67s', avatar: 'EW', rank: 5 }
                        ].map((athlete) => (
                          <div key={athlete.rank} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                athlete.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                athlete.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                athlete.rank === 3 ? 'bg-orange-400 text-orange-900' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {athlete.rank}
                              </div>
                              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">{athlete.avatar}</span>
                              </div>
                              <span className="font-medium text-gray-900">{athlete.name}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-blue-600">{athlete.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Distance Leaderboard */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        🏃 5000m
                      </h3>
                      <div className="space-y-2">
                        {[
                          { name: 'David Kim', time: '15:23.4', avatar: 'DK', rank: 1 },
                          { name: 'Sarah Martinez', time: '16:12.8', avatar: 'SM', rank: 2 },
                          { name: 'Mike Chen', time: '16:45.2', avatar: 'MC', rank: 3 },
                          { name: 'Lisa Park', time: '17:01.6', avatar: 'LP', rank: 4 },
                          { name: 'Jordan Kim', time: '17:23.9', avatar: 'JK', rank: 5 }
                        ].map((athlete) => (
                          <div key={athlete.rank} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                athlete.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                                athlete.rank === 2 ? 'bg-gray-300 text-gray-700' :
                                athlete.rank === 3 ? 'bg-orange-400 text-orange-900' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {athlete.rank}
                              </div>
                              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">{athlete.avatar}</span>
                              </div>
                              <span className="font-medium text-gray-900">{athlete.name}</span>
                            </div>
                            <span className="font-mono text-sm font-semibold text-green-600">{athlete.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Training Resources</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">Beginner's Running Guide</h3>
                      <p className="text-gray-600 text-sm mb-3">Complete guide to starting your running journey</p>
                      <span className="text-blue-600 text-sm font-medium">View Resource →</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">Strength Training for Runners</h3>
                      <p className="text-gray-600 text-sm mb-3">Essential exercises to improve performance</p>
                      <span className="text-blue-600 text-sm font-medium">View Resource →</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">Mental Training Techniques</h3>
                      <p className="text-gray-600 text-sm mb-3">Build mental toughness and focus</p>
                      <span className="text-blue-600 text-sm font-medium">View Resource →</span>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2">Nutrition for Athletes</h3>
                      <p className="text-gray-600 text-sm mb-3">Fuel your body for peak performance</p>
                      <span className="text-blue-600 text-sm font-medium">View Resource →</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">👥 Active Athletes</span>
                  <span className="font-semibold text-blue-600">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">📊 Workouts Shared</span>
                  <span className="font-semibold text-green-600">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">🏆 Active Challenges</span>
                  <span className="font-semibold text-purple-600">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">🔥 PRs This Month</span>
                  <span className="font-semibold text-red-600">156</span>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-2">
                {['#MarathonTraining', '#NewYearGoals', '#MentalToughness', '#RecoveryTips', '#NutritionHacks'].map((tag, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-blue-600 text-sm font-medium">{tag}</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10} posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Athletes</h3>
              <div className="space-y-3">
                {[
                  { name: 'Lisa Park', sport: 'Triathlon', avatar: 'LP' },
                  { name: 'David Wilson', sport: 'Track', avatar: 'DW' },
                  { name: 'Maria Garcia', sport: 'CrossFit', avatar: 'MG' }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{user.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.sport}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
