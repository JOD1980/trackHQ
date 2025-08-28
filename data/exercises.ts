export interface Exercise {
  id: string
  name: string
  category: 'sport-specific' | 'strength' | 'cardio' | 'flexibility' | 'recovery' | 'warm-up' | 'cool-down'
  subcategory?: string // For sport-specific events like 'sprinting', 'javelin', etc.
  description: string
  muscleGroups?: string[]
  equipment?: string[]
  trackingType: 'sets-reps' | 'time' | 'distance' | 'sets-time' | 'reps-only'
  instructions?: string[]
  variations?: string[] // Specific exercise variations
}

// Athletics event subcategories
export const athleticsEvents = {
  'sprinting': 'Sprinting',
  'distance-running': 'Distance Running', 
  'hurdling': 'Hurdling',
  'javelin': 'Javelin',
  'shot-put': 'Shot Put',
  'discus': 'Discus',
  'hammer': 'Hammer Throw',
  'long-jump': 'Long Jump',
  'triple-jump': 'Triple Jump',
  'high-jump': 'High Jump',
  'pole-vault': 'Pole Vault',
  'general-athletics': 'General Athletics'
}

export interface ExerciseVariation {
  exerciseId: string
  variationName: string
  description?: string
  equipment?: string[]
}

// Reorder categories to prioritize athletics (track/field) over strength training
export const categoryOrder = ['sport-specific', 'strength', 'cardio', 'flexibility', 'warm-up', 'cool-down', 'recovery']

