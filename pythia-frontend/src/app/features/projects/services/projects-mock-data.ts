/**
 * Mock data for Projects feature development
 *
 * Use this for testing UI components without backend
 * Matches the API specification structure
 */

import {
  Project,
  ProjectDetail,
  ProjectListResponse,
  ProjectListAnalytics
} from '../../../models';

/**
 * Mock projects for list view
 */
export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'E-Commerce Platform',
    code: 'ECOM-2024',
    description: 'Large-scale e-commerce platform with microservices architecture',
    company: 'Tech Corp',
    industry: 'E-Commerce',
    projectType: 'Web Application',
    budgetRange: '500K+',
    teamSizeRange: '10-20',
    startDate: '2023-08-15',
    endDate: null,
    status: 'ACTIVE',
    priority: 'HIGH',
    complexity: 'ENTERPRISE',
    successRating: 4.8,
    clientSatisfaction: 4.9,
    websiteUrl: 'https://ecommerce.techcorp.com',
    repositoryUrl: 'https://github.com/techcorp/ecommerce',
    documentationUrl: 'https://docs.techcorp.com/ecommerce',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-11-20T15:30:00Z',
    team: {
      totalMembers: 12,
      activeMembers: 8,
      leads: [
        {
          id: 1,
          name: 'Marcus Chen',
          role: 'Tech Lead',
          avatar: 'https://i.pravatar.cc/150?img=12'
        }
      ],
      architects: [
        {
          id: 2,
          name: 'Sarah Johnson',
          role: 'Solution Architect',
          avatar: 'https://i.pravatar.cc/150?img=45'
        }
      ]
    },
    technologies: [
      {
        id: 1,
        name: 'React',
        category: 'Frontend',
        isPrimary: true,
        version: '18.2'
      },
      {
        id: 3,
        name: 'Node.js',
        category: 'Backend',
        isPrimary: true,
        version: '20.x'
      },
      {
        id: 5,
        name: 'PostgreSQL',
        category: 'Database',
        isPrimary: true,
        version: '16'
      },
      {
        id: 4,
        name: 'TypeScript',
        category: 'Language',
        isPrimary: true
      }
    ],
    topSkills: [
      'Microservices Architecture',
      'React Development',
      'API Design',
      'PostgreSQL Optimization'
    ],
    tags: [
      { id: 1, name: 'Microservices', color: '#3B82F6' },
      { id: 2, name: 'Cloud-Native', color: '#10B981' },
      { id: 3, name: 'Agile', color: '#F59E0B' }
    ],
    timeline: {
      duration: '16 months',
      durationDays: 487,
      progress: 75,
      milestonesTotal: 8,
      milestonesCompleted: 6,
      nextMilestone: {
        name: 'Payment Gateway Integration',
        dueDate: '2024-12-15',
        daysRemaining: 25
      }
    }
  },
  {
    id: 2,
    name: 'Mobile Banking App',
    code: 'MBANK-2025',
    description: 'Next-generation mobile banking application with biometric authentication',
    company: 'FinServe Digital',
    industry: 'FinTech',
    projectType: 'Mobile Application',
    budgetRange: '100K-500K',
    teamSizeRange: '5-10',
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    complexity: 'COMPLEX',
    successRating: 4.6,
    clientSatisfaction: 4.7,
    websiteUrl: 'https://mobilebank.finserve.com',
    repositoryUrl: 'https://github.com/finserve/mobile-banking',
    createdAt: '2024-01-01T09:00:00Z',
    updatedAt: '2024-11-20T14:00:00Z',
    team: {
      totalMembers: 8,
      activeMembers: 7,
      leads: [
        {
          id: 10,
          name: 'Elena Rodriguez',
          role: 'Mobile Lead',
          avatar: 'https://i.pravatar.cc/150?img=32'
        }
      ],
      architects: []
    },
    technologies: [
      {
        id: 20,
        name: 'React Native',
        category: 'Mobile',
        isPrimary: true,
        version: '0.72'
      },
      {
        id: 21,
        name: 'Kotlin',
        category: 'Language',
        isPrimary: true,
        version: '1.9'
      },
      {
        id: 22,
        name: 'Spring Boot',
        category: 'Backend',
        isPrimary: true,
        version: '4.0'
      }
    ],
    topSkills: [
      'Mobile Development',
      'Security',
      'Biometric Auth',
      'Spring Boot'
    ],
    tags: [
      { id: 10, name: 'Mobile', color: '#8B5CF6' },
      { id: 11, name: 'Security', color: '#DC2626' },
      { id: 12, name: 'FinTech', color: '#059669' }
    ],
    timeline: {
      duration: '18 months',
      durationDays: 547,
      progress: 60,
      milestonesTotal: 10,
      milestonesCompleted: 6,
      nextMilestone: {
        name: 'Biometric Integration',
        dueDate: '2024-12-31',
        daysRemaining: 41
      }
    }
  },
  {
    id: 3,
    name: 'Healthcare Portal',
    code: 'HEALTH-2024',
    description: 'Patient management system with telemedicine capabilities',
    company: 'MediCare Solutions',
    industry: 'Healthcare',
    projectType: 'Web Application',
    budgetRange: '50K-100K',
    teamSizeRange: '5-10',
    startDate: '2024-03-01',
    endDate: null,
    status: 'ACTIVE',
    priority: 'HIGH',
    complexity: 'COMPLEX',
    successRating: 4.5,
    clientSatisfaction: 4.8,
    websiteUrl: 'https://portal.medicare-sol.com',
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-11-20T16:00:00Z',
    team: {
      totalMembers: 6,
      activeMembers: 6,
      leads: [
        {
          id: 15,
          name: 'Dr. James Kim',
          role: 'Product Lead',
          avatar: 'https://i.pravatar.cc/150?img=60'
        }
      ],
      architects: [
        {
          id: 16,
          name: 'Sophia Martinez',
          role: 'Solutions Architect',
          avatar: 'https://i.pravatar.cc/150?img=28'
        }
      ]
    },
    technologies: [
      {
        id: 30,
        name: 'Angular',
        category: 'Frontend',
        isPrimary: true,
        version: '20.0'
      },
      {
        id: 31,
        name: 'Python',
        category: 'Language',
        isPrimary: true,
        version: '3.11'
      },
      {
        id: 32,
        name: 'Django',
        category: 'Backend',
        isPrimary: true,
        version: '4.2'
      }
    ],
    topSkills: [
      'Angular Development',
      'Healthcare Compliance',
      'Python',
      'HIPAA'
    ],
    tags: [
      { id: 20, name: 'Healthcare', color: '#EC4899' },
      { id: 21, name: 'Compliance', color: '#6366F1' },
      { id: 22, name: 'Telemedicine', color: '#14B8A6' }
    ],
    timeline: {
      duration: '9 months',
      durationDays: 274,
      progress: 45,
      milestonesTotal: 7,
      milestonesCompleted: 3,
      nextMilestone: {
        name: 'Video Consultation MVP',
        dueDate: '2024-12-20',
        daysRemaining: 30
      }
    }
  },
  {
    id: 4,
    name: 'Cloud Migration',
    code: 'CLOUD-2023',
    description: 'Legacy system migration to AWS cloud infrastructure',
    company: 'Enterprise Inc',
    industry: 'Technology',
    projectType: 'Infrastructure',
    budgetRange: '500K+',
    teamSizeRange: '10-20',
    startDate: '2023-01-01',
    endDate: '2024-06-30',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    complexity: 'ENTERPRISE',
    successRating: 4.9,
    clientSatisfaction: 4.9,
    websiteUrl: 'https://cloud.enterprise-inc.com',
    repositoryUrl: 'https://github.com/enterprise/cloud-migration',
    createdAt: '2022-12-01T10:00:00Z',
    updatedAt: '2024-06-30T18:00:00Z',
    team: {
      totalMembers: 15,
      activeMembers: 0,
      leads: [
        {
          id: 25,
          name: 'Alex Thompson',
          role: 'Cloud Architect',
          avatar: 'https://i.pravatar.cc/150?img=33'
        }
      ],
      architects: [
        {
          id: 26,
          name: 'Nina Patel',
          role: 'Enterprise Architect',
          avatar: 'https://i.pravatar.cc/150?img=47'
        }
      ]
    },
    technologies: [
      {
        id: 40,
        name: 'AWS',
        category: 'Cloud',
        isPrimary: true
      },
      {
        id: 41,
        name: 'Terraform',
        category: 'DevOps',
        isPrimary: true
      },
      {
        id: 42,
        name: 'Kubernetes',
        category: 'DevOps',
        isPrimary: true
      }
    ],
    topSkills: [
      'Cloud Architecture',
      'AWS',
      'Infrastructure as Code',
      'Kubernetes'
    ],
    tags: [
      { id: 30, name: 'Cloud', color: '#0EA5E9' },
      { id: 31, name: 'Migration', color: '#A855F7' },
      { id: 32, name: 'DevOps', color: '#F97316' }
    ],
    timeline: {
      duration: '18 months',
      durationDays: 547,
      progress: 100,
      milestonesTotal: 12,
      milestonesCompleted: 12
    }
  },
  {
    id: 5,
    name: 'AI Content Generator',
    code: 'AI-GEN-2024',
    description: 'AI-powered content generation platform using GPT-4',
    company: 'ContentAI Labs',
    industry: 'Artificial Intelligence',
    projectType: 'Web Application',
    budgetRange: '100K-500K',
    teamSizeRange: '5-10',
    startDate: '2024-06-01',
    endDate: '2025-03-31',
    status: 'ACTIVE',
    priority: 'HIGH',
    complexity: 'COMPLEX',
    successRating: 4.7,
    clientSatisfaction: 4.6,
    websiteUrl: 'https://ai.contentlabs.com',
    repositoryUrl: 'https://github.com/contentai/generator',
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-11-20T12:00:00Z',
    team: {
      totalMembers: 7,
      activeMembers: 7,
      leads: [
        {
          id: 30,
          name: 'Liam Chen',
          role: 'AI Engineering Lead',
          avatar: 'https://i.pravatar.cc/150?img=14'
        }
      ],
      architects: []
    },
    technologies: [
      {
        id: 50,
        name: 'Python',
        category: 'Language',
        isPrimary: true,
        version: '3.11'
      },
      {
        id: 51,
        name: 'FastAPI',
        category: 'Backend',
        isPrimary: true
      },
      {
        id: 52,
        name: 'Vue.js',
        category: 'Frontend',
        isPrimary: true,
        version: '3.x'
      }
    ],
    topSkills: [
      'Machine Learning',
      'Python',
      'API Development',
      'Vue.js'
    ],
    tags: [
      { id: 40, name: 'AI/ML', color: '#8B5CF6' },
      { id: 41, name: 'GPT-4', color: '#10B981' },
      { id: 42, name: 'SaaS', color: '#3B82F6' }
    ],
    timeline: {
      duration: '10 months',
      durationDays: 304,
      progress: 35,
      milestonesTotal: 8,
      milestonesCompleted: 3,
      nextMilestone: {
        name: 'GPT-4 Integration',
        dueDate: '2024-12-10',
        daysRemaining: 20
      }
    }
  },
  {
    id: 6,
    name: 'IoT Smart Home',
    code: 'IOT-HOME-2024',
    description: 'Smart home automation platform with IoT device integration',
    company: 'SmartLiving Tech',
    industry: 'IoT',
    projectType: 'Mobile Application',
    budgetRange: '50K-100K',
    teamSizeRange: '5-10',
    startDate: '2024-09-01',
    endDate: null,
    status: 'PLANNING',
    priority: 'MEDIUM',
    complexity: 'MODERATE',
    successRating: 0,
    clientSatisfaction: 0,
    websiteUrl: 'https://smarthome.smartliving.io',
    createdAt: '2024-08-15T09:00:00Z',
    updatedAt: '2024-11-20T11:00:00Z',
    team: {
      totalMembers: 5,
      activeMembers: 3,
      leads: [],
      architects: []
    },
    technologies: [
      {
        id: 60,
        name: 'Flutter',
        category: 'Mobile',
        isPrimary: true
      },
      {
        id: 61,
        name: 'MQTT',
        category: 'Other',
        isPrimary: true
      },
      {
        id: 62,
        name: 'MongoDB',
        category: 'Database',
        isPrimary: true
      }
    ],
    topSkills: [
      'Flutter Development',
      'IoT Protocols',
      'MQTT',
      'Embedded Systems'
    ],
    tags: [
      { id: 50, name: 'IoT', color: '#F59E0B' },
      { id: 51, name: 'Smart Home', color: '#14B8A6' },
      { id: 52, name: 'Mobile', color: '#8B5CF6' }
    ],
    timeline: {
      duration: '12 months',
      durationDays: 365,
      progress: 10,
      milestonesTotal: 9,
      milestonesCompleted: 0,
      nextMilestone: {
        name: 'Architecture Design Complete',
        dueDate: '2024-12-05',
        daysRemaining: 15
      }
    }
  }
];

