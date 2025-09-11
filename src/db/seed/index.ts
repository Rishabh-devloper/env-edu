import { db } from '../index'
import { 
  badges,
  tasks, 
  lessons,
  schools,
  quizzes
} from '../schema'
import { randomUUID } from 'crypto'

// Environmental Education Badges
const badgesSeedData = [
  // Eco Action Category
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Complete your first environmental task',
    icon: '🌱',
    category: 'eco_action',
    rarity: 'common',
    pointsRequired: 50,
    criteria: {
      type: 'tasks' as const,
      target: 1,
      conditions: { category: 'any' }
    },
    isActive: true
  },
  {
    id: 'tree-guardian',
    name: 'Tree Guardian',
    description: 'Plant or help plant 5 trees',
    icon: '🌳',
    category: 'eco_action',
    rarity: 'common',
    pointsRequired: 100,
    criteria: {
      type: 'tasks' as const,
      target: 5,
      conditions: { category: 'tree_planting' }
    },
    isActive: true
  },
  {
    id: 'waste-warrior',
    name: 'Waste Warrior',
    description: 'Complete 3 waste management tasks',
    icon: '♻️',
    category: 'eco_action',
    rarity: 'common',
    pointsRequired: 150,
    criteria: {
      type: 'tasks' as const,
      target: 3,
      conditions: { category: 'waste_management' }
    },
    isActive: true
  },
  {
    id: 'energy-champion',
    name: 'Energy Champion',
    description: 'Complete energy conservation challenges',
    icon: '⚡',
    category: 'eco_action',
    rarity: 'rare',
    pointsRequired: 200,
    criteria: {
      type: 'tasks' as const,
      target: 3,
      conditions: { category: 'energy_conservation' }
    },
    isActive: true
  },
  {
    id: 'water-saver',
    name: 'Water Saver',
    description: 'Complete water conservation activities',
    icon: '💧',
    category: 'eco_action',
    rarity: 'rare',
    pointsRequired: 200,
    criteria: {
      type: 'tasks' as const,
      target: 3,
      conditions: { category: 'water_conservation' }
    },
    isActive: true
  },

  // Knowledge Category
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 5 environmental lessons',
    icon: '📚',
    category: 'knowledge',
    rarity: 'common',
    pointsRequired: 125,
    criteria: {
      type: 'lessons' as const,
      target: 5
    },
    isActive: true
  },
  {
    id: 'climate-expert',
    name: 'Climate Expert',
    description: 'Complete 10 lessons on climate change',
    icon: '🌍',
    category: 'knowledge',
    rarity: 'rare',
    pointsRequired: 300,
    criteria: {
      type: 'lessons' as const,
      target: 10,
      conditions: { topic: 'climate_change' }
    },
    isActive: true
  },
  {
    id: 'eco-scholar',
    name: 'Eco Scholar',
    description: 'Complete 20 environmental lessons',
    icon: '🎓',
    category: 'knowledge',
    rarity: 'epic',
    pointsRequired: 500,
    criteria: {
      type: 'lessons' as const,
      target: 20
    },
    isActive: true
  },

  // Leadership Category
  {
    id: 'green-leader',
    name: 'Green Leader',
    description: 'Maintain a 7-day learning streak',
    icon: '👑',
    category: 'leadership',
    rarity: 'rare',
    pointsRequired: 250,
    criteria: {
      type: 'streak' as const,
      target: 7
    },
    isActive: true
  },
  {
    id: 'eco-mentor',
    name: 'Eco Mentor',
    description: 'Maintain a 30-day learning streak',
    icon: '🌟',
    category: 'leadership',
    rarity: 'epic',
    pointsRequired: 750,
    criteria: {
      type: 'streak' as const,
      target: 30
    },
    isActive: true
  },

  // Community Category
  {
    id: 'planet-protector',
    name: 'Planet Protector',
    description: 'Earn 500 eco-points',
    icon: '🛡️',
    category: 'community',
    rarity: 'rare',
    pointsRequired: 500,
    criteria: {
      type: 'points' as const,
      target: 500
    },
    isActive: true
  },
  {
    id: 'earth-champion',
    name: 'Earth Champion',
    description: 'Earn 1000 eco-points',
    icon: '🏆',
    category: 'community',
    rarity: 'epic',
    pointsRequired: 1000,
    criteria: {
      type: 'points' as const,
      target: 1000
    },
    isActive: true
  },
  {
    id: 'sustainability-legend',
    name: 'Sustainability Legend',
    description: 'Earn 2500 eco-points',
    icon: '🏅',
    category: 'community',
    rarity: 'legendary',
    pointsRequired: 2500,
    criteria: {
      type: 'points' as const,
      target: 2500
    },
    isActive: true
  }
]