export const exerciseDatabase: Exercise[] = [
  // ===== TRACK EVENTS - PRIMARY FOCUS =====
  
  // Sprint Events (Indoor & Outdoor)
  {
    id: 'sprint-100m',
    name: '100m Sprint',
    category: 'sport-specific',
    subcategory: 'sprinting',
    description: 'Maximum speed sprint over 100 meters - premier track event',
    trackingType: 'time',
    instructions: [
      'Warm up thoroughly with dynamic stretches',
      'Start in blocks or standing start',
      'Drive hard out of the blocks',
      'Maintain form throughout the race',
      'Focus on arm drive and leg turnover'
    ],
    variations: ['Block start', 'Standing start', 'Flying start', 'Indoor track', 'Outdoor track']
  },
  {
    id: 'sprint-200m',
    name: '200m Sprint',
    category: 'sport-specific',
    subcategory: 'sprinting',
    description: 'Speed endurance sprint around the curve',
    trackingType: 'time',
    instructions: [
      'Start strong out of the blocks',
      'Maintain speed through the curve',
      'Drive hard down the home straight',
      'Focus on curve running technique'
    ],
    variations: ['Indoor track', 'Outdoor track', 'Staggered start']
  },
  {
    id: 'sprint-400m',
    name: '400m Sprint',
    category: 'sport-specific',
    subcategory: 'sprinting',
    description: 'One lap sprint requiring speed and endurance',
    trackingType: 'time',
    instructions: [
      'Controlled aggressive start',
      'Maintain form through first 200m',
      'Fight through lactic acid buildup',
      'Strong finish down home straight'
    ],
    variations: ['Indoor track', 'Outdoor track', 'Split times']
  },
  {
    id: 'sprint-60m',
    name: '60m Sprint (Indoor)',
    category: 'sport-specific',
    subcategory: 'sprinting',
    description: 'Indoor sprint focusing on acceleration and top speed',
    trackingType: 'time',
    instructions: [
      'Explosive start from blocks',
      'Quick acceleration phase',
      'Reach maximum velocity',
      'Maintain form to finish'
    ],
    variations: ['Block start', 'Standing start']
  },

  // Distance Events
  {
    id: 'distance-800m',
    name: '800m Run',
    category: 'sport-specific',
    subcategory: 'middle-distance',
    description: 'Two lap tactical race combining speed and endurance',
    trackingType: 'time',
    instructions: [
      'Strategic positioning at start',
      'Controlled first 400m',
      'Tactical awareness in pack',
      'Strong kick in final 200m'
    ],
    variations: ['Indoor track', 'Outdoor track', 'Negative split', 'Even pace']
  },
  {
    id: 'distance-1500m',
    name: '1500m Run',
    category: 'sport-specific',
    subcategory: 'middle-distance',
    description: 'Metric mile requiring tactical racing and speed',
    trackingType: 'time',
    instructions: [
      'Position well at start',
      'Stay relaxed through 800m',
      'Cover moves in third 400m',
      'Sprint finish last 300m'
    ],
    variations: ['Indoor track', 'Outdoor track', 'Pace variations']
  },
  {
    id: 'distance-5000m',
    name: '5000m Run',
    category: 'sport-specific',
    subcategory: 'long-distance',
    description: 'Endurance track race requiring pace judgment',
    trackingType: 'time',
    instructions: [
      'Settle into rhythm early',
      'Monitor pace splits',
      'Stay with lead pack',
      'Time finishing kick perfectly'
    ],
    variations: ['Even pace', 'Negative split', 'Surge tactics']
  },

  // Hurdle Events
  {
    id: 'hurdles-110m',
    name: '110m Hurdles (Men)',
    category: 'sport-specific',
    subcategory: 'hurdling',
    description: 'Sprint hurdles requiring speed and technique',
    trackingType: 'time',
    instructions: [
      'Explosive start to first hurdle',
      'Maintain 3-step rhythm',
      'Lead leg drive over hurdles',
      'Quick trail leg recovery'
    ],
    variations: ['Full height', 'Lowered hurdles', 'Rhythm drills']
  },
  {
    id: 'hurdles-100m',
    name: '100m Hurdles (Women)',
    category: 'sport-specific',
    subcategory: 'hurdling',
    description: 'Sprint hurdles for women requiring speed and technique',
    trackingType: 'time',
    instructions: [
      'Quick start to first hurdle',
      'Maintain rhythm between hurdles',
      'Aggressive lead leg action',
      'Fast trail leg clearance'
    ],
    variations: ['Full height', 'Lowered hurdles', 'Rhythm work']
  },
  {
    id: 'hurdles-400m',
    name: '400m Hurdles',
    category: 'sport-specific',
    subcategory: 'hurdling',
    description: 'One lap with hurdles requiring endurance and technique',
    trackingType: 'time',
    instructions: [
      'Controlled start and rhythm',
      'Maintain stride pattern',
      'Adapt to fatigue in final hurdles',
      'Strong finish between last hurdle and line'
    ],
    variations: ['13-step pattern', '15-step pattern', 'Mixed patterns']
  },

  // ===== FIELD EVENTS =====
  
  // Jumping Events
  {
    id: 'long-jump',
    name: 'Long Jump',
    category: 'sport-specific',
    subcategory: 'long-jump',
    description: 'Horizontal jump for maximum distance',
    trackingType: 'distance',
    instructions: [
      'Consistent approach run',
      'Hit takeoff board accurately',
      'Drive knee up at takeoff',
      'Extend legs forward for landing'
    ],
    variations: ['Full approach', 'Short approach', 'Standing long jump']
  },
  {
    id: 'triple-jump',
    name: 'Triple Jump',
    category: 'sport-specific',
    subcategory: 'triple-jump',
    description: 'Hop, step, jump sequence for maximum distance',
    trackingType: 'distance',
    instructions: [
      'Controlled approach speed',
      'Strong hop phase',
      'Balanced step phase',
      'Powerful jump into pit'
    ],
    variations: ['Full approach', 'Short approach', 'Phase practice']
  },
  {
    id: 'high-jump',
    name: 'High Jump',
    category: 'sport-specific',
    subcategory: 'high-jump',
    description: 'Vertical jump over a crossbar',
    trackingType: 'distance',
    instructions: [
      'Curved approach run',
      'Plant takeoff foot close to bar',
      'Drive free leg up and over',
      'Arch back over the bar'
    ],
    variations: ['Fosbury flop', 'Scissors technique', 'Approach work']
  },
  {
    id: 'pole-vault',
    name: 'Pole Vault',
    category: 'sport-specific',
    subcategory: 'pole-vault',
    description: 'Vault over crossbar using a pole',
    trackingType: 'distance',
    instructions: [
      'Consistent approach with pole',
      'Plant pole in box',
      'Swing up and invert',
      'Push off pole and clear bar'
    ],
    variations: ['Short approach', 'Full approach', 'Technique drills']
  },

  // Throwing Events
  {
    id: 'shot-put',
    name: 'Shot Put',
    category: 'sport-specific',
    subcategory: 'shot-put',
    description: 'Throw heavy ball for maximum distance',
    trackingType: 'distance',
    instructions: [
      'Proper grip and stance',
      'Glide or spin technique',
      'Explosive release',
      'Follow through across circle'
    ],
    variations: ['Glide technique', 'Spin technique', 'Standing throw']
  },
  {
    id: 'discus',
    name: 'Discus Throw',
    category: 'sport-specific',
    subcategory: 'discus',
    description: 'Spinning throw of discus for distance',
    trackingType: 'distance',
    instructions: [
      'Proper discus grip',
      'One and a half turn technique',
      'Build momentum through turns',
      'Release at optimal angle'
    ],
    variations: ['Standing throw', 'Full turn', 'Rhythm drills']
  },
  {
    id: 'javelin',
    name: 'Javelin Throw',
    category: 'sport-specific',
    subcategory: 'javelin',
    description: 'Running throw of javelin for maximum distance',
    trackingType: 'distance',
    instructions: [
      'Controlled approach run',
      'Proper javelin carry',
      'Crossover steps',
      'Explosive release over shoulder'
    ],
    variations: ['Short approach', 'Full approach', 'Standing throw']
  },
  {
    id: 'hammer',
    name: 'Hammer Throw',
    category: 'sport-specific',
    subcategory: 'hammer',
    description: 'Spinning throw of hammer for distance',
    trackingType: 'distance',
    instructions: [
      'Proper grip and stance',
      'Build speed through turns',
      'Maintain balance',
      'Release at optimal point'
    ],
    variations: ['Two turns', 'Three turns', 'Four turns']
  },

  // ===== ATHLETICS TRAINING DRILLS =====
  
  // Sprint Training
  {
    id: 'sprint-drills',
    name: 'Sprint Technique Drills',
    category: 'sport-specific',
    subcategory: 'sprinting',
    description: 'Technical drills for sprint mechanics',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Cones', 'Ladder'],
    trackingType: 'sets-reps',
    instructions: [
      'A-skips for knee drive',
      'B-skips for leg mechanics',
      'High knees for frequency',
      'Butt kicks for recovery'
    ],
    variations: [
      'A-Skips',
      'B-Skips',
      'High Knees',
      'Butt Kicks',
      'Straight Leg Bounds',
      'Fast Leg Drills',
      'Wall Drills',
      'Marching Drills'
    ]
  },

  // DISTANCE RUNNING
  {
    id: 'distance-training',
    name: 'Distance Running',
    category: 'sport-specific',
    subcategory: 'distance-running',
    description: 'Endurance training for middle and long distance events',
    muscleGroups: ['Legs', 'Cardiovascular System'],
    equipment: ['Track', 'Timer'],
    trackingType: 'time',
    variations: [
      'Easy Runs',
      'Tempo Runs',
      'Interval Training',
      'Fartlek',
      'Long Runs',
      '800m Repeats',
      '1500m Pace',
      'Marathon Pace'
    ]
  },

  // HURDLING
  {
    id: 'hurdle-training',
    name: 'Hurdle Training',
    category: 'sport-specific',
    subcategory: 'hurdling',
    description: 'Technique and rhythm training for hurdle events',
    muscleGroups: ['Legs', 'Core', 'Hip Flexors'],
    equipment: ['Hurdles', 'Mini Hurdles'],
    trackingType: 'sets-reps',
    variations: [
      '110m Hurdles',
      '100m Hurdles',
      '400m Hurdles',
      'Trail Leg Drills',
      'Lead Leg Drills',
      'Hurdle Mobility',
      'Three Step Rhythm',
      'Hurdle Walks'
    ]
  },

  // JAVELIN
  {
    id: 'javelin-training',
    name: 'Javelin Training',
    category: 'sport-specific',
    subcategory: 'javelin',
    description: 'Technical and strength training for javelin throw',
    muscleGroups: ['Shoulders', 'Core', 'Legs', 'Back'],
    equipment: ['Javelin', 'Medicine Ball'],
    trackingType: 'sets-reps',
    variations: [
      'Standing Throws',
      'Approach Runs',
      'Crossover Steps',
      'Block Position',
      'Release Drills',
      'Javelin Carries',
      'Throwing Rhythm',
      'Competition Throws'
    ]
  },

  // SHOT PUT
  {
    id: 'shot-put-training',
    name: 'Shot Put Training',
    category: 'sport-specific',
    subcategory: 'shot-put',
    description: 'Power and technique training for shot put',
    muscleGroups: ['Shoulders', 'Core', 'Legs', 'Chest'],
    equipment: ['Shot Put', 'Medicine Ball'],
    trackingType: 'sets-reps',
    variations: [
      'Standing Throws',
      'Glide Technique',
      'Spin Technique',
      'Power Position',
      'Release Drills',
      'Footwork Drills',
      'Strength Throws',
      'Competition Throws'
    ]
  },

  // DISCUS
  {
    id: 'discus-training',
    name: 'Discus Training',
    category: 'sport-specific',
    subcategory: 'discus',
    description: 'Rotational power and technique for discus throw',
    muscleGroups: ['Core', 'Shoulders', 'Legs', 'Back'],
    equipment: ['Discus', 'Medicine Ball'],
    trackingType: 'sets-reps',
    variations: [
      'Standing Throws',
      'Spin Drills',
      'Entry Position',
      'Power Position',
      'Release Technique',
      'Footwork Patterns',
      'Rhythm Training',
      'Competition Throws'
    ]
  },

  // HAMMER THROW
  {
    id: 'hammer-training',
    name: 'Hammer Training',
    category: 'sport-specific',
    subcategory: 'hammer',
    description: 'Rotational training for hammer throw',
    muscleGroups: ['Core', 'Shoulders', 'Legs', 'Back'],
    equipment: ['Hammer', 'Training Hammer'],
    trackingType: 'sets-reps',
    variations: [
      'Swings Only',
      'Turns Practice',
      'Entry Drills',
      'Release Training',
      'Footwork Drills',
      'Balance Training',
      'Full Throws',
      'Competition Practice'
    ]
  },

  // LONG JUMP
  {
    id: 'long-jump-training',
    name: 'Long Jump Training',
    category: 'sport-specific',
    subcategory: 'long-jump',
    description: 'Speed and technique training for long jump',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Runway', 'Sand Pit', 'Measuring Tape'],
    trackingType: 'sets-reps',
    variations: [
      'Approach Runs',
      'Takeoff Drills',
      'Flight Technique',
      'Landing Practice',
      'Short Approach',
      'Full Approach',
      'Standing Long Jump',
      'Competition Jumps'
    ]
  },

  // TRIPLE JUMP
  {
    id: 'triple-jump-training',
    name: 'Triple Jump Training',
    category: 'sport-specific',
    subcategory: 'triple-jump',
    description: 'Rhythm and technique training for triple jump',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Runway', 'Sand Pit'],
    trackingType: 'sets-reps',
    variations: [
      'Hop-Step-Jump',
      'Phase Practice',
      'Rhythm Training',
      'Approach Runs',
      'Takeoff Drills',
      'Landing Practice',
      'Bounding Drills',
      'Competition Jumps'
    ]
  },

  // HIGH JUMP
  {
    id: 'high-jump-training',
    name: 'High Jump Training',
    category: 'sport-specific',
    subcategory: 'high-jump',
    description: 'Technique and approach training for high jump',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['High Jump Bar', 'Mats', 'Standards'],
    trackingType: 'sets-reps',
    variations: [
      'Approach Runs',
      'Takeoff Drills',
      'Flop Technique',
      'Bar Clearance',
      'Curve Running',
      'Plant Practice',
      'Height Progression',
      'Competition Jumps'
    ]
  },

  // POLE VAULT
  {
    id: 'pole-vault-training',
    name: 'Pole Vault Training',
    category: 'sport-specific',
    subcategory: 'pole-vault',
    description: 'Technical training for pole vault',
    muscleGroups: ['Full Body', 'Core', 'Arms'],
    equipment: ['Pole', 'Mats', 'Standards'],
    trackingType: 'sets-reps',
    variations: [
      'Approach Runs',
      'Plant Practice',
      'Swing Drills',
      'Inversion Training',
      'Bar Clearance',
      'Pole Progression',
      'Height Training',
      'Competition Vaults'
    ]
  },

  // GENERAL ATHLETICS
  {
    id: 'plyometrics',
    name: 'Plyometric Training',
    category: 'sport-specific',
    subcategory: 'general-athletics',
    description: 'Explosive movements for power development',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Bodyweight', 'Plyometric Box'],
    trackingType: 'sets-reps',
    variations: [
      'Box Jumps',
      'Depth Jumps',
      'Broad Jumps',
      'Single Leg Bounds',
      'Lateral Bounds',
      'Tuck Jumps',
      'Split Jumps',
      'Reactive Jumps'
    ]
  },
  {
    id: 'agility-drills',
    name: 'Agility Training',
    category: 'sport-specific',
    subcategory: 'general-athletics',
    description: 'Movement patterns for athletic performance',
    muscleGroups: ['Full Body'],
    equipment: ['Cones', 'Agility Ladder', 'Hurdles'],
    trackingType: 'sets-time',
    variations: [
      'Ladder Drills',
      'Cone Weaving',
      'T-Drill',
      '5-10-5 Shuttle',
      'Box Drill',
      'Hexagon Drill',
      'Mirror Drill',
      'Reactive Agility'
    ]
  },

  // WARM-UP EXERCISES
  {
    id: 'dynamic-warm-up',
    name: 'Dynamic Warm-up',
    category: 'warm-up',
    description: 'Movement-based warm-up exercises to prepare the body for training',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time',
    variations: [
      'High Knees',
      'Butt Kicks',
      'Leg Swings',
      'Arm Circles',
      'Walking Lunges',
      'Leg Kicks',
      'Hip Circles',
      'Ankle Rolls'
    ]
  },
  {
    id: 'activation-exercises',
    name: 'Activation Exercises',
    category: 'warm-up',
    description: 'Targeted exercises to activate specific muscle groups',
    muscleGroups: ['Glutes', 'Core', 'Shoulders'],
    equipment: ['Resistance Bands', 'Bodyweight'],
    trackingType: 'sets-reps',
    variations: [
      'Glute Bridges',
      'Clamshells',
      'Band Pull-Aparts',
      'Plank Hold',
      'Bird Dogs',
      'Wall Slides',
      'Fire Hydrants',
      'Dead Bugs'
    ]
  },
  {
    id: 'mobility-warm-up',
    name: 'Mobility Warm-up',
    category: 'warm-up',
    description: 'Joint mobility and range of motion exercises',
    muscleGroups: ['Joints', 'Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time',
    variations: [
      'Cat-Cow Stretch',
      'Shoulder Rolls',
      'Hip Flexor Stretch',
      'Thoracic Spine Rotation',
      'Ankle Mobility',
      'Neck Rolls',
      'Wrist Circles',
      'Spinal Waves'
    ]
  },

  // COOL-DOWN EXERCISES
  {
    id: 'static-stretching',
    name: 'Static Stretching',
    category: 'cool-down',
    description: 'Hold stretches to improve flexibility and aid recovery',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time',
    variations: [
      'Quad Stretch',
      'Hamstring Stretch',
      'Calf Stretch',
      'Hip Flexor Stretch',
      'Chest Stretch',
      'Shoulder Stretch',
      'IT Band Stretch',
      'Pigeon Pose'
    ]
  },
  {
    id: 'recovery-walk',
    name: 'Recovery Movement',
    category: 'cool-down',
    description: 'Light movement to aid recovery and circulation',
    muscleGroups: ['Cardiovascular System', 'Legs'],
    equipment: ['Bodyweight'],
    trackingType: 'time',
    variations: [
      'Slow Walk',
      'Easy Jog',
      'Gentle Cycling',
      'Pool Walking',
      'Light Swimming',
      'Tai Chi Movements',
      'Gentle Yoga Flow',
      'Breathing Walk'
    ]
  },
  {
    id: 'relaxation-techniques',
    name: 'Relaxation & Recovery',
    category: 'cool-down',
    description: 'Techniques to promote relaxation and mental recovery',
    muscleGroups: ['Mind-Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time',
    variations: [
      'Deep Breathing',
      'Progressive Muscle Relaxation',
      'Meditation',
      'Visualization',
      'Body Scan',
      'Gentle Stretching',
      'Savasana',
      'Mindful Walking'
    ]
  },

  // STRENGTH EXERCISES
  {
    id: 'squat',
    name: 'Squat',
    category: 'strength',
    description: 'Fundamental lower body compound movement targeting quads, glutes, and hamstrings',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    equipment: ['Bodyweight', 'Barbell', 'Dumbbells'],
    trackingType: 'sets-reps',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Lower body by bending knees and hips',
      'Keep chest up and knees tracking over toes',
      'Return to starting position'
    ]
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'strength',
    description: 'Hip-hinge movement pattern targeting posterior chain',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
    equipment: ['Barbell', 'Dumbbells', 'Kettlebell'],
    trackingType: 'sets-reps'
  },
  {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'strength',
    description: 'Upper body pushing movement for chest, shoulders, and triceps',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
    equipment: ['Barbell', 'Dumbbells'],
    trackingType: 'sets-reps'
  },
  {
    id: 'pull-up',
    name: 'Pull-up',
    category: 'strength',
    description: 'Upper body pulling movement for back and biceps',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps', 'Core'],
    equipment: ['Pull-up Bar', 'Resistance Bands'],
    trackingType: 'sets-reps'
  },
  {
    id: 'push-up',
    name: 'Push-up',
    category: 'strength',
    description: 'Bodyweight upper body pushing exercise',
    muscleGroups: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    equipment: ['Bodyweight'],
    trackingType: 'sets-reps'
  },
  {
    id: 'plank',
    name: 'Plank',
    category: 'strength',
    description: 'Isometric core strengthening exercise',
    muscleGroups: ['Core', 'Shoulders', 'Glutes'],
    equipment: ['Bodyweight'],
    trackingType: 'sets-time'
  },

  // CARDIO EXERCISES
  {
    id: 'running',
    name: 'Running',
    category: 'cardio',
    description: 'Aerobic exercise for cardiovascular fitness and endurance',
    muscleGroups: ['Legs', 'Core', 'Cardiovascular System'],
    equipment: ['Running Shoes'],
    trackingType: 'distance'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    category: 'cardio',
    description: 'Low-impact cardio exercise for leg strength and endurance',
    muscleGroups: ['Quadriceps', 'Hamstrings', 'Calves', 'Glutes'],
    equipment: ['Bicycle', 'Stationary Bike'],
    trackingType: 'distance'
  },
  {
    id: 'rowing',
    name: 'Rowing',
    category: 'cardio',
    description: 'Full-body cardio exercise combining upper and lower body',
    muscleGroups: ['Back', 'Arms', 'Legs', 'Core'],
    equipment: ['Rowing Machine', 'Boat'],
    trackingType: 'distance'
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    description: 'High-intensity full-body exercise combining strength and cardio',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'sets-reps'
  },
  {
    id: 'jump-rope',
    name: 'Jump Rope',
    category: 'cardio',
    description: 'Coordination and cardio exercise with minimal equipment',
    muscleGroups: ['Calves', 'Shoulders', 'Core'],
    equipment: ['Jump Rope'],
    trackingType: 'time'
  },

  // FLEXIBILITY EXERCISES
  {
    id: 'yoga-flow',
    name: 'Yoga Flow',
    category: 'flexibility',
    description: 'Dynamic sequence of yoga poses for flexibility and mindfulness',
    muscleGroups: ['Full Body'],
    equipment: ['Yoga Mat'],
    trackingType: 'time'
  },
  {
    id: 'dynamic-warmup',
    name: 'Dynamic Warm-up',
    category: 'flexibility',
    description: 'Movement-based stretching to prepare body for exercise',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time'
  },
  {
    id: 'static-stretching',
    name: 'Static Stretching',
    category: 'flexibility',
    description: 'Hold stretches to improve flexibility and recovery',
    muscleGroups: ['Full Body'],
    equipment: ['Bodyweight'],
    trackingType: 'time'
  },

  // SPORT-SPECIFIC EXERCISES
  {
    id: 'sprint-intervals',
    name: 'Sprint Intervals',
    category: 'sport-specific',
    description: 'High-intensity running intervals for speed and power',
    muscleGroups: ['Legs', 'Core', 'Cardiovascular System'],
    equipment: ['Track', 'Timer'],
    trackingType: 'sets-time'
  },
  {
    id: 'agility-ladder',
    name: 'Agility Ladder',
    category: 'sport-specific',
    description: 'Footwork drills for coordination and agility',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Agility Ladder'],
    trackingType: 'sets-time'
  },
  {
    id: 'plyometrics',
    name: 'Plyometric Training',
    category: 'sport-specific',
    description: 'Explosive movements for power development',
    muscleGroups: ['Legs', 'Core'],
    equipment: ['Bodyweight', 'Plyometric Box'],
    trackingType: 'sets-reps'
  },

  // RECOVERY EXERCISES
  {
    id: 'foam-rolling',
    name: 'Foam Rolling',
    category: 'recovery',
    description: 'Self-myofascial release for muscle recovery',
    muscleGroups: ['Full Body'],
    equipment: ['Foam Roller'],
    trackingType: 'time'
  },
  {
    id: 'meditation',
    name: 'Meditation',
    category: 'recovery',
    description: 'Mindfulness practice for mental recovery and focus',
    muscleGroups: ['Mind'],
    equipment: ['None'],
    trackingType: 'time'
  },
  {
    id: 'breathing-exercises',
    name: 'Breathing Exercises',
    category: 'recovery',
    description: 'Controlled breathing for relaxation and recovery',
    muscleGroups: ['Respiratory System'],
    equipment: ['None'],
    trackingType: 'time'
  }
]

export const getExercisesByCategory = (category: Exercise['category']) => {
  return exerciseDatabase.filter(exercise => exercise.category === category)
}

export const searchExercises = (query: string) => {
  const lowercaseQuery = query.toLowerCase()
  return exerciseDatabase.filter(exercise => 
    exercise.name.toLowerCase().includes(lowercaseQuery) ||
    exercise.description.toLowerCase().includes(lowercaseQuery) ||
    exercise.muscleGroups?.some(muscle => muscle.toLowerCase().includes(lowercaseQuery))
  )
}

export const getExerciseById = (id: string) => {
  return exerciseDatabase.find(exercise => exercise.id === id)
}