/**
 * Mock analytics data
 */
export const MOCK_ANALYTICS: ProjectListAnalytics = {
  totalProjects: 42,
  activeProjects: 15,
  completedProjects: 20,
  onHoldProjects: 3,
  cancelledProjects: 4,
  totalEmployeesInvolved: 87,
  averageTeamSize: 6.5,
  averageProjectDuration: '8.3 months',
  topTechnologies: [
    { name: 'TypeScript', count: 30, percentage: 71.4 },
    { name: 'React', count: 28, percentage: 66.7 },
    { name: 'Node.js', count: 25, percentage: 59.5 },
    { name: 'PostgreSQL', count: 22, percentage: 52.4 },
    { name: 'Python', count: 18, percentage: 42.9 },
    { name: 'AWS', count: 15, percentage: 35.7 }
  ],
  topIndustries: [
    { name: 'FinTech', count: 12, percentage: 28.6 },
    { name: 'E-Commerce', count: 10, percentage: 23.8 },
    { name: 'Healthcare', count: 8, percentage: 19.0 },
    { name: 'Technology', count: 7, percentage: 16.7 },
    { name: 'AI/ML', count: 5, percentage: 11.9 }
  ],
  complexityDistribution: {
    SIMPLE: 8,
    MODERATE: 15,
    COMPLEX: 12,
    ENTERPRISE: 7
  },
  averageSuccessRating: 4.3,
  averageClientSatisfaction: 4.5
};

