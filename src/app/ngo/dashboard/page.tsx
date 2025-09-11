'use client'

import { useUser } from '@clerk/nextjs'
import { useUserRole } from '@/lib/auth'
import { 
  Globe, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  BarChart3,
  TreePine,
  Recycle,
  Droplets,
  Zap,
  MapPin,
  Plus,
  Eye,
  CheckCircle,
  Star,
  Trophy,
  Settings,
  Bell,
  Download,
  Share2,
  Camera,
  Heart,
  Leaf,
  School
} from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NGODashboard() {
  const { user, isLoaded } = useUser()
  const { role, isNGO } = useUserRole()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<'overview' | 'initiatives' | 'schools' | 'recognition' | 'impact'>('overview')
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !isNGO) {
      router.push('/')
    }
  }, [isLoaded, isNGO, router])

  // Fetch NGO dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true)
        // In a real app, this would fetch from your API
        // Mock data representing comprehensive NGO environmental partnership tracking
        const mockData = {
          stats: {
            schoolsConnected: 24,
            studentsReached: 3450,
            activeCampaigns: 12,
            completedInitiatives: 18,
            impactScore: 9.4,
            monthlyGrowthSchools: 3,
            weeklyGrowthStudents: 280,
            pendingCampaigns: 2
          },
          environmentalImpact: {
            treesPlanted: 2340,
            wasteRecycled: 4560, // kg
            energySaved: 12400, // kWh
            waterConserved: 18900, // liters
            carbonOffset: 3200, // kg CO2
            communitiesImpacted: 28,
            volunteersEngaged: 156
          },
          partnerships: [
            {
              id: '1',
              schoolName: 'Delhi Public School, Vasant Kunj',
              location: 'New Delhi',
              partnershipDate: '2023-08-15',
              studentsActive: 240,
              projects: 6,
              impactScore: 9.2,
              status: 'active',
              lastActivity: '2 days ago'
            },
            {
              id: '2',
              schoolName: 'Kendriya Vidyalaya, Pune',
              location: 'Maharashtra',
              partnershipDate: '2023-09-20',
              studentsActive: 180,
              projects: 4,
              impactScore: 8.8,
              status: 'active',
              lastActivity: '1 day ago'
            },
            {
              id: '3',
              schoolName: 'Ryan International, Bangalore',
              location: 'Karnataka',
              partnershipDate: '2023-10-05',
              studentsActive: 320,
              projects: 8,
              impactScore: 9.6,
              status: 'active',
              lastActivity: '5 hours ago'
            }
          ],
          activeInitiatives: [
            {
              id: '1',
              title: 'National Tree Plantation Drive 2024',
              description: 'Plant 10,000 trees across 50 schools in India',
              category: 'reforestation',
              schoolsParticipating: 32,
              studentsInvolved: 1240,
              progress: 78,
              targetDate: '2024-06-30',
              budget: '₹2,50,000',
              status: 'active'
            },
            {
              id: '2',
              title: 'Plastic-Free Schools Campaign',
              description: 'Eliminate single-use plastics from school campuses',
              category: 'waste_reduction',
              schoolsParticipating: 18,
              studentsInvolved: 850,
              progress: 65,
              targetDate: '2024-04-22',
              budget: '₹1,80,000',
              status: 'active'
            },
            {
              id: '3',
              title: 'Solar Energy Education Program',
              description: 'Hands-on workshops on renewable energy',
              category: 'renewable_energy',
              schoolsParticipating: 12,
              studentsInvolved: 420,
              progress: 45,
              targetDate: '2024-05-15',
              budget: '₹3,20,000',
              status: 'active'
            }
          ],
          topPerformers: [
            {
              studentName: 'Aadhya Sharma',
              school: 'DPS Vasant Kunj',
              points: 4560,
              achievements: ['Eco Warrior', 'Tree Guardian', 'Water Saver'],
              projects: 8,
              impactStory: 'Led a community water conservation project that saved 5000L water'
            },
            {
              studentName: 'Arjun Patel',
              school: 'KV Pune',
              points: 4320,
              achievements: ['Green Leader', 'Waste Warrior', 'Energy Champion'],
              projects: 7,
              impactStory: 'Organized school-wide recycling drive collecting 200kg waste'
            },
            {
              studentName: 'Prisha Reddy',
              school: 'Ryan International Bangalore',
              points: 4180,
              achievements: ['Climate Champion', 'Biodiversity Protector'],
              projects: 6,
              impactStory: 'Created urban biodiversity garden attracting 15+ bird species'
            }
          ]
        }
        setDashboardData(mockData)
      } catch (error) {
        console.error('Error fetching NGO dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded && isNGO) {
      fetchDashboardData()
    }
  }, [isLoaded, isNGO])

  if (!isLoaded || loading) {
    return <LoadingSpinner />
  }

  if (!isNGO) {
    return null
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'reforestation': return <TreePine className="w-5 h-5" />
      case 'waste_reduction': return <Recycle className="w-5 h-5" />
      case 'renewable_energy': return <Zap className="w-5 h-5" />
      case 'water_conservation': return <Droplets className="w-5 h-5" />
      default: return <Leaf className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reforestation': return 'bg-green-100 text-green-600 border-green-200'
      case 'waste_reduction': return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'renewable_energy': return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'water_conservation': return 'bg-cyan-100 text-cyan-600 border-cyan-200'
      default: return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  if (!dashboardData) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">
                  Environmental Partnership Hub, {user?.firstName}! 🌱
                </h1>
                <p className="text-gray-600">Collaborate with schools to create lasting environmental impact</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'initiatives', label: 'Initiatives', icon: Target },
                { id: 'schools', label: 'School Partners', icon: School },
                { id: 'recognition', label: 'Student Recognition', icon: Trophy },
                { id: 'impact', label: 'Impact Tracking', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      selectedTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-green-100">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <School className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Partner Schools</p>
                    <p className="text-2xl font-bold text-green-800">{dashboardData.stats.schoolsConnected}</p>
                    <p className="text-xs text-green-600">+{dashboardData.stats.monthlyGrowthSchools} this month</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Students Reached</p>
                    <p className="text-2xl font-bold text-blue-800">{dashboardData.stats.studentsReached.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">+{dashboardData.stats.weeklyGrowthStudents} this week</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Initiatives</p>
                    <p className="text-2xl font-bold text-purple-800">{dashboardData.stats.activeCampaigns}</p>
                    <p className="text-xs text-purple-600">{dashboardData.stats.completedInitiatives} completed</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border border-orange-100">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Impact Score</p>
                    <p className="text-2xl font-bold text-orange-800">{dashboardData.stats.impactScore}/10</p>
                    <p className="text-xs text-orange-600">Outstanding</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Showcase */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-green-800">🌍 Network Environmental Impact</h2>
                <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  Export Impact Report
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TreePine className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-700">{dashboardData.environmentalImpact.treesPlanted.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Trees Planted</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Recycle className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{dashboardData.environmentalImpact.wasteRecycled.toLocaleString()} kg</div>
                  <div className="text-sm text-gray-600">Waste Recycled</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-700">{dashboardData.environmentalImpact.energySaved.toLocaleString()} kWh</div>
                  <div className="text-sm text-gray-600">Energy Saved</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-700">{dashboardData.environmentalImpact.waterConserved.toLocaleString()} L</div>
                  <div className="text-sm text-gray-600">Water Saved</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-700">{dashboardData.environmentalImpact.carbonOffset.toLocaleString()} kg</div>
                  <div className="text-sm text-gray-600">CO₂ Offset</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Globe className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{dashboardData.environmentalImpact.communitiesImpacted}</div>
                  <div className="text-sm text-gray-600">Communities</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold text-pink-700">{dashboardData.environmentalImpact.volunteersEngaged}</div>
                  <div className="text-sm text-gray-600">Volunteers</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Active Initiatives */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Active Environmental Initiatives</h3>
                    <Link href="/ngo/initiatives" className="text-green-600 hover:text-green-700 text-sm font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {dashboardData.activeInitiatives.map((initiative: any) => (
                      <div key={initiative.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${getCategoryColor(initiative.category)}`}>
                              {getCategoryIcon(initiative.category)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{initiative.title}</h4>
                              <p className="text-sm text-gray-600">{initiative.description}</p>
                            </div>
                          </div>
                          <span className="text-sm text-green-600 font-medium">{initiative.progress}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>🏢 {initiative.schoolsParticipating} schools</span>
                          <span>🎓 {initiative.studentsInvolved.toLocaleString()} students</span>
                          <span>📅 Due {new Date(initiative.targetDate).toLocaleDateString()}</span>
                          <span>💰 {initiative.budget}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${initiative.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Launch Initiative
                    </button>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <School className="w-4 h-4 mr-2" />
                      Partner with School
                    </button>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      Recognize Students
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Impact Report
                    </button>
                  </div>
                </div>

                {/* Top Student Performers */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">🏆 Eco Heroes</h3>
                  <div className="space-y-4">
                    {dashboardData.topPerformers.map((student: any, index: number) => (
                      <div key={index} className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              'bg-orange-400'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold text-gray-900">{student.studentName}</p>
                              <p className="text-xs text-gray-500">{student.school}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">{student.points.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">points</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {student.achievements.slice(0, 2).join(', ')}{student.achievements.length > 2 && ` +${student.achievements.length - 2} more`}
                        </div>
                        <div className="text-xs text-gray-700 italic">
                          {student.impactStory}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs content would go here */}
        {selectedTab !== 'overview' && (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Section
            </h3>
            <p className="text-gray-600">
              This section will include comprehensive tools for {selectedTab} management, collaboration with schools, and environmental impact tracking.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