// Environmental Tasks
const tasksSeedData = [
  // Tree Planting Tasks
  {
    id: 'plant-tree-home',
    title: 'Plant a Tree in Your Community',
    description: 'Plant a native tree sapling in your neighborhood, school, or home garden. Take photos of the planting process and the young tree.',
    category: 'tree_planting',
    difficulty: 'easy',
    ecoPoints: 50,
    estimatedTime: 60,
    requirements: {
      photoRequired: true,
      locationRequired: true,
      descriptionMinLength: 50,
      verificationType: 'teacher' as const,
      materials: ['Tree sapling', 'Shovel', 'Water', 'Compost/fertilizer']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'school-garden',
    title: 'Create a School Garden',
    description: 'Work with your class to create a small vegetable or herb garden at school. Document the planning, planting, and initial growth.',
    category: 'tree_planting',
    difficulty: 'medium',
    ecoPoints: 100,
    estimatedTime: 120,
    requirements: {
      photoRequired: true,
      locationRequired: true,
      descriptionMinLength: 100,
      verificationType: 'teacher' as const,
      materials: ['Seeds/saplings', 'Garden tools', 'Compost', 'Watering can']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'tree-survey',
    title: 'Local Tree Species Survey',
    description: 'Survey and document at least 10 different tree species in your area. Create a mini field guide with photos and basic information.',
    category: 'tree_planting',
    difficulty: 'medium',
    ecoPoints: 75,
    estimatedTime: 90,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 150,
      verificationType: 'peer' as const,
      materials: ['Camera/phone', 'Notebook', 'Tree identification guide']
    },
    isActive: true,
    createdBy: 'system'
  },

  // Waste Management Tasks
  {
    id: 'plastic-free-day',
    title: 'Plastic-Free Day Challenge',
    description: 'Spend an entire day avoiding single-use plastics. Document your alternatives and challenges faced.',
    category: 'waste_management',
    difficulty: 'easy',
    ecoPoints: 40,
    estimatedTime: 30,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 75,
      verificationType: 'auto' as const,
      materials: ['Reusable bags', 'Water bottle', 'Food containers']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'waste-audit',
    title: 'Household Waste Audit',
    description: 'Conduct a one-week audit of your household waste. Categorize, weigh, and analyze what can be reduced, reused, or recycled.',
    category: 'waste_management',
    difficulty: 'medium',
    ecoPoints: 80,
    estimatedTime: 45,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 100,
      verificationType: 'teacher' as const,
      materials: ['Scale', 'Notebook', 'Gloves', 'Bags for sorting']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'upcycling-project',
    title: 'Creative Upcycling Project',
    description: 'Transform waste materials into something useful or decorative. Examples: plastic bottle planters, newspaper art, cardboard furniture.',
    category: 'waste_management',
    difficulty: 'medium',
    ecoPoints: 90,
    estimatedTime: 90,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 80,
      verificationType: 'peer' as const,
      materials: ['Waste materials', 'Craft supplies', 'Tools as needed']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'community-cleanup',
    title: 'Organize Community Cleanup',
    description: 'Organize or participate in a community cleanup drive. Focus on parks, beaches, or local areas that need attention.',
    category: 'waste_management',
    difficulty: 'hard',
    ecoPoints: 120,
    estimatedTime: 120,
    requirements: {
      photoRequired: true,
      locationRequired: true,
      descriptionMinLength: 120,
      verificationType: 'teacher' as const,
      materials: ['Gloves', 'Trash bags', 'Pickup tools', 'Safety equipment']
    },
    isActive: true,
    createdBy: 'system'
  },

  // Energy Conservation Tasks
  {
    id: 'energy-audit',
    title: 'Home Energy Audit',
    description: 'Conduct an energy audit of your home. Check for energy leaks, inefficient appliances, and suggest improvements.',
    category: 'energy_conservation',
    difficulty: 'easy',
    ecoPoints: 60,
    estimatedTime: 60,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 100,
      verificationType: 'teacher' as const,
      materials: ['Thermometer', 'Light meter app', 'Notebook', 'Measuring tape']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'solar-cooker',
    title: 'Build a Solar Cooker',
    description: 'Design and build a simple solar cooker using cardboard, aluminum foil, and plastic wrap. Test it by cooking simple food.',
    category: 'energy_conservation',
    difficulty: 'medium',
    ecoPoints: 100,
    estimatedTime: 90,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 100,
      verificationType: 'teacher' as const,
      materials: ['Cardboard box', 'Aluminum foil', 'Black paint', 'Plastic wrap', 'Tape']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'led-switch',
    title: 'LED Bulb Switch Campaign',
    description: 'Calculate energy savings by switching to LED bulbs in your home. Create a presentation for your family about the benefits.',
    category: 'energy_conservation',
    difficulty: 'easy',
    ecoPoints: 70,
    estimatedTime: 45,
    requirements: {
      photoRequired: true,
      locationRequired: false,
      descriptionMinLength: 80,
      verificationType: 'auto' as const,
      materials: ['Calculator', 'Electricity bill', 'LED bulb information']
    },
    isActive: true,
    createdBy: 'system'
  },

  // Water Conservation Tasks
  {
    id: 'water-usage-monitor',
    title: 'Monitor Water Usage',
    description: 'Track your family\'s daily water usage for a week. Identify areas where water can be conserved and implement changes.',
    category: 'water_conservation',
    difficulty: 'easy',
    ecoPoints: 50,
    estimatedTime: 30,
    requirements: {
      photoRequired: false,
      locationRequired: false,
      descriptionMinLength: 75,
      verificationType: 'auto' as const,
      materials: ['Water meter readings', 'Notebook', 'Calculator']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'rainwater-harvesting',
    title: 'Rainwater Harvesting System',
    description: 'Set up a simple rainwater harvesting system for your home or school. Document the setup and measure water collected.',
    category: 'water_conservation',
    difficulty: 'medium',
    ecoPoints: 90,
    estimatedTime: 90,
    requirements: {
      photoRequired: true,
      locationRequired: true,
      descriptionMinLength: 100,
      verificationType: 'teacher' as const,
      materials: ['Large container', 'Funnel', 'Pipe/tubing', 'Mesh filter']
    },
    isActive: true,
    createdBy: 'system'
  },
  {
    id: 'greywater-system',
    title: 'Greywater Recycling Project',
    description: 'Design a system to reuse greywater from sinks or washing machines for garden irrigation.',
    category: 'water_conservation',
    difficulty: 'hard',
    ecoPoints: 110,
    estimatedTime: 120,
    requirements: {
      photoRequired: true,
      locationRequired: true,
      descriptionMinLength: 120,
      verificationType: 'teacher' as const,
      materials: ['Pipes', 'Containers', 'Filters', 'Tools for installation']
    },
    isActive: true,
    createdBy: 'system'
  }
]

// Environmental Lessons
const lessonsSeedData = [
  {
    id: 'climate-change-101',
    title: 'Climate Change Basics',
    description: 'Understanding the science behind climate change, its causes, and global impacts.',
    type: 'video_lesson',
    mediaUrl: '/videos/climate-change-101.mp4',
    durationMin: 15,
    difficulty: 'beginner',
    ecoPoints: 25,
    tags: ['climate_change', 'global_warming', 'greenhouse_effect']
  },
  {
    id: 'plastic-pollution-india',
    title: 'Plastic Pollution in India',
    description: 'Exploring the plastic pollution crisis in India and local solutions being implemented.',
    type: 'interactive_lesson',
    mediaUrl: '/lessons/plastic-pollution-india',
    durationMin: 20,
    difficulty: 'beginner',
    ecoPoints: 30,
    tags: ['plastic_pollution', 'india', 'waste_management', 'policy']
  },
  {
    id: 'renewable-energy-basics',
    title: 'Renewable Energy Sources',
    description: 'Introduction to solar, wind, hydroelectric, and other renewable energy sources.',
    type: 'video_lesson',
    mediaUrl: '/videos/renewable-energy.mp4',
    durationMin: 18,
    difficulty: 'beginner',
    ecoPoints: 25,
    tags: ['renewable_energy', 'solar', 'wind', 'sustainable_development']
  },
  {
    id: 'biodiversity-hotspots',
    title: 'Biodiversity Hotspots of India',
    description: 'Learn about India\'s rich biodiversity and the ecosystems that need protection.',
    type: 'interactive_lesson',
    mediaUrl: '/lessons/biodiversity-india',
    durationMin: 25,
    difficulty: 'intermediate',
    ecoPoints: 35,
    tags: ['biodiversity', 'ecosystems', 'conservation', 'wildlife']
  },
  {
    id: 'sustainable-agriculture',
    title: 'Sustainable Farming Practices',
    description: 'Understanding organic farming, permaculture, and sustainable agricultural methods.',
    type: 'case_study',
    mediaUrl: '/lessons/sustainable-agriculture',
    durationMin: 22,
    difficulty: 'intermediate',
    ecoPoints: 40,
    tags: ['agriculture', 'organic_farming', 'food_security', 'soil_health']
  }
]

// Sample Schools
const schoolsSeedData = [
  {
    id: 'dps-vasant-kunj',
    name: 'Delhi Public School, Vasant Kunj',
    location: 'New Delhi, Delhi',
    type: 'school',
    isActive: true
  },
  {
    id: 'kendriya-vidyalaya-pune',
    name: 'Kendriya Vidyalaya No.1',
    location: 'Pune, Maharashtra',
    type: 'school',
    isActive: true
  },
  {
    id: 'ryan-international-bangalore',
    name: 'Ryan International School',
    location: 'Bangalore, Karnataka',
    type: 'school',
    isActive: true
  },
  {
    id: 'dav-public-school',
    name: 'DAV Public School',
    location: 'Chandigarh, Punjab',
    type: 'school',
    isActive: true
  },
  {
    id: 'loyola-high-school',
    name: 'Loyola High School',
    location: 'Chennai, Tamil Nadu',
    type: 'school',
    isActive: true
  }
]

// Seed function
export async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Seed badges
    console.log('📛 Seeding badges...')
    for (const badge of badgesSeedData) {
      await db.insert(badges).values({
        ...badge,
        createdAt: new Date()
      }).onConflictDoNothing({ target: badges.id })
    }
    console.log(`✅ Seeded ${badgesSeedData.length} badges`)

    // Seed tasks
    console.log('📋 Seeding tasks...')
    for (const task of tasksSeedData) {
      await db.insert(tasks).values({
        ...task,
        id: randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoNothing()
    }
    console.log(`✅ Seeded ${tasksSeedData.length} tasks`)

    // Seed lessons
    console.log('📚 Seeding lessons...')
    for (const lesson of lessonsSeedData) {
      await db.insert(lessons).values({
        ...lesson,
        createdAt: new Date(),
        updatedAt: new Date()
      }).onConflictDoNothing({ target: lessons.id })
    }
    console.log(`✅ Seeded ${lessonsSeedData.length} lessons`)

    // Seed schools
    console.log('🏫 Seeding schools...')
    for (const school of schoolsSeedData) {
      await db.insert(schools).values({
        ...school,
        createdAt: new Date()
      }).onConflictDoNothing({ target: schools.id })
    }
    console.log(`✅ Seeded ${schoolsSeedData.length} schools`)

    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Export individual seed arrays for testing
export {
  badgesSeedData,
  tasksSeedData,
  lessonsSeedData,
  schoolsSeedData
}
