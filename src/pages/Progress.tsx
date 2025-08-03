import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Trophy, TrendingUp, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { format, startOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface ProgressData {
  date: string;
  mood_score: number;
  activities: string[];
}

interface Assessment {
  assessment_date: string;
  severity_level: string;
  score: number;
}

const Progress = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
      setupSubscriptions();
    }
    return () => {
      cleanupSubscriptions();
    };
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch progress data
      const { data: progressData, error: progressError } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (progressError) throw progressError;

      // Fetch assessment data
      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('assessment_date', { ascending: true });

      if (assessmentError) throw assessmentError;

      // Update states with fetched data
      setProgressData(progressData || []);
      setAssessments(assessmentData || []);

      // If there's a new assessment, automatically create progress entry
      if (assessmentData && assessmentData.length > 0) {
        const latestAssessment = assessmentData[assessmentData.length - 1];
        const today = new Date().toISOString().split('T')[0];
        
        // Check if we already have progress data for today
        const hasProgressForToday = progressData?.some(
          progress => progress.date.split('T')[0] === today
        );

        if (!hasProgressForToday) {
          await createProgressEntry(latestAssessment);
        }
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProgressEntry = async (assessment: Assessment) => {
    try {
      // Convert assessment score to mood score (1-10 scale)
      const moodScore = Math.max(1, Math.min(10, Math.round(assessment.score / 2)));

      // Default activities based on severity level
      const activities = [];
      if (assessment.severity_level === 'minor') {
        activities.push('meditation');
      } else if (assessment.severity_level === 'mild') {
        activities.push('meditation', 'journaling');
      } else {
        activities.push('meditation', 'journaling', 'exercise');
      }

      const { error } = await supabase
        .from('progress_tracking')
        .insert({
          user_id: user.id,
          date: new Date().toISOString(),
          mood_score: moodScore,
          activities: activities
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error creating progress entry:', err);
    }
  };

  const setupSubscriptions = () => {
    // Subscribe to new assessments
    const assessmentSubscription = supabase
      .channel('assessment-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assessments',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Assessment change received:', payload);
          await fetchData(); // Refresh all data
        }
      )
      .subscribe();

    // Subscribe to progress tracking changes
    const progressSubscription = supabase
      .channel('progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_tracking',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          console.log('Progress change received:', payload);
          await fetchData(); // Refresh all data
        }
      )
      .subscribe();

    return () => {
      assessmentSubscription.unsubscribe();
      progressSubscription.unsubscribe();
    };
  };

  const cleanupSubscriptions = () => {
    supabase.removeAllChannels();
  };

  // Calculate mood distribution
  const calculateMoodDistribution = () => {
    const distribution = {
      'Very Happy': 0,
      'Happy': 0,
      'Neutral': 0,
      'Sad': 0,
      'Very Sad': 0
    };

    assessments.forEach(assessment => {
      if (assessment.score >= 9) distribution['Very Happy']++;
      else if (assessment.score >= 7) distribution['Happy']++;
      else if (assessment.score >= 5) distribution['Neutral']++;
      else if (assessment.score >= 3) distribution['Sad']++;
      else distribution['Very Sad']++;
    });

    return distribution;
  };

  const moodDistribution = calculateMoodDistribution();

  const moodChartData = {
    labels: Object.keys(moodDistribution),
    datasets: [
      {
        data: Object.values(moodDistribution),
        backgroundColor: [
          'rgba(72, 187, 120, 0.8)', // Very Happy - Green
          'rgba(156, 163, 175, 0.8)', // Happy - Light gray
          'rgba(147, 51, 234, 0.8)',  // Neutral - Purple
          'rgba(249, 115, 22, 0.8)',  // Sad - Orange
          'rgba(239, 68, 68, 0.8)',   // Very Sad - Red
        ],
        borderColor: [
          'rgba(72, 187, 120, 1)',
          'rgba(156, 163, 175, 1)',
          'rgba(147, 51, 234, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const moodChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const start = startOfMonth(today);
    const days = eachDayOfInterval({ start, end: today });
    return days.map(day => ({
      date: day,
      hasProgress: progressData.some(data => 
        isSameDay(new Date(data.date), day)
      )
    }));
  };

  const calendarDays = generateCalendarDays();

  // Calculate streak
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    const sortedData = [...progressData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    for (let i = 0; i < sortedData.length; i++) {
      const currentDate = new Date(sortedData[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (currentDate.toDateString() === expectedDate.toDateString()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Calculate activity statistics
  const calculateActivityStats = () => {
    const stats = {
      meditation: 0,
      exercise: 0,
      journaling: 0
    };

    progressData.forEach(data => {
      if (data.activities) {
        data.activities.forEach(activity => {
          if (activity.toLowerCase().includes('meditation')) stats.meditation++;
          if (activity.toLowerCase().includes('exercise')) stats.exercise++;
          if (activity.toLowerCase().includes('journal')) stats.journaling++;
        });
      }
    });

    return stats;
  };

  const activityStats = calculateActivityStats();

  // Generate cheerful message
  const generateCheerfulMessage = () => {
    const totalActivities = Object.values(activityStats).reduce((a, b) => a + b, 0);
    if (totalActivities === 0) return "Ready to start your wellness journey? You've got this! 🌟";
    if (totalActivities < 5) return "Great start! Keep building those healthy habits! 🌱";
    if (totalActivities < 10) return "You're making amazing progress! Keep going! 🌈";
    return "Wow! You're absolutely crushing it! Keep up the fantastic work! 🏆";
  };

  const streak = calculateStreak();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-gray-600">Current Streak: {streak} days</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-gray-600">
                  Month Progress: {calendarDays.filter(day => day.hasProgress).length} days
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Monthly Challenge Calendar */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                Monthly Challenge - {format(new Date(), 'MMMM yyyy')}
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-medium text-gray-600 text-sm py-2">
                    {day}
                  </div>
                ))}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                      day.hasProgress
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {format(day.date, 'd')}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Mood Distribution */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Mood Distribution</h2>
                <div className="h-64">
                  <Pie data={moodChartData} options={moodChartOptions} />
                </div>
              </div>

              {/* Activity Summary */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Activity Summary</h2>
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Meditation Sessions</span>
                      <span className="font-medium">{activityStats.meditation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Exercise Sessions</span>
                      <span className="font-medium">{activityStats.exercise}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Journal Entries</span>
                      <span className="font-medium">{activityStats.journaling}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                    <p className="text-purple-700 text-center font-medium">
                      {generateCheerfulMessage()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Connect with Counselor Button */}
          <motion.div
            className="fixed bottom-8 right-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => navigate('/counsellors')}
              className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              Connect with Counselor
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Progress;