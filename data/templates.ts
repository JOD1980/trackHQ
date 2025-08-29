import { Exercise } from './exercises'

export interface WorkoutTemplate {
  id: string
  name: string
  description: string
  category: 'strength' | 'cardio' | 'flexibility' | 'sport-specific' | 'recovery' | 'mixed'
  duration: number // estimated duration in minutes
  exercises: Array<{
    exercise: Exercise
    sets?: number
    reps?: number
    weight?: number
    time?: number
    distance?: number
    notes?: string
    restTime?: number // rest between sets in seconds
  }>
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdBy?: string // for future coach features
  isPublic?: boolean // for community sharing
  createdAt: string
  updatedAt: string
}

// Pre-built workout templates
export const workoutTemplates: WorkoutTemplate[] = [
  {
    id: 'upper-body-strength',
    name: 'Upper Body Strength',
    description: 'Complete upper body strength workout targeting chest, back, shoulders, and arms',
    category: 'strength',
    duration: 45,
    difficulty: 'intermediate',
    tags: ['strength', 'upper-body', 'gym'],
    exercises: [
      {
        exercise: {
          id: 'bench-press',
          name: 'Bench Press',
          category: 'strength',
          description: 'Upper body pushing movement for chest, shoulders, and triceps',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
          equipment: ['Barbell', 'Dumbbells'],
          trackingType: 'sets-reps'
        },
        sets: 4,
        reps: 8,
        weight: 60,
        restTime: 120,
        notes: 'Focus on controlled movement'
      },
      {
        exercise: {
          id: 'pull-up',
          name: 'Pull-up',
          category: 'strength',
          description: 'Upper body pulling movement for back and biceps',
          muscleGroups: ['Lats', 'Rhomboids', 'Biceps', 'Core'],
          equipment: ['Pull-up Bar', 'Resistance Bands'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 6,
        restTime: 90,
        notes: 'Use assistance if needed'
      },
      {
        exercise: {
          id: 'push-up',
          name: 'Push-up',
          category: 'strength',
          description: 'Bodyweight upper body pushing exercise',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
          equipment: ['Bodyweight'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 15,
        restTime: 60,
        notes: 'Maintain plank position'
      }
    ],
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cardio-hiit',
    name: 'HIIT Cardio Blast',
    description: 'High-intensity interval training for cardiovascular fitness and fat burning',
    category: 'cardio',
    duration: 30,
    difficulty: 'advanced',
    tags: ['cardio', 'hiit', 'fat-burn', 'bodyweight'],
    exercises: [
      {
        exercise: {
          id: 'burpees',
          name: 'Burpees',
          category: 'cardio',
          description: 'High-intensity full-body exercise combining strength and cardio',
          muscleGroups: ['Full Body'],
          equipment: ['Bodyweight'],
          trackingType: 'sets-reps'
        },
        sets: 4,
        reps: 10,
        restTime: 30,
        notes: 'Explosive movement'
      },
      {
        exercise: {
          id: 'jump-rope',
          name: 'Jump Rope',
          category: 'cardio',
          description: 'Coordination and cardio exercise with minimal equipment',
          muscleGroups: ['Calves', 'Shoulders', 'Core'],
          equipment: ['Jump Rope'],
          trackingType: 'time'
        },
        time: 2,
        restTime: 30,
        notes: 'Stay light on feet'
      },
      {
        exercise: {
          id: 'sprint-intervals',
          name: 'Sprint Intervals',
          category: 'sport-specific',
          description: 'High-intensity running intervals for speed and power',
          muscleGroups: ['Legs', 'Core', 'Cardiovascular System'],
          equipment: ['Track', 'Timer'],
          trackingType: 'sets-time'
        },
        sets: 6,
        time: 0.5,
        restTime: 60,
        notes: 'All-out effort'
      }
    ],
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'recovery-day',
    name: 'Active Recovery',
    description: 'Gentle movement and stretching for recovery and mobility',
    category: 'recovery',
    duration: 25,
    difficulty: 'beginner',
    tags: ['recovery', 'flexibility', 'mobility', 'relaxation'],
    exercises: [
      {
        exercise: {
          id: 'yoga-flow',
          name: 'Yoga Flow',
          category: 'flexibility',
          description: 'Dynamic sequence of yoga poses for flexibility and mindfulness',
          muscleGroups: ['Full Body'],
          equipment: ['Yoga Mat'],
          trackingType: 'time'
        },
        time: 15,
        notes: 'Focus on breath and movement'
      },
      {
        exercise: {
          id: 'foam-rolling',
          name: 'Foam Rolling',
          category: 'recovery',
          description: 'Self-myofascial release for muscle recovery',
          muscleGroups: ['Full Body'],
          equipment: ['Foam Roller'],
          trackingType: 'time'
        },
        time: 10,
        notes: 'Target tight areas'
      }
    ],
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'lower-body-power',
    name: 'Lower Body Power',
    description: 'Explosive lower body workout for strength and power development',
    category: 'strength',
    duration: 40,
    difficulty: 'intermediate',
    tags: ['strength', 'lower-body', 'power', 'legs'],
    exercises: [
      {
        exercise: {
          id: 'squat',
          name: 'Squat',
          category: 'strength',
          description: 'Fundamental lower body compound movement targeting quads, glutes, and hamstrings',
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
          equipment: ['Bodyweight', 'Barbell', 'Dumbbells'],
          trackingType: 'sets-reps'
        },
        sets: 4,
        reps: 10,
        weight: 80,
        restTime: 120,
        notes: 'Deep squat, drive through heels'
      },
      {
        exercise: {
          id: 'deadlift',
          name: 'Deadlift',
          category: 'strength',
          description: 'Hip-hinge movement pattern targeting posterior chain',
          muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
          equipment: ['Barbell', 'Dumbbells', 'Kettlebell'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 6,
        weight: 100,
        restTime: 150,
        notes: 'Keep bar close to body'
      },
      {
        exercise: {
          id: 'plyometrics',
          name: 'Plyometric Training',
          category: 'sport-specific',
          description: 'Explosive movements for power development',
          muscleGroups: ['Legs', 'Core'],
          equipment: ['Bodyweight', 'Plyometric Box'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 8,
        restTime: 90,
        notes: 'Focus on explosive takeoff'
      }
    ],
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'beginner-full-body',
    name: 'Beginner Full Body',
    description: 'Perfect introduction to strength training with basic movements',
    category: 'strength',
    duration: 35,
    difficulty: 'beginner',
    tags: ['beginner', 'full-body', 'strength', 'basics'],
    exercises: [
      {
        exercise: {
          id: 'squat',
          name: 'Squat',
          category: 'strength',
          description: 'Fundamental lower body compound movement targeting quads, glutes, and hamstrings',
          muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
          equipment: ['Bodyweight', 'Barbell', 'Dumbbells'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 12,
        restTime: 90,
        notes: 'Focus on form over weight'
      },
      {
        exercise: {
          id: 'push-up',
          name: 'Push-up',
          category: 'strength',
          description: 'Bodyweight upper body pushing exercise',
          muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
          equipment: ['Bodyweight'],
          trackingType: 'sets-reps'
        },
        sets: 3,
        reps: 8,
        restTime: 60,
        notes: 'Modify on knees if needed'
      },
      {
        exercise: {
          id: 'plank',
          name: 'Plank',
          category: 'strength',
          description: 'Isometric core strengthening exercise',
          muscleGroups: ['Core', 'Shoulders', 'Glutes'],
          equipment: ['Bodyweight'],
          trackingType: 'sets-time'
        },
        sets: 3,
        time: 0.5,
        restTime: 60,
        notes: 'Keep body in straight line'
      }
    ],
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export const getTemplatesByCategory = (category: WorkoutTemplate['category']) => {
  return workoutTemplates.filter(template => template.category === category)
}

export const getTemplatesByDifficulty = (difficulty: WorkoutTemplate['difficulty']) => {
  return workoutTemplates.filter(template => template.difficulty === difficulty)
}

export const searchTemplates = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return workoutTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export const getTemplateById = (id: string) => {
  return workoutTemplates.find(template => template.id === id)
}
