/*
  # Add INSERT policy for assessments table and fix error handling

  1. Changes
    - Add INSERT policy for assessments table
    - Add INSERT policy for progress_tracking table
*/

-- Add INSERT policy for assessments
CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add INSERT policy for progress tracking
CREATE POLICY "Users can insert own progress"
  ON progress_tracking
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);