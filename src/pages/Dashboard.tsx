import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Assessment {
  id: string;
  assessment_date: string;
  severity_level: 'minor' | 'mild' | 'major';
  score: number;
  recommendations: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssessments();
    }
  }, [user]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('assessment_date', { ascending: true });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setAssessmentHistory(data);
        setLatestAssessment(data[data.length - 1]);
      } else {
        setAssessmentHistory([]);
        setLatestAssessment(null);
      }
    } catch (error: any) {
      console.error('Error fetching assessments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: assessmentHistory.map(assessment => 
      new Date(assessment.assessment_date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Assessment Score',
        data: assessmentHistory.map(assessment => assessment.score),
        fill: true,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        borderColor: 'rgba(147, 51, 234, 0.8)',
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Assessment</h2>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : latestAssessment ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date</span>
                <span className="font-medium">
                  {new Date(latestAssessment.assessment_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Severity Level</span>
                <span className={`font-medium ${
                  latestAssessment.severity_level === 'minor' ? 'text-green-600' :
                  latestAssessment.severity_level === 'mild' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {latestAssessment.severity_level}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Score</span>
                <span className="font-medium">{latestAssessment.score}</span>
              </div>
              {latestAssessment.recommendations && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <p className="text-gray-600">{latestAssessment.recommendations}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No assessments taken yet.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          {assessmentHistory.length > 0 ? (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text-gray-600">Take your first assessment to see your progress here.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;