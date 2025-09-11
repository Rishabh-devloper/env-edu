-- Enhanced Gamification and Learning Database Schema

-- Badges table - Define all available badges
CREATE TABLE badges (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL, -- eco_action, knowledge, leadership, community, achievement
  rarity VARCHAR(20) NOT NULL, -- common, uncommon, rare, epic, legendary
  points_required INTEGER NOT NULL,
  criteria_type VARCHAR(30) NOT NULL, -- points, lessons, tasks, streak, quiz_score, environmental_impact
  criteria_target INTEGER NOT NULL,
  criteria_conditions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  unlock_requirements JSONB DEFAULT '{}', -- Prerequisites for unlocking this badge
  reward_points INTEGER DEFAULT 0, -- Bonus points when earning this badge
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges - Track which badges users have earned
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  badge_id VARCHAR(50) NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress INTEGER DEFAULT 0, -- Current progress toward badge (0-100 or actual count)
  metadata JSONB DEFAULT '{}', -- Store additional context about earning
  UNIQUE(user_id, badge_id)
);

-- Enhanced user progress tracking
CREATE TABLE user_progress_enhanced (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  streak_multiplier DECIMAL(3,2) DEFAULT 1.00,
  
  -- Learning Progress
  lessons_completed INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  average_quiz_score DECIMAL(5,2) DEFAULT 0,
  
  -- Environmental Impact
  tasks_completed INTEGER DEFAULT 0,
  trees_planted INTEGER DEFAULT 0,
  waste_recycled_kg DECIMAL(8,2) DEFAULT 0,
  energy_saved_kwh DECIMAL(8,2) DEFAULT 0,
  water_saved_liters DECIMAL(10,2) DEFAULT 0,
  
  -- Social Engagement
  posts_created INTEGER DEFAULT 0,
  comments_made INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  badges_earned INTEGER DEFAULT 0,
  
  -- Activity Breakdown
  points_from_lessons INTEGER DEFAULT 0,
  points_from_quizzes INTEGER DEFAULT 0,
  points_from_tasks INTEGER DEFAULT 0,
  points_from_social INTEGER DEFAULT 0,
  points_from_streaks INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz system enhancement
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- sustainable_development, environment, climate_change, green_technology
  difficulty VARCHAR(20) DEFAULT 'medium', -- easy, medium, hard
  total_questions INTEGER NOT NULL,
  time_limit_minutes INTEGER DEFAULT 30,
  passing_score INTEGER DEFAULT 70, -- Percentage required to pass
  points_reward INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  prerequisite_quiz_id INTEGER REFERENCES quizzes(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions with enhanced features
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type VARCHAR(20) DEFAULT 'multiple_choice', -- multiple_choice, true_false, fill_blank
  options JSONB NOT NULL, -- Array of answer options
  correct_answer VARCHAR(500) NOT NULL,
  explanation TEXT, -- Explanation of the correct answer
  difficulty VARCHAR(20) DEFAULT 'medium',
  points INTEGER DEFAULT 10,
  image_url VARCHAR(500), -- Optional image for the question
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User quiz attempts and results
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
  score INTEGER NOT NULL, -- Percentage score (0-100)
  points_earned INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB NOT NULL, -- User's answers for each question
  passed BOOLEAN NOT NULL,
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Performance analytics
  correct_answers INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  difficulty_breakdown JSONB DEFAULT '{}', -- Performance by difficulty level
  category_performance JSONB DEFAULT '{}'  -- Performance by question category
);

-- Daily/Weekly challenges
CREATE TABLE challenges (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(30) NOT NULL, -- daily, weekly, monthly, special
  category VARCHAR(50) NOT NULL,
  target_value INTEGER NOT NULL,
  reward_points INTEGER NOT NULL,
  reward_badge_id VARCHAR(50) REFERENCES badges(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User challenge participation
CREATE TABLE user_challenges (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  challenge_id INTEGER NOT NULL REFERENCES challenges(id),
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  rank INTEGER, -- User's rank in this challenge
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, challenge_id)
);

-- Activity feed for tracking all user actions
CREATE TABLE activity_feed (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- lesson_completed, badge_earned, quiz_passed, task_completed, streak_milestone
  activity_title VARCHAR(200) NOT NULL,
  activity_description TEXT,
  points_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE, -- Whether this activity appears in public feeds
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboards (multiple types)
CREATE TABLE leaderboards (
  id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL, -- global, school, class, challenge
  scope VARCHAR(100) NOT NULL, -- global, school_id, class_id, challenge_id
  period VARCHAR(20) NOT NULL, -- daily, weekly, monthly, all_time
  user_rankings JSONB NOT NULL, -- Array of user rankings with scores
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(type, scope, period)
);

-- Insert initial badges
INSERT INTO badges (id, name, description, icon, category, rarity, points_required, criteria_type, criteria_target, reward_points) VALUES
('first-steps', 'First Steps', 'Complete your first lesson and start your eco-learning journey', '👶', 'achievement', 'common', 25, 'lessons', 1, 10),
('tree-planter', 'Tree Planter', 'Plant your first tree and contribute to reforestation', '🌱', 'eco_action', 'common', 100, 'tasks', 1, 25),
('knowledge-seeker', 'Knowledge Seeker', 'Complete 5 lessons and expand your environmental knowledge', '📚', 'knowledge', 'common', 125, 'lessons', 5, 30),
('quiz-master', 'Quiz Master', 'Score 100% on any quiz and prove your expertise', '🧠', 'knowledge', 'uncommon', 200, 'quiz_score', 100, 50),
('eco-warrior', 'Eco Warrior', 'Complete 10 environmental tasks and make a real difference', '🛡️', 'eco_action', 'rare', 500, 'tasks', 10, 100),
('streak-champion', 'Streak Champion', 'Maintain a 7-day learning streak', '🔥', 'achievement', 'uncommon', 175, 'streak', 7, 75),
('community-leader', 'Community Leader', 'Inspire others by sharing your environmental actions', '👥', 'leadership', 'rare', 750, 'social_engagement', 10, 150),
('climate-advocate', 'Climate Advocate', 'Pass all climate change quizzes with high scores', '🌍', 'knowledge', 'epic', 1000, 'quiz_category', 4, 200),
('sustainability-expert', 'Sustainability Expert', 'Master all aspects of sustainable development', '🏆', 'leadership', 'legendary', 2000, 'comprehensive', 100, 500),
('green-innovator', 'Green Innovator', 'Complete advanced green technology challenges', '💡', 'eco_action', 'epic', 1500, 'advanced_tasks', 5, 300);

-- Insert initial quizzes
INSERT INTO quizzes (title, description, category, difficulty, total_questions, time_limit_minutes, passing_score, points_reward, featured) VALUES
('Sustainable Development Goals', 'Test your knowledge of the UN Sustainable Development Goals and their environmental impact', 'sustainable_development', 'medium', 10, 20, 70, 100, true),
('Environmental Protection Basics', 'Learn about key environmental protection concepts and conservation strategies', 'environment', 'easy', 10, 15, 65, 75, true),
('Climate Change Science', 'Understand the science behind climate change and its global impacts', 'climate_change', 'hard', 10, 25, 75, 125, true),
('Green Technology Innovation', 'Explore cutting-edge green technologies and sustainable innovations', 'green_technology', 'medium', 10, 20, 70, 100, true);

-- Create indexes for better performance
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);
CREATE INDEX idx_user_progress_user_id ON user_progress_enhanced(user_id);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);
