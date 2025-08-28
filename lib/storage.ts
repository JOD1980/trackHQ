// Data persistence layer for TrackHQ with multi-user support
// Currently uses localStorage, can be easily switched to backend API

import { UserManager } from './userManager'

export interface WorkoutEntry {
  id: string
  date: string
  exercises: string
  positives: string
  improvements: string
  goals: string
  selectedExercises: Array<{
    exerciseId: string
    exerciseName: string
    variation?: string
    sets?: number
    reps?: number
    weight?: number
    time?: number
    distance?: number
    notes: string
  }>
}

export interface SavedTemplate {
  id: string
  name: string
  description: string
  exercises: Array<{
    exerciseId: string
    exerciseName: string
    variation?: string
    sets?: number
    reps?: number
    weight?: number
    time?: number
    distance?: number
    notes: string
  }>
  createdAt: string
  updatedAt: string
}

export class StorageService {
  private static getKey(key: string): string {
    const currentUser = UserManager.getCurrentUser()
    if (currentUser) {
      return UserManager.getUserDataKey(currentUser.id, key)
    }
    // Fallback for backwards compatibility
    return `trackhq_${key}`
  }

  private getWorkoutsKey(): string {
    return StorageService.getKey('workouts')
  }
  
  private getTemplatesKey(): string {
    return StorageService.getKey('templates')
  }
  
  private getUserPrefsKey(): string {
    return StorageService.getKey('user_prefs')
  }

  // Get all workouts for current user
  getWorkouts(): WorkoutEntry[] {
    try {
      const data = localStorage.getItem(this.getWorkoutsKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading workouts:', error)
      return []
    }
  }

  async saveWorkout(workout: WorkoutEntry): Promise<void> {
    try {
      const workouts = this.getWorkouts()
      const existingIndex = workouts.findIndex(w => w.id === workout.id)
      
      if (existingIndex >= 0) {
        workouts[existingIndex] = { ...workouts[existingIndex], ...workout }
      } else {
        workouts.unshift(workout)
      }
      
      localStorage.setItem(this.getWorkoutsKey(), JSON.stringify(workouts))
    } catch (error) {
      console.error('Error saving workout:', error)
      throw error
    }
  }

  getWorkoutByDate(date: string): WorkoutEntry | null {
    const workouts = this.getWorkouts()
    return workouts.find(w => w.date === date) || null
  }

  async deleteWorkout(workoutId: string): Promise<void> {
    try {
      const workouts = this.getWorkouts()
      const filteredWorkouts = workouts.filter(w => w.id !== workoutId)
      localStorage.setItem(this.getWorkoutsKey(), JSON.stringify(filteredWorkouts))
    } catch (error) {
      console.error('Error deleting workout:', error)
      throw error
    }
  }

  async saveTemplate(template: SavedTemplate): Promise<void> {
    try {
      const templates = this.getTemplates()
      const existingIndex = templates.findIndex(t => t.id === template.id)
      
      if (existingIndex >= 0) {
        templates[existingIndex] = { ...templates[existingIndex], ...template }
      } else {
        templates.unshift(template)
      }
      
      localStorage.setItem(this.getTemplatesKey(), JSON.stringify(templates))
    } catch (error) {
      console.error('Error saving template:', error)
      throw error
    }
  }

  getTemplates(): SavedTemplate[] {
    try {
      const data = localStorage.getItem(this.getTemplatesKey())
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading templates:', error)
      return []
    }
  }

  getTemplateById(templateId: string): SavedTemplate | null {
    const templates = this.getTemplates()
    return templates.find(t => t.id === templateId) || null
  }

  async deleteTemplate(templateId: string): Promise<void> {
    try {
      const templates = this.getTemplates()
      const filteredTemplates = templates.filter(t => t.id !== templateId)
      localStorage.setItem(this.getTemplatesKey(), JSON.stringify(filteredTemplates))
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  async saveUserPreferences(prefs: Record<string, any>): Promise<void> {
    try {
      localStorage.setItem(this.getUserPrefsKey(), JSON.stringify(prefs))
    } catch (error) {
      console.error('Error saving preferences:', error)
      throw error
    }
  }

  getUserPreferences(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.getUserPrefsKey())
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error loading preferences:', error)
      return {}
    }
  }

  generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  exportAllData(): { workouts: WorkoutEntry[], templates: SavedTemplate[], preferences: Record<string, any> } {
    return {
      workouts: this.getWorkouts(),
      templates: this.getTemplates(),
      preferences: this.getUserPreferences()
    }
  }

  async importAllData(data: { workouts?: WorkoutEntry[], templates?: SavedTemplate[], preferences?: Record<string, any> }): Promise<void> {
    try {
      if (data.workouts) {
        localStorage.setItem(this.getWorkoutsKey(), JSON.stringify(data.workouts))
      }
      
      if (data.templates) {
        localStorage.setItem(this.getTemplatesKey(), JSON.stringify(data.templates))
      }
      
      if (data.preferences) {
        localStorage.setItem(this.getUserPrefsKey(), JSON.stringify(data.preferences))
      }
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }

  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.getWorkoutsKey())
      localStorage.removeItem(this.getTemplatesKey())
      localStorage.removeItem(this.getUserPrefsKey())
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  }
}

export const storageService = new StorageService()
