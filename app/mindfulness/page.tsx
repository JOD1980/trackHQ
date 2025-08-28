'use client'

import { useState, useEffect, useRef } from 'react'
import { Star, Plus, Heart, Brain, Zap, Calendar, BookOpen, Target, Play, Pause, RotateCcw, Volume2, Clock, Headphones } from 'lucide-react'
import Link from 'next/link'

export default function Mindfulness() {
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [showMeditationTimer, setShowMeditationTimer] = useState(false)
  const [selectedMeditation, setSelectedMeditation] = useState<any>(null)
  const [showGuidedMeditation, setShowGuidedMeditation] = useState(false)
  const [meditationTime, setMeditationTime] = useState(10)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerCompleted, setTimerCompleted] = useState(false)
  const [currentBackgroundSound, setCurrentBackgroundSound] = useState<string | null>(null)
  const [isPlayingGuided, setIsPlayingGuided] = useState(false)
  const [currentGuidedAudio, setCurrentGuidedAudio] = useState<HTMLAudioElement | null>(null)
  const [backgroundAudio, setBackgroundAudio] = useState<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Meditation Session Tracking
  const [todaysMeditations, setTodaysMeditations] = useState([])
  const [totalMeditationTime, setTotalMeditationTime] = useState(0)
  
  const [todayEntry, setTodayEntry] = useState({
    gratitude: '',
    intention: '',
    visualization: '',
    affirmation: '',
    mindfulMoment: '',
    mentalState: 3,
    stress: 3,
    focus: 3,
    meditationMinutes: 0,
    meditationType: ''
  })

  // Guided Meditation Library
  const guidedMeditations = [
    {
      id: 1,
      title: 'Mindful Breathing',
      instructor: 'Sarah Chen',
      duration: 10,
      description: 'Focus on your breath and find inner calm',
      audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    },
    {
      id: 2,
      title: 'Body Scan Relaxation',
      instructor: 'Dr. Michael Ross',
      duration: 15,
      description: 'Progressive relaxation through body awareness',
      audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3'
    },
    {
      id: 3,
      title: 'Loving Kindness',
      instructor: 'Emma Thompson',
      duration: 12,
      description: 'Cultivate compassion and self-love',
      audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a'
    },
    {
      id: 4,
      title: 'Pre-Competition Focus',
      instructor: 'Coach Martinez',
      duration: 8,
      description: 'Mental preparation for athletic performance',
      audioUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    },
    {
      id: 5,
      title: 'Recovery & Rest',
      instructor: 'Dr. Lisa Park',
      duration: 20,
      description: 'Deep relaxation for muscle recovery',
      audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3'
    },
    {
      id: 6,
      title: 'Visualization Training',
      instructor: 'Mental Coach Alex',
      duration: 15,
      description: 'Visualize success in your events',
      audioUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3'
    }
  ]

  // Background Sounds Library
  const backgroundSounds = [
    { id: 1, name: 'Ocean Waves', icon: '🌊', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { id: 2, name: 'Forest Rain', icon: '🌧️', url: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3' },
    { id: 3, name: 'Birds Chirping', icon: '🐦', url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4037a1c4b0.mp3' },
    { id: 4, name: 'White Noise', icon: '⚪', url: 'https://cdn.pixabay.com/audio/2023/10/30/audio_89bd386d3c.mp3' },
    { id: 5, name: 'Tibetan Bowls', icon: '🎵', url: 'https://cdn.pixabay.com/audio/2022/11/22/audio_af1e275255.mp3' },
    { id: 6, name: 'Wind Chimes', icon: '🎐', url: 'https://cdn.pixabay.com/audio/2023/07/25/audio_7fb2d57c7e.mp3' },
    { id: 7, name: 'Campfire', icon: '🔥', url: 'https://cdn.pixabay.com/audio/2022/11/27/audio_3ff68b6e6c.mp3' },
    { id: 8, name: 'River Stream', icon: '🏞️', url: 'https://cdn.pixabay.com/audio/2023/02/28/audio_c610232c18.mp3' }
  ]

  const recentEntries = [
    {
      date: '2024-01-09',
      gratitude: 'Grateful for my healthy body and the ability to train',
      intention: 'Focus on form over speed today',
      mentalState: 4,
      stress: 2,
      focus: 4,
      meditationMinutes: 10,
      meditationType: 'Pre-Training Focus'
    },
    {
      date: '2024-01-08', 
      gratitude: 'Thankful for my supportive training partners',
      intention: 'Stay present during each rep',
      mentalState: 3,
      stress: 3,
      focus: 3,
      meditationMinutes: 5,
      meditationType: 'Breathing Exercise'
    }
  ]

  const mindfulnessTips = [
    {
      title: "Pre-Training Visualization",
      description: "Spend 5 minutes visualizing your perfect training session before you start.",
      icon: <Brain className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Breathing Between Sets",
      description: "Use 4-7-8 breathing (inhale 4, hold 7, exhale 8) during rest periods.",
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      title: "Mindful Movement",
      description: "Focus on the sensation of each movement rather than just counting reps.",
      icon: <Zap className="h-5 w-5 text-yellow-500" />
    },
    {
      title: "Post-Session Reflection",
      description: "Take 3 minutes after training to reflect on what you learned about yourself.",
      icon: <BookOpen className="h-5 w-5 text-green-500" />
    }
  ]

  // Timer Functions
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isTimerActive) {
      setIsTimerActive(false)
      setTimerCompleted(true)
      // Add completed meditation to today's sessions
      const newMeditation = {
        duration: meditationTime,
        type: selectedMeditation ? selectedMeditation.title : 'Silent Meditation',
        completedAt: new Date().toLocaleTimeString()
      }
      setTodaysMeditations(prev => [...prev, newMeditation])
      setTotalMeditationTime(prev => prev + meditationTime)
    }
    return () => clearTimeout(timerRef.current)
  }, [isTimerActive, timeRemaining, meditationTime, selectedMeditation])

  const startTimer = () => {
    setTimeRemaining(meditationTime * 60)
    setIsTimerActive(true)
    setTimerCompleted(false)
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setTimeRemaining(0)
    setIsTimerActive(false)
    setTimerCompleted(false)
    stopGuidedMeditation()
    stopBackgroundSound()
  }

  const pauseTimer = () => {
    setIsTimerActive(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const playBackgroundSound = (sound: any) => {
    // Stop current background sound if playing
    if (backgroundAudio) {
      backgroundAudio.pause()
      backgroundAudio.currentTime = 0
    }
    
    try {
      const audio = new Audio(sound.url)
      audio.loop = true
      audio.volume = 0.3
      audio.play().then(() => {
        setBackgroundAudio(audio)
        setCurrentBackgroundSound(sound.name)
      }).catch((error) => {
        console.log('Audio play failed:', error)
        // Fallback: show visual feedback that sound would play
        setCurrentBackgroundSound(sound.name + ' (Demo)')
        setTimeout(() => setCurrentBackgroundSound(null), 3000)
      })
    } catch (error) {
      console.log('Audio creation failed:', error)
      // Fallback: show visual feedback
      setCurrentBackgroundSound(sound.name + ' (Demo)')
      setTimeout(() => setCurrentBackgroundSound(null), 3000)
    }
  }

  const stopBackgroundSound = () => {
    if (backgroundAudio) {
      backgroundAudio.pause()
      backgroundAudio.currentTime = 0
      setBackgroundAudio(null)
    }
    setCurrentBackgroundSound(null)
  }

  const startGuidedMeditation = (meditation: any) => {
    setSelectedMeditation(meditation)
    setMeditationTime(meditation.duration)
    setShowGuidedMeditation(false)
    setShowMeditationTimer(true)
    
    // Try to play guided meditation audio
    try {
      const audio = new Audio(meditation.audioUrl)
      audio.volume = 0.7
      audio.play().then(() => {
        setCurrentGuidedAudio(audio)
        setIsPlayingGuided(true)
      }).catch((error) => {
        console.log('Guided meditation audio failed:', error)
        // Continue with timer even if audio fails
      })
    } catch (error) {
      console.log('Guided meditation audio creation failed:', error)
    }
  }

  const stopGuidedMeditation = () => {
    if (currentGuidedAudio) {
      currentGuidedAudio.pause()
      currentGuidedAudio.currentTime = 0
      setCurrentGuidedAudio(null)
    }
    setIsPlayingGuided(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving mindfulness entry:', todayEntry)
    setShowAddEntry(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Star className="h-8 w-8 text-orange-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
              <Link href="/goals" className="text-gray-700 hover:text-blue-600">Goals</Link>
              <Link href="/mindfulness" className="text-orange-600 font-medium">Mindfulness</Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mindfulness Journal</h1>
          <p className="text-gray-600">Strengthen your mental game and cultivate awareness</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meditation Center */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">🧘 Meditation Center</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMeditationTimer(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Timer
                  </button>
                  <button
                    onClick={() => setShowGuidedMeditation(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Guided
                  </button>
                </div>
              </div>

              {/* Today's Meditation Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{todaysMeditations.length}</div>
                  <div className="text-sm text-purple-700">Sessions Today</div>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">{totalMeditationTime}</div>
                  <div className="text-sm text-indigo-700">Minutes Total</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{todaysMeditations.length > 0 ? '✓' : '○'}</div>
                  <div className="text-sm text-green-700">Daily Goal</div>
                </div>
              </div>

              {/* Quick Meditation Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { setMeditationTime(5); setShowMeditationTimer(true); }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">5 min</div>
                </button>
                <button
                  onClick={() => { setMeditationTime(10); setShowMeditationTimer(true); }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">10 min</div>
                </button>
                <button
                  onClick={() => { setMeditationTime(15); setShowMeditationTimer(true); }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">15 min</div>
                </button>
                <button
                  onClick={() => { setMeditationTime(20); setShowMeditationTimer(true); }}
                  className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors"
                >
                  <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                  <div className="text-sm font-medium">20 min</div>
                </button>
              </div>

              {/* Recent Meditation Sessions */}
              {todaysMeditations.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Sessions</h3>
                  <div className="space-y-2">
                    {todaysMeditations.map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{session.type}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.duration}min • {session.completedAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Today's Mindfulness Entry */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Mindfulness Practice</h2>
                <button
                  onClick={() => setShowAddEntry(!showAddEntry)}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </button>
              </div>

              {showAddEntry ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Mental State Check-ins */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mental State <Brain className="inline h-4 w-4 text-blue-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, mentalState: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.mentalState >= num ? 'bg-blue-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.mentalState >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stress Level <Heart className="inline h-4 w-4 text-red-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, stress: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.stress >= num ? 'bg-red-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.stress >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Level <Target className="inline h-4 w-4 text-green-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, focus: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.focus >= num ? 'bg-green-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.focus >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gratitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🙏 Daily Gratitude
                    </label>
                    <textarea
                      value={todayEntry.gratitude}
                      onChange={(e) => setTodayEntry({...todayEntry, gratitude: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="What are you grateful for today? (training-related or personal)"
                    />
                  </div>

                  {/* Intention */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 Today's Intention
                    </label>
                    <textarea
                      value={todayEntry.intention}
                      onChange={(e) => setTodayEntry({...todayEntry, intention: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={2}
                      placeholder="What's your focus or intention for today's training/life?"
                    />
                  </div>

                  {/* Visualization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      👁️ Visualization Practice
                    </label>
                    <textarea
                      value={todayEntry.visualization}
                      onChange={(e) => setTodayEntry({...todayEntry, visualization: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe your perfect performance or outcome. See it, feel it, believe it."
                    />
                  </div>

                  {/* Affirmation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ✨ Power Affirmation
                    </label>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <textarea
                        value={todayEntry.affirmation}
                        onChange={(e) => setTodayEntry({...todayEntry, affirmation: e.target.value})}
                        className="w-full bg-transparent border-none focus:ring-0 resize-none text-lg font-medium text-gray-900"
                        rows={2}
                        placeholder="I am strong, I am capable, I am ready! (Make it powerful!)"
                      />
                      <p className="text-sm text-orange-700 mt-2">💪 Say this with conviction and feel the power!</p>
                    </div>
                  </div>

                  {/* Mindful Moment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🧘 Mindful Moment
                    </label>
                    <textarea
                      value={todayEntry.mindfulMoment}
                      onChange={(e) => setTodayEntry({...todayEntry, mindfulMoment: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                      placeholder="Describe a moment today when you were fully present. What did you notice?"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddEntry(false)}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
                    >
                      Save Entry
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No mindfulness entry for today yet. Click "Add Entry" to begin your practice!</p>
                </div>
              )}
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Mindfulness Entries</h2>
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{entry.date}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Brain className="h-3 w-3 text-blue-500" />
                          <div className="flex">
                            {[1,2,3,4,5].map(num => (
                              <Star key={num} className={`h-3 w-3 ${entry.mentalState >= num ? 'text-blue-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <div className="flex">
                            {[1,2,3,4,5].map(num => (
                              <Star key={num} className={`h-3 w-3 ${entry.stress >= num ? 'text-red-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1"><strong>Gratitude:</strong> {entry.gratitude}</p>
                    <p className="text-gray-600"><strong>Intention:</strong> {entry.intention}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* This Week's Mindfulness */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Entries Logged</span>
                  <span className="font-semibold text-orange-600">4/7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Mental State</span>
                  <div className="flex">
                    {[1,2,3,4].map(num => (
                      <Star key={num} className="h-4 w-4 text-blue-500" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Stress</span>
                  <div className="flex">
                    {[1,2].map(num => (
                      <Star key={num} className="h-4 w-4 text-red-500" />
                    ))}
                    {[3,4,5].map(num => (
                      <Star key={num} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mindfulness Tips */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mindfulness Tips</h3>
              <div className="space-y-4">
                {mindfulnessTips.map((tip, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">{tip.icon}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{tip.title}</h4>
                        <p className="text-xs text-gray-600">{tip.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mental Training Challenge */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-2">🧠 Mental Training Challenge</h3>
                <p className="text-orange-100 text-sm mb-4">
                  Complete 7 days of mindfulness entries this week
                </p>
                <div className="w-full bg-orange-400 rounded-full h-2 mb-2">
                  <div className="bg-white h-2 rounded-full" style={{width: '57%'}}></div>
                </div>
                <div className="text-sm text-orange-100">4/7 days completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Meditation Timer Modal */}
        {showMeditationTimer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {selectedMeditation ? selectedMeditation.title : 'Silent Meditation'}
                </h2>
                
                {/* Timer Display */}
                <div className="mb-8">
                  <div className="text-6xl font-mono font-bold text-purple-600 mb-4">
                    {timeRemaining > 0 ? formatTime(timeRemaining) : `${meditationTime}:00`}
                  </div>
                  
                  {/* Progress Ring */}
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        fill="none"
                        stroke="#9333ea"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={
                          timeRemaining > 0 
                            ? `${2 * Math.PI * 50 * (1 - (meditationTime * 60 - timeRemaining) / (meditationTime * 60))}`
                            : `${2 * Math.PI * 50}`
                        }
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-sm text-gray-600">
                        {timeRemaining > 0 ? 'Active' : 'Ready'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center space-x-4 mb-6">
                  {!isTimerActive && timeRemaining === 0 && (
                    <button
                      onClick={startTimer}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start
                    </button>
                  )}
                  
                  {isTimerActive && (
                    <button
                      onClick={pauseTimer}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg flex items-center"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </button>
                  )}
                  
                  {!isTimerActive && timeRemaining > 0 && (
                    <button
                      onClick={() => setIsTimerActive(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </button>
                  )}
                  
                  {timeRemaining > 0 && (
                    <button
                      onClick={resetTimer}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Duration Selector (when not active) */}
                {!isTimerActive && timeRemaining === 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <div className="flex justify-center space-x-2">
                      {[5, 10, 15, 20, 30].map(duration => (
                        <button
                          key={duration}
                          onClick={() => setMeditationTime(duration)}
                          className={`px-3 py-2 rounded-lg text-sm ${
                            meditationTime === duration
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {duration}m
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Background Sounds */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Background Sounds
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {backgroundSounds.slice(0, 6).map(sound => (
                      <button
                        key={sound.id}
                        onClick={() => currentBackgroundSound === sound.name ? stopBackgroundSound() : playBackgroundSound(sound)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          currentBackgroundSound === sound.name || currentBackgroundSound === sound.name + ' (Demo)'
                            ? 'bg-blue-100 border-2 border-blue-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        title={sound.name}
                      >
                        <div className="text-lg mb-1">{sound.icon}</div>
                        <div className="text-xs text-gray-600">{sound.name}</div>
                        {(currentBackgroundSound === sound.name || currentBackgroundSound === sound.name + ' (Demo)') && (
                          <div className="text-xs text-blue-600 font-medium mt-1">Playing</div>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Sound Controls */}
                  {currentBackgroundSound && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg text-center">
                      <div className="text-sm text-blue-700 mb-2">
                        🎵 Playing: {currentBackgroundSound}
                      </div>
                      <button
                        onClick={stopBackgroundSound}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        Stop Sound
                      </button>
                    </div>
                  )}
                </div>

                {/* Completion Message */}
                {timerCompleted && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-800 font-medium">🎉 Meditation Complete!</div>
                    <div className="text-sm text-green-600 mt-1">
                      You meditated for {meditationTime} minutes. Well done!
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowMeditationTimer(false)
                    resetTimer()
                    setSelectedMeditation(null)
                    stopGuidedMeditation()
                    stopBackgroundSound()
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guided Meditation Modal */}
        {showGuidedMeditation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">🎧 Guided Meditations</h2>
                  <button
                    onClick={() => setShowGuidedMeditation(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[75vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {guidedMeditations.map(meditation => (
                    <div key={meditation.id} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{meditation.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{meditation.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {meditation.duration}min
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            meditation.category === 'athletics' ? 'bg-red-100 text-red-700' :
                            meditation.category === 'recovery' ? 'bg-green-100 text-green-700' :
                            meditation.category === 'breathing' ? 'bg-blue-100 text-blue-700' :
                            meditation.category === 'visualization' ? 'bg-purple-100 text-purple-700' :
                            meditation.category === 'relaxation' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {meditation.category}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          by {meditation.instructor}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => startGuidedMeditation(meditation)}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Session
                        </button>
                        <button 
                          onClick={() => {
                            // Demo audio preview
                            try {
                              const audio = new Audio(meditation.audioUrl)
                              audio.volume = 0.5
                              audio.play().then(() => {
                                setTimeout(() => audio.pause(), 2000) // 2 second preview
                              }).catch(() => {
                                alert('Audio preview: ' + meditation.title + ' by ' + meditation.instructor)
                              })
                            } catch {
                              alert('Audio preview: ' + meditation.title + ' by ' + meditation.instructor)
                            }
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-3 rounded-lg transition-colors"
                          title="Preview audio"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Featured Athletics Meditations */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🏃 Athletics-Focused Sessions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {guidedMeditations.filter(m => m.category === 'athletics' || m.category === 'visualization').map(meditation => (
                      <div key={`featured-${meditation.id}`} className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{meditation.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{meditation.description}</p>
                        <button
                          onClick={() => startGuidedMeditation(meditation)}
                          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {meditation.duration}min Session
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
