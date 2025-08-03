/*
  # Initial Schema Setup for MindCare Platform

  1. New Tables
    - users_profile
      - Stores additional user information and preferences
    - assessments
      - Stores user assessment results and recommendations
    - progress_tracking
      - Tracks daily user progress and activities
    - counselor_profiles
      - Stores information about counselors
    
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
*/

-- Users Profile Table
CREATE TABLE users_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users_profile
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Assessments Table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  assessment_date TIMESTAMPTZ DEFAULT now(),
  severity_level TEXT CHECK (severity_level IN ('minor', 'mild', 'major')),
  score INTEGER,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Progress Tracking Table
CREATE TABLE progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  date DATE DEFAULT CURRENT_DATE,
  mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 10),
  activities TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON progress_tracking
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Counselor Profiles Table
CREATE TABLE counselor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  specialization TEXT[],
  experience_years INTEGER,
  bio TEXT,
  avatar_url TEXT,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE counselor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read counselor profiles"
  ON counselor_profiles
  FOR SELECT
  TO authenticated
  USING (true);