/**
 * Mock project list response
 */
export const MOCK_PROJECT_LIST_RESPONSE: ProjectListResponse = {
  projects: MOCK_PROJECTS,
  pagination: {
    page: 1,
    size: 20,
    total: 42,
    totalPages: 3
  },
  analytics: MOCK_ANALYTICS
};

/**
 * Mock detailed project (for detail view)
 */
export const MOCK_PROJECT_DETAIL: ProjectDetail = {
  ...MOCK_PROJECTS[0],
  team: {
    totalMembers: 12,
    activeMembers: 8,
    formerMembers: 4,
    members: [
      {
        employee: {
          id: 1,
          fullName: 'Marcus Chen',
          title: 'Senior Full Stack Developer',
          email: 'marcus.chen@example.com',
          avatar: 'https://i.pravatar.cc/150?img=12',
          city: 'Zurich',
          country: 'Switzerland',
          availability: 'AVAILABLE'
        },
        assignment: {
          role: 'Tech Lead',
          roleId: 5,
          startDate: '2023-08-15',
          endDate: null,
          allocation: 100,
          isLead: true,
          isArchitect: false,
          responsibilities: 'Overall technical direction, code reviews, architecture decisions',
          achievements: 'Designed microservices architecture, reduced API latency by 60%',
          duration: '16 months'
        }
      },
      {
        employee: {
          id: 2,
          fullName: 'Sarah Johnson',
          title: 'Solution Architect',
          email: 'sarah.j@example.com',
          avatar: 'https://i.pravatar.cc/150?img=45',
          city: 'Barcelona',
          country: 'Spain',
          availability: 'BUSY'
        },
        assignment: {
          role: 'Solution Architect',
          roleId: 8,
          startDate: '2023-08-15',
          endDate: null,
          allocation: 50,
          isLead: false,
          isArchitect: true,
          responsibilities: 'System architecture, technology selection, scalability planning',
          achievements: 'Designed cloud-native architecture supporting 10x scale',
          duration: '16 months'
        }
      }
    ]
  },
  requiredSkills: [
    {
      id: 10,
      name: 'Microservices Architecture',
      importance: 'REQUIRED',
      minProficiency: 'advanced'
    },
    {
      id: 15,
      name: 'React Development',
      importance: 'REQUIRED',
      minProficiency: 'intermediate'
    },
    {
      id: 20,
      name: 'PostgreSQL',
      importance: 'PREFERRED',
      minProficiency: 'intermediate'
    }
  ],
  milestones: [
    {
      id: 1,
      name: 'MVP Launch',
      description: 'Initial product launch with core features',
      dueDate: '2023-12-01',
      completedDate: '2023-11-28',
      status: 'COMPLETED',
      deliverables: 'User authentication, product catalog, shopping cart'
    },
    {
      id: 2,
      name: 'Payment Gateway Integration',
      description: 'Integrate Stripe and PayPal payment processing',
      dueDate: '2024-12-15',
      completedDate: null,
      status: 'IN_PROGRESS',
      deliverables: null
    },
    {
      id: 3,
      name: 'Mobile App Launch',
      description: 'Release iOS and Android mobile applications',
      dueDate: '2025-02-01',
      completedDate: null,
      status: 'PLANNED',
      deliverables: null
    }
  ],
  analytics: {
    duration: '16 months',
    durationDays: 487,
    progress: 75,
    teamTurnover: 33.3,
    averageAllocation: 78.5,
    technologyCount: 12,
    milestonesOnTime: 75.0
  }
};
