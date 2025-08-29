'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, TrendingUp, Target, Star, Clock, Zap, Heart, Search, X } from 'lucide-react'
import Link from 'next/link'
import { exerciseDatabase, Exercise, searchExercises, categoryOrder, athleticsEvents } from '../../data/exercises'
import { workoutTemplates, WorkoutTemplate, getTemplatesByCategory, searchTemplates } from '../../data/templates'
import { storageService, WorkoutEntry } from '../../lib/storage'

export default function Dashboard() {
 const [todayEntry, setTodayEntry] = useState({
  exercises: '',
  selectedExercises: [] as Array<{
    exercise: Exercise,
    variation?: string,
    sets?: number,
    reps?: number,
    weight?: number,
    time?: number,
    distance?: number,
    notes?: string
  }>,
  positives: '',
  improvements: '',
  goals: '',
  mood: 0,
  energy: 0,
  sleep: 0
})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [showAddEntry, setShowAddEntry] = useState(false)
  const [showExerciseSearch, setShowExerciseSearch] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showAddToTemplate, setShowAddToTemplate] = useState(false)
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('')
  const [templateSearchQuery, setTemplateSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Exercise[]>([])
  const [templateResults, setTemplateResults] = useState<WorkoutTemplate[]>(workoutTemplates)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  // Load today's workout on component mount
  useEffect(() => {
    loadTodaysWorkout()
  }, [])

  // Auto-save workout data when it changes
  useEffect(() => {
    if (!isLoading && todayEntry.selectedExercises.length > 0) {
      const timeoutId = setTimeout(() => {
        saveWorkout()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [todayEntry, isLoading])

  const loadTodaysWorkout = async () => {
    try {
      const today = storageService.formatDate(new Date())
      const existingWorkout = storageService.getWorkoutByDate(today)
      
      if (existingWorkout) {
        setTodayEntry({
          exercises: existingWorkout.exercises,
          selectedExercises: existingWorkout.selectedExercises.map(ex => ({
            exercise: exerciseDatabase.find(e => e.id === ex.exerciseId) || {} as Exercise,
            variation: ex.variation,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            time: ex.time,
            distance: ex.distance,
            notes: ex.notes || ''
          })),
          positives: existingWorkout.positives,
          improvements: existingWorkout.improvements,
          goals: existingWorkout.goals
        })
        setLastSaved(new Date())
      }
    } catch (error) {
      console.error('Failed to load workout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveWorkout = async () => {
    if (isSaving) return
    
    try {
      setIsSaving(true)
      const today = storageService.formatDate(new Date())
      const existingWorkout = storageService.getWorkoutByDate(today)
      
      const workoutData: WorkoutEntry = {
        id: existingWorkout?.id || storageService.generateId(),
        date: today,
        exercises: todayEntry.exercises,
        selectedExercises: todayEntry.selectedExercises.map(ex => ({
          exerciseId: ex.exercise.id,
          exerciseName: ex.exercise.name,
          variation: ex.variation,
          sets: ex.sets,
          reps: ex.reps,
          weight: ex.weight,
          time: ex.time,
          distance: ex.distance,
          notes: ex.notes || ''
        })),
        positives: todayEntry.positives,
        improvements: todayEntry.improvements,
        goals: todayEntry.goals
      }
      
      await storageService.saveWorkout(workoutData)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save workout:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExerciseSearch = (query: string) => {
    setExerciseSearchQuery(query)
    if (query.trim()) {
      setSearchResults(searchExercises(query))
    } else {
      setSearchResults([])
    }
  }

  const handleTemplateSearch = (query: string) => {
    setTemplateSearchQuery(query)
    if (query.trim()) {
      setTemplateResults(searchTemplates(query))
    } else {
      setTemplateResults(workoutTemplates)
    }
  }

  const loadTemplate = (template: WorkoutTemplate) => {
    const templateExercises = template.exercises.map(templateExercise => ({
      exercise: templateExercise.exercise,
      variation: templateExercise.exercise.variations?.[0],
      sets: templateExercise.sets,
      reps: templateExercise.reps,
      weight: templateExercise.weight,
      time: templateExercise.time,
      distance: templateExercise.distance,
      notes: templateExercise.notes || ''
    }))
    
    setTodayEntry(prev => ({
      ...prev,
      selectedExercises: [...prev.selectedExercises, ...templateExercises]
    }))
    setShowTemplateModal(false)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory('')
    setAvailableExercises([])
    
    if (category === 'sport-specific') {
      // Get unique subcategories for sport-specific exercises
const subcategorySet = new Set(exerciseDatabase
  .filter(ex => ex.category === 'sport-specific' && ex.subcategory)
  .map(ex => ex.subcategory!))
const subcategories = Array.from(subcategorySet)
    } else {
      // For non-sport-specific categories, show exercises directly
      const exercises = exerciseDatabase.filter(ex => ex.category === category)
      setAvailableExercises(exercises)
      setAvailableSubcategories([])
    }
  }

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory)
    const exercises = exerciseDatabase.filter(ex => 
      ex.category === 'sport-specific' && ex.subcategory === subcategory
    )
    setAvailableExercises(exercises)
  }

  const addExerciseFromDropdown = (exerciseId: string, variation?: string) => {
    const exercise = exerciseDatabase.find(ex => ex.id === exerciseId)
    if (!exercise) return

    const newExercise = {
      exercise,
      variation,
      notes: ''
    }

    // Add tracking fields based on exercise type
    if (exercise.trackingType === 'sets-reps') {
      Object.assign(newExercise, { sets: 3, reps: 10 })
    } else if (exercise.trackingType === 'sets-time') {
      Object.assign(newExercise, { sets: 3, time: 30 })
    } else if (exercise.trackingType === 'time') {
      Object.assign(newExercise, { time: 20 })
    } else if (exercise.trackingType === 'distance') {
      Object.assign(newExercise, { distance: 5 })
    } else if (exercise.trackingType === 'reps-only') {
      Object.assign(newExercise, { reps: 10 })
    }

    // Add weight field for strength exercises
    if (exercise.category === 'strength') {
      Object.assign(newExercise, { weight: 0 })
    }

    setTodayEntry(prev => ({
      ...prev,
      selectedExercises: [...prev.selectedExercises, newExercise]
    }))

    // Close the modal
    setShowAddToTemplate(false)
    setSelectedCategory('')
    setSelectedSubcategory('')
    setAvailableExercises([])
    setAvailableSubcategories([])
    
    // Auto-save after adding exercise
    setTimeout(() => saveWorkout(), 500)
  }

  const addExerciseToWorkout = (exercise: Exercise, variation?: string) => {
    const newExercise = {
      exercise,
      variation,
      notes: ''
    }

    // Add tracking fields based on exercise type with athletics-focused defaults
    if (exercise.trackingType === 'sets-reps') {
      Object.assign(newExercise, { sets: 3, reps: 10 })
    } else if (exercise.trackingType === 'sets-time') {
      Object.assign(newExercise, { sets: 3, time: 30 })
    } else if (exercise.trackingType === 'time') {
      // Athletics-specific time defaults
      if (exercise.subcategory?.includes('sprint')) {
        Object.assign(newExercise, { time: '0.00' }) // seconds format
      } else if (exercise.subcategory?.includes('distance')) {
        Object.assign(newExercise, { time: '0:00.00' }) // min:sec format
      } else {
        Object.assign(newExercise, { time: 20 })
      }
    } else if (exercise.trackingType === 'distance') {
      Object.assign(newExercise, { distance: 0 }) // meters
    } else if (exercise.trackingType === 'reps-only') {
      Object.assign(newExercise, { reps: 10 })
    }

    // Add weight field for strength exercises (de-emphasized)
    if (exercise.category === 'strength') {
      Object.assign(newExercise, { weight: 0 })
    }

    setTodayEntry(prev => ({
      ...prev,
      selectedExercises: [...prev.selectedExercises, newExercise]
    }))

    // Close search modal
    setShowExerciseSearch(false)
    setExerciseSearchQuery('')
    setSearchResults([])
    
    // Auto-save after adding exercise
    setTimeout(() => saveWorkout(), 500)
  }

  const updateExerciseData = (index: number, field: string, value: number | string) => {
    const updatedExercises = [...todayEntry.selectedExercises]
    updatedExercises[index] = { ...updatedExercises[index], [field]: value }
    setTodayEntry({ ...todayEntry, selectedExercises: updatedExercises })
  }

  const updateExerciseVariation = (index: number, variation: string) => {
    const updatedExercises = [...todayEntry.selectedExercises]
    updatedExercises[index] = { ...updatedExercises[index], variation }
    setTodayEntry({ ...todayEntry, selectedExercises: updatedExercises })
  }

  const removeExercise = (index: number) => {
    const updatedExercises = todayEntry.selectedExercises.filter((_, i) => i !== index)
    setTodayEntry({ ...todayEntry, selectedExercises: updatedExercises })
  }

  const recentEntries = [
    {
      date: '2024-01-09',
      exercises: 'Sprint intervals, Core work',
      mood: 4,
      energy: 4,
      reflection: 'Great session, felt strong on the intervals'
    },
    {
      date: '2024-01-08',
      exercises: 'Long run, Stretching',
      mood: 3,
      energy: 3,
      reflection: 'Legs felt heavy but pushed through'
    }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save to database
    console.log('Saving entry:', todayEntry)
    setShowAddEntry(false)
    // Reset form or show success message
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-2xl font-bold text-gray-900">TrackHQ</span>
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-blue-600 font-medium">Dashboard</Link>
              <Link href="/goals" className="text-gray-700 hover:text-blue-600">Goals</Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Dashboard</h1>
          <p className="text-gray-600">Track your progress, one session at a time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Entry */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Training</h2>
                <button
                  onClick={() => setShowAddEntry(!showAddEntry)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </button>
              </div>

              {showAddEntry ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quick Check-ins */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mood <Heart className="inline h-4 w-4 text-red-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, mood: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.mood >= num ? 'bg-red-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.mood >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Energy <Zap className="inline h-4 w-4 text-yellow-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, energy: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.energy >= num ? 'bg-yellow-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.energy >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sleep <Clock className="inline h-4 w-4 text-blue-500" />
                      </label>
                      <div className="flex space-x-1">
                        {[1,2,3,4,5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setTodayEntry({...todayEntry, sleep: num})}
                            className={`w-8 h-8 rounded-full ${todayEntry.sleep >= num ? 'bg-blue-500' : 'bg-gray-200'}`}
                          >
                            <Star className={`h-4 w-4 mx-auto ${todayEntry.sleep >= num ? 'text-white' : 'text-gray-400'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Athletics-First Training Selection */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-lg font-semibold text-gray-900">
                        🏃 Today's Training Session
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowTemplateModal(true)}
                          className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1 rounded-lg flex items-center"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Athletics Templates
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowExerciseSearch(true)}
                          className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-lg flex items-center"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Training
                        </button>
                      </div>
                    </div>

                    {/* Quick Athletics Event Buttons */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Quick Add Athletics Events:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const sprint100 = exerciseDatabase.find(ex => ex.id === 'sprint-100m')
                            if (sprint100) addExerciseFromDropdown(sprint100.id)
                          }}
                          className="p-2 text-xs bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors"
                        >
                          🏃 100m Sprint
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const distance800 = exerciseDatabase.find(ex => ex.id === 'distance-800m')
                            if (distance800) addExerciseFromDropdown(distance800.id)
                          }}
                          className="p-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                        >
                          🏃 800m Run
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const longJump = exerciseDatabase.find(ex => ex.id === 'long-jump')
                            if (longJump) addExerciseFromDropdown(longJump.id)
                          }}
                          className="p-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors"
                        >
                          🦘 Long Jump
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const sprintDrills = exerciseDatabase.find(ex => ex.id === 'sprint-drills')
                            if (sprintDrills) addExerciseFromDropdown(sprintDrills.id)
                          }}
                          className="p-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg border border-purple-200 transition-colors"
                        >
                          🏃 Sprint Drills
                        </button>
                      </div>
                    </div>

                    {/* Selected Exercises */}
                    {todayEntry.selectedExercises.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {todayEntry.selectedExercises.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-gray-900">{item.exercise.name}</h4>
                                {item.variation && (
                                  <p className="text-sm text-blue-600 font-medium">{item.variation}</p>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeExercise(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{item.exercise.description}</p>
                            
                            {/* Exercise Variation Dropdown */}
                            {item.exercise.variations && item.exercise.variations.length > 0 && (
                              <div className="mb-3">
                                <label className="text-xs text-gray-500">Specific Exercise</label>
                                <select
                                  value={item.variation || ''}
                                  onChange={(e) => updateExerciseVariation(index, e.target.value)}
                                  className="w-full p-1 text-sm border border-gray-300 rounded"
                                >
                                  {item.exercise.variations.map((variation) => (
                                    <option key={variation} value={variation}>
                                      {variation}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                            
                            {/* Athletics-focused tracking inputs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {/* Time tracking for athletics events (prioritized) */}
                              {item.time !== undefined && (
                                <div className="col-span-2 md:col-span-1">
                                  <label className="text-xs font-medium text-blue-600">
                                    {item.exercise.category === 'sport-specific' ? 
                                      (item.exercise.subcategory?.includes('sprint') ? '⏱️ Time (seconds)' : 
                                       item.exercise.subcategory?.includes('distance') ? '⏱️ Time (min:sec)' : 
                                       '⏱️ Time (seconds)') : 
                                      'Time (min)'}
                                  </label>
                                  <input
                                    type="text"
                                    value={item.time}
                                    onChange={(e) => updateExerciseData(index, 'time', e.target.value)}
                                    className="w-full p-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder={item.exercise.category === 'sport-specific' ? 
                                      (item.exercise.subcategory?.includes('sprint') ? '10.50' : 
                                       item.exercise.subcategory?.includes('distance') ? '2:05.30' : 
                                       '30.0') : 
                                      '20'}
                                  />
                                </div>
                              )}
                              
                              {/* Distance tracking for field events */}
                              {item.distance !== undefined && (
                                <div className="col-span-2 md:col-span-1">
                                  <label className="text-xs font-medium text-green-600">
                                    📏 Distance (m)
                                  </label>
                                  <input
                                    type="number"
                                    value={item.distance}
                                    onChange={(e) => updateExerciseData(index, 'distance', parseFloat(e.target.value))}
                                    className="w-full p-2 text-sm border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                    min="0"
                                    step="0.01"
                                    placeholder="6.50"
                                  />
                                </div>
                              )}

                              {/* Sets for drill work */}
                              {item.sets !== undefined && (
                                <div>
                                  <label className="text-xs text-gray-500">Sets</label>
                                  <input
                                    type="number"
                                    value={item.sets}
                                    onChange={(e) => updateExerciseData(index, 'sets', parseInt(e.target.value))}
                                    className="w-full p-1 text-sm border border-gray-300 rounded"
                                    min="1"
                                  />
                                </div>
                              )}
                              
                              {/* Reps for drill work */}
                              {item.reps !== undefined && (
                                <div>
                                  <label className="text-xs text-gray-500">Reps</label>
                                  <input
                                    type="number"
                                    value={item.reps}
                                    onChange={(e) => updateExerciseData(index, 'reps', parseInt(e.target.value))}
                                    className="w-full p-1 text-sm border border-gray-300 rounded"
                                    min="1"
                                  />
                                </div>
                              )}
                              
                              {/* Weight for strength training (de-emphasized) */}
                              {item.weight !== undefined && (
                                <div>
                                  <label className="text-xs text-gray-400">Weight (kg)</label>
                                  <input
                                    type="number"
                                    value={item.weight}
                                    onChange={(e) => updateExerciseData(index, 'weight', parseFloat(e.target.value))}
                                    className="w-full p-1 text-sm border border-gray-200 rounded"
                                    min="0"
                                    step="0.5"
                                  />
                                </div>
                              )}
                            </div>
                            
                            {/* Notes for this exercise */}
                            <div className="mt-2">
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) => updateExerciseData(index, 'notes', e.target.value)}
                                placeholder="Notes (e.g., felt heavy, good form, etc.)"
                                className="w-full p-1 text-sm border border-gray-300 rounded"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add More Exercises Button */}
                    <div className="flex justify-center mb-4">
                      <button
                        type="button"
                        onClick={() => setShowAddToTemplate(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add More Exercises
                      </button>
                    </div>

                    {/* Free-form exercise entry (preserved for flexibility) */}
                    <textarea
                      value={todayEntry.exercises}
                      onChange={(e) => setTodayEntry({...todayEntry, exercises: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      placeholder="Additional exercises or notes not covered above..."
                    />
                  </div>

                  {/* Save Status Indicator */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {isSaving && (
                        <div className="flex items-center text-blue-600">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                          <span className="text-sm">Saving...</span>
                        </div>
                      )}
                      {lastSaved && !isSaving && (
                        <div className="flex items-center text-green-600">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          <span className="text-sm">Saved {lastSaved.toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={saveWorkout}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Save Now'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No entry for today yet. Click "Add Entry" to get started!</p>
                </div>
              )}
            </div>

            {/* Exercise Search Modal */}
            {showExerciseSearch && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Add Exercise</h2>
                      <button
                        onClick={() => {
                          setShowExerciseSearch(false)
                          setExerciseSearchQuery('')
                          setSearchResults([])
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={exerciseSearchQuery}
                        onChange={(e) => handleExerciseSearch(e.target.value)}
                        placeholder="Search exercises (e.g., squat, running, yoga)..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-96">
                    {exerciseSearchQuery === '' ? (
                      <div className="space-y-6">
                        {['strength', 'cardio', 'flexibility', 'sport-specific', 'recovery'].map(category => (
                          <div key={category}>
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
                              {category.replace('-', ' ')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {exerciseDatabase
                                .filter(ex => ex.category === category)
                                .slice(0, 4)
                                .map(exercise => (
                                <button
                                  key={exercise.id}
                                  onClick={() => addExerciseToWorkout(exercise)}
                                  className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                                >
                                  <div className="font-medium text-gray-900">{exercise.name}</div>
                                  <div className="text-xs text-gray-600 mt-1">{exercise.description}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map(exercise => (
                          <button
                            key={exercise.id}
                            onClick={() => addExerciseToWorkout(exercise)}
                            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{exercise.name}</div>
                                <div className="text-sm text-gray-600 mt-1">{exercise.description}</div>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                                    {exercise.category.replace('-', ' ')}
                                  </span>
                                  {exercise.muscleGroups && (
                                    <span className="text-xs text-gray-500">
                                      {exercise.muscleGroups.slice(0, 2).join(', ')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Plus className="h-5 w-5 text-blue-600" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No exercises found for "{exerciseSearchQuery}"</p>
                        <p className="text-sm mt-1">Try searching for "squat", "running", or "yoga"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Entries */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Entries</h2>
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{entry.date}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {[1,2,3,4,5].map(num => (
                            <Star key={num} className={`h-4 w-4 ${entry.mood >= num ? 'text-red-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1"><strong>Training:</strong> {entry.exercises}</p>
                    <p className="text-gray-600"><strong>Reflection:</strong> {entry.reflection}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sessions Logged</span>
                  <span className="font-semibold text-blue-600">4/6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Mood</span>
                  <div className="flex">
                    {[1,2,3,4].map(num => (
                      <Star key={num} className="h-4 w-4 text-red-500" />
                    ))}
                    <Star className="h-4 w-4 text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Energy</span>
                  <div className="flex">
                    {[1,2,3].map(num => (
                      <Star key={num} className="h-4 w-4 text-yellow-500" />
                    ))}
                    {[4,5].map(num => (
                      <Star key={num} className="h-4 w-4 text-gray-300" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Athletics Goals */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🎯 Athletics Goals</h3>
                <Link href="/goals" className="text-blue-600 text-sm hover:text-blue-700">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">🏃 Sub-11.00 100m</span>
                    <span className="text-xs text-red-600">11.24 PB</span>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                  <p className="text-xs text-red-600 mt-1">0.24s to go!</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">🦘 6.50m Long Jump</span>
                    <span className="text-xs text-blue-600">6.32m PB</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">0.18m to go!</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">📅 Weekly Training</span>
                    <span className="text-xs text-green-600">5/6 sessions</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '83%'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Community</h3>
                <Link href="/community" className="text-blue-600 text-sm hover:text-blue-700">View All</Link>
              </div>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Sarah M. just hit a new PR! 🎉</p>
                  <p className="text-gray-600">Marathon in 3:15:22</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">Weekly Challenge: Log 5 sessions</p>
                  <p className="text-gray-600">127 athletes participating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Choose Workout Template</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Template Search */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={templateSearchQuery}
                    onChange={(e) => handleTemplateSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templateResults.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.category === 'strength' ? 'bg-blue-100 text-blue-700' :
                            template.category === 'cardio' ? 'bg-red-100 text-red-700' :
                            template.category === 'flexibility' ? 'bg-green-100 text-green-700' :
                            template.category === 'recovery' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {template.category}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {template.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.duration}min
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Exercises ({template.exercises.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {template.exercises.slice(0, 3).map((ex, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {ex.exercise.name}
                          </span>
                        ))}
                        {template.exercises.length > 3 && (
                          <span className="text-xs text-gray-500">+{template.exercises.length - 3} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadTemplate(template)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        Load Template
                      </button>
                      <button
                        onClick={() => {
                          loadTemplate(template)
                          setShowAddToTemplate(true)
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                      >
                        Load + Add More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {templateResults.length === 0 && templateSearchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No templates found matching "{templateSearchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exercise Search Modal */}
      {showExerciseSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Exercise</h2>
                <button
                  onClick={() => setShowExerciseSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Exercise Search */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exercises..."
                    value={exerciseSearchQuery}
                    onChange={(e) => handleExerciseSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {/* Athletics-First Categories */}
              {!exerciseSearchQuery && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">🏃 Athletics Training Categories</h3>
                  
                  {/* Featured Athletics Events */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-orange-700 mb-3">Track & Field Events</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(athleticsEvents).slice(0, 8).map(([key, label]) => {
                        const exercises = exerciseDatabase.filter(ex => ex.subcategory === key)
                        return (
                          <button
                            key={key}
                            onClick={() => handleExerciseSearch(key)}
                            className="p-3 text-left border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                          >
                            <div className="font-medium text-orange-900 text-sm">{label}</div>
                            <div className="text-xs text-orange-600">{exercises.length} exercises</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Other Training Categories */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Supporting Training</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categoryOrder.filter(cat => cat !== 'sport-specific').map(category => {
                        const exercises = exerciseDatabase.filter(ex => ex.category === category)
                        return (
                          <button
                            key={category}
                            onClick={() => handleExerciseSearch(category)}
                            className="p-3 text-left border border-gray-200 hover:border-blue-300 rounded-lg transition-colors"
                          >
                            <div className="font-medium text-gray-700 capitalize text-sm">
                              {category === 'warm-up' ? '🔥 Warm-up' :
                               category === 'cool-down' ? '❄️ Cool-down' :
                               category === 'strength' ? '💪 Strength' :
                               category === 'cardio' ? '❤️ Cardio' :
                               category === 'flexibility' ? '🧘 Flexibility' :
                               category === 'recovery' ? '😌 Recovery' : category}
                            </div>
                            <div className="text-xs text-gray-500">{exercises.length} exercises</div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  {searchResults.map((exercise) => (
                    <div key={exercise.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {exercise.category}
                            </span>
                            {exercise.muscleGroups.slice(0, 2).map((muscle, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                {muscle}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {exercise.variations && exercise.variations.length > 0 ? (
                            <div className="flex gap-2">
                              <select
                                onChange={(e) => addExerciseToWorkout(exercise, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                                defaultValue=""
                              >
                                <option value="" disabled>Choose variation</option>
                                {exercise.variations.map((variation) => (
                                  <option key={variation} value={variation}>
                                    {variation}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <button
                              onClick={() => addExerciseToWorkout(exercise)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.length === 0 && exerciseSearchQuery && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No exercises found matching "{exerciseSearchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Additional Exercise Modal */}
      {showAddToTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Additional Exercise</h2>
                <button
                  onClick={() => {
                    setShowAddToTemplate(false)
                    setSelectedCategory('')
                    setSelectedSubcategory('')
                    setAvailableExercises([])
                    setAvailableSubcategories([])
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Selection Controls */}
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exercise Type
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select exercise type...</option>
                      {categoryOrder.map(category => (
                        <option key={category} value={category}>
                          {category === 'sport-specific' ? '🏃 Sport-Specific' :
                           category === 'warm-up' ? '🔥 Warm-up' :
                           category === 'cool-down' ? '❄️ Cool-down' :
                           category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Athletics Event Selection (for Sport-Specific) */}
                  {selectedCategory === 'sport-specific' && availableSubcategories.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Athletics Event
                      </label>
                      <select
                        value={selectedSubcategory}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select athletics event...</option>
                        {availableSubcategories.map(subcategory => (
                          <option key={subcategory} value={subcategory}>
                            {athleticsEvents[subcategory as keyof typeof athleticsEvents] || subcategory}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Status Messages */}
                  {selectedCategory && selectedCategory !== 'sport-specific' && availableExercises.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No exercises found for this category</p>
                    </div>
                  )}

                  {selectedCategory === 'sport-specific' && !selectedSubcategory && availableSubcategories.length > 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">Please select an athletics event to see specific training exercises</p>
                    </div>
                  )}

                  {selectedCategory === 'sport-specific' && selectedSubcategory && availableExercises.length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No exercises found for this athletics event</p>
                    </div>
                  )}
                </div>

                {/* Right Columns - Exercise Selection */}
                {selectedCategory && availableExercises.length > 0 && (
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Available Exercises
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {availableExercises.map((exercise) => (
                        <div key={exercise.id} className="border border-gray-200 rounded-lg p-3 h-fit">
                          <div className="mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{exercise.name}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{exercise.description}</p>
                          </div>
                          
                          {/* Exercise Variations or Add Button */}
                          <div>
                            {exercise.variations && exercise.variations.length > 0 ? (
                              <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                  Choose variation:
                                </label>
                                <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                                  {exercise.variations.map((variation) => (
                                    <button
                                      key={variation}
                                      onClick={() => addExerciseFromDropdown(exercise.id, variation)}
                                      className="text-left p-1.5 text-xs bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded border transition-colors"
                                    >
                                      {variation}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => addExerciseFromDropdown(exercise.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                              >
                                Add {exercise.name}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
