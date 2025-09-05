# 🌱 EcoLearning Platform

A comprehensive environmental sustainability education platform built with Next.js 15, React 19, TypeScript, and Clerk authentication.

## 🚀 Features

### 1. Authentication Module
- **Multi-role Support**: Students, Teachers, NGOs, and Admins
- **Clerk Integration**: Secure authentication with role-based access control
- **Role-based Dashboards**: Personalized experiences for each user type
- **Session Management**: Automatic session handling and protection

### 2. Content Module
- **Interactive Lessons**: Videos, infographics, and interactive content
- **Quiz System**: Multiple choice, true/false, and fill-in-the-blank questions
- **Progress Tracking**: Track completion and performance
- **Adaptive Learning**: Difficulty levels and prerequisites

### 3. Gamification Module
- **Eco-Points System**: Earn points for completing activities
- **Badge System**: Unlock achievements and milestones
- **Leaderboards**: Class-wise, school-wise, and global rankings
- **Level Progression**: Level up based on accumulated points

### 4. Task Module
- **Real-world Assignments**: Environmental action tasks
- **Proof Upload**: Photo, video, and document submissions
- **Teacher Review**: Approval and feedback system
- **Deadline Management**: Time-bound task completion

### 5. Tracking Module
- **Student Progress**: Comprehensive progress monitoring
- **Class Analytics**: Teacher dashboard with class insights
- **Performance Metrics**: Detailed statistics and reports
- **Activity Monitoring**: Real-time activity tracking

### 6. Reward Module
- **Certificate Generation**: Automated certificate creation
- **Badge Allocation**: Achievement recognition system
- **Digital Rewards**: Eco-points and virtual badges
- **Progress Recognition**: Milestone celebrations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Icons**: Lucide React
- **State Management**: React Hooks
- **API**: Next.js API Routes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── student/           # Student-specific pages
│   ├── teacher/           # Teacher-specific pages
│   ├── ngo/               # NGO-specific pages
│   └── dashboard/         # Main dashboard
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── content/           # Content-related components
│   ├── gamification/      # Gamification components
│   ├── tasks/             # Task-related components
│   ├── tracking/          # Progress tracking components
│   └── rewards/           # Reward system components
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecolearning-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Clerk credentials:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
   ```

4. **Run the development server**
```bash
npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your API keys to `.env.local`
4. Configure authentication methods in Clerk dashboard

### Role Configuration
Users can be assigned roles through Clerk's metadata system:
- `student`: Access to lessons, quizzes, and tasks
- `teacher`: Can create content and monitor students
- `ngo`: Can launch campaigns and track impact
- `admin`: Full system access

## 📱 User Roles

### 👨‍🎓 Student
- Complete interactive lessons
- Take quizzes and earn points
- Submit task proofs
- View progress and achievements
- Compete on leaderboards

### 👨‍🏫 Teacher
- Create and manage lessons
- Assign tasks to students
- Monitor student progress
- Review task submissions
- Generate reports

### 🌍 NGO Member
- Launch environmental campaigns
- Connect with schools
- Track community impact
- Monitor campaign progress
- Generate impact reports

### 👨‍💼 Admin
- Manage all users and content
- System configuration
- Analytics and reporting
- Content moderation

## 🎮 Gamification Features

### Eco-Points System
- Earn points for completing activities
- Points are awarded for:
  - Lesson completion
  - Quiz scores
  - Task submissions
  - Community participation

### Badge System
- **Eco Action Badges**: For environmental activities
- **Knowledge Badges**: For learning achievements
- **Leadership Badges**: For community involvement
- **Community Badges**: For collaborative efforts

### Leaderboards
- **Class Leaderboard**: Within a specific class
- **School Leaderboard**: Across the entire school
- **Global Leaderboard**: Platform-wide rankings
- **NGO Leaderboard**: For NGO members

## 📊 API Endpoints

### Lessons
- `GET /api/lessons` - Fetch lessons
- `POST /api/lessons` - Create lesson (teachers only)

### Gamification
- `GET /api/gamification/points` - Get user points
- `POST /api/gamification/points` - Add points

### Tasks
- `GET /api/tasks` - Fetch tasks
- `POST /api/tasks` - Create task (teachers only)

## 🎨 Design System

### Color Palette
- **Primary Green**: `#10b981` (Eco-friendly theme)
- **Secondary Blue**: `#3b82f6` (Trust and reliability)
- **Accent Purple**: `#8b5cf6` (Innovation)
- **Warning Orange**: `#f59e0b` (Attention)
- **Error Red**: `#ef4444` (Alerts)

### Typography
- **Font Family**: Inter (clean, modern)
- **Headings**: Bold, hierarchical
- **Body Text**: Readable, accessible

## 🔒 Security Features

- **Authentication**: Clerk-based secure authentication
- **Authorization**: Role-based access control
- **Data Protection**: Secure API endpoints
- **Session Management**: Automatic session handling

## 📈 Performance Optimizations

- **Next.js 15**: Latest performance improvements
- **React 19**: Enhanced rendering performance
- **Tailwind CSS**: Optimized CSS delivery
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Static site deployment
- **AWS**: Full-stack deployment
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Clerk** for authentication services
- **Tailwind CSS** for styling framework
- **Lucide React** for beautiful icons
- **Next.js Team** for the amazing framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for environmental education and sustainability.# env-edu
