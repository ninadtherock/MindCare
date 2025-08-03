import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import Recommendations from '../components/Recommendations';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface Question {
  id: string;
  text: string;
  options: string[];
  nextQuestions?: { [key: string]: string[] };
  category?: string;
}

const questions: { [key: string]: Question } = {
  // Initial screening questions
  'initial-1': {
    id: 'initial-1',
    text: 'Over the past 2 weeks, which of these areas has concerned you the most?',
    options: [
      'Mood and Emotions',
      'Anxiety and Stress',
      'Sleep and Energy',
      'Social Relationships',
      'Work or Academic Performance'
    ],
    nextQuestions: {
      'Mood and Emotions': ['mood-1', 'mood-2', 'mood-3'],
      'Anxiety and Stress': ['anxiety-1', 'anxiety-2', 'anxiety-3'],
      'Sleep and Energy': ['sleep-1', 'sleep-2', 'sleep-3'],
      'Social Relationships': ['social-1', 'social-2', 'social-3'],
      'Work or Academic Performance': ['work-1', 'work-2', 'work-3']
    }
  },

  // Mood and Emotions branch
  'mood-1': {
    id: 'mood-1',
    text: 'How often have you felt down, depressed, or hopeless?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    category: 'mood'
  },
  'mood-2': {
    id: 'mood-2',
    text: 'Have you had little interest or pleasure in doing things you usually enjoy?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    category: 'mood'
  },
  'mood-3': {
    id: 'mood-3',
    text: 'How often have you had thoughts that you would be better off not living?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often'],
    category: 'mood'
  },

  // Anxiety and Stress branch
  'anxiety-1': {
    id: 'anxiety-1',
    text: 'How often do you feel nervous, anxious, or on edge?',
    options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'],
    category: 'anxiety'
  },
  'anxiety-2': {
    id: 'anxiety-2',
    text: 'How often do you find yourself worrying excessively about different things?',
    options: ['Rarely or never', 'Occasionally', 'Frequently', 'Almost constantly'],
    category: 'anxiety'
  },
  'anxiety-3': {
    id: 'anxiety-3',
    text: 'Do you experience physical symptoms when anxious (racing heart, sweating, trembling)?',
    options: ['Never', 'Sometimes', 'Often', 'Very often'],
    category: 'anxiety'
  },

  // Sleep and Energy branch
  'sleep-1': {
    id: 'sleep-1',
    text: 'How would you rate your sleep quality over the past week?',
    options: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'],
    category: 'sleep'
  },
  'sleep-2': {
    id: 'sleep-2',
    text: 'How often do you have trouble falling or staying asleep?',
    options: ['Never', '1-2 times a week', '3-5 times a week', 'Almost every night'],
    category: 'sleep'
  },
  'sleep-3': {
    id: 'sleep-3',
    text: 'How often do you feel tired or have low energy during the day?',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Almost always'],
    category: 'sleep'
  },

  // Social Relationships branch
  'social-1': {
    id: 'social-1',
    text: 'How comfortable do you feel in social situations?',
    options: ['Very comfortable', 'Somewhat comfortable', 'Somewhat uncomfortable', 'Very uncomfortable'],
    category: 'social'
  },
  'social-2': {
    id: 'social-2',
    text: 'How often do you feel lonely or isolated?',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Almost always'],
    category: 'social'
  },
  'social-3': {
    id: 'social-3',
    text: 'How satisfied are you with your relationships with friends and family?',
    options: ['Very satisfied', 'Somewhat satisfied', 'Somewhat dissatisfied', 'Very dissatisfied'],
    category: 'social'
  },

  // Work/Academic Performance branch
  'work-1': {
    id: 'work-1',
    text: 'How often do you feel overwhelmed by your work or academic responsibilities?',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Almost always'],
    category: 'work'
  },
  'work-2': {
    id: 'work-2',
    text: 'How well can you concentrate on tasks?',
    options: ['Very well', 'Fairly well', 'With some difficulty', 'With great difficulty'],
    category: 'work'
  },
  'work-3': {
    id: 'work-3',
    text: 'How often do you procrastinate on important tasks?',
    options: ['Rarely or never', 'Sometimes', 'Often', 'Almost always'],
    category: 'work'
  }
};

const Assessment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentQuestionId, setCurrentQuestionId] = useState('initial-1');
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [questionQueue, setQuestionQueue] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [primaryConcern, setPrimaryConcern] = useState<string>('');

  const calculateSeverity = (answers: { [key: string]: number }) => {
    const categories: { [key: string]: number[] } = {
      mood: [],
      anxiety: [],
      sleep: [],
      social: [],
      work: []
    };

    Object.keys(answers).forEach(questionId => {
      const question = questions[questionId];
      if (question.category) {
        categories[question.category].push(answers[questionId]);
      }
    });

    const categoryScores = Object.entries(categories).reduce((acc, [category, scores]) => {
      if (scores.length > 0) {
        acc[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
      return acc;
    }, {} as { [key: string]: number });

    const maxScore = Math.max(...Object.values(categoryScores));
    const roundedScore = Math.round(maxScore * 5);
    
    if (maxScore <= 1) return { level: 'minor', color: 'green', score: roundedScore };
    if (maxScore <= 2) return { level: 'mild', color: 'yellow', score: roundedScore };
    return { level: 'major', color: 'red', score: roundedScore };
  };

  const getRecommendations = (severity: string, primaryConcern: string) => {
    const baseRecommendations = {
      minor: 'Consider incorporating mindfulness and relaxation techniques into your daily routine.',
      mild: 'Regular exercise and stress management techniques may be helpful. Consider scheduling a consultation.',
      major: 'We strongly recommend scheduling a session with one of our professional counselors.'
    };

    const concernSpecificRecommendations = {
      'Mood and Emotions': 'Focus on activities that bring you joy and maintain a regular daily routine.',
      'Anxiety and Stress': 'Practice deep breathing exercises and progressive muscle relaxation.',
      'Sleep and Energy': 'Establish a consistent sleep schedule and bedtime routine.',
      'Social Relationships': 'Gradually increase social interactions and maintain connections with loved ones.',
      'Work or Academic Performance': 'Break tasks into smaller, manageable pieces and take regular breaks.'
    };

    return `${baseRecommendations[severity as keyof typeof baseRecommendations]} ${concernSpecificRecommendations[primaryConcern as keyof typeof concernSpecificRecommendations]}`;
  };

  const calculateProgress = () => {
    if (currentQuestionId === 'initial-1') {
      return 0;
    }

    // Total questions will be initial question (1) + branch questions (3)
    const totalQuestions = 4;
    const answeredQuestions = Object.keys(answers).length;
    
    // Calculate progress as a percentage
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleAnswer = async (optionIndex: number) => {
    const newAnswers = { ...answers, [currentQuestionId]: optionIndex };
    setAnswers(newAnswers);

    if (currentQuestionId === 'initial-1') {
      const selectedOption = questions[currentQuestionId].options[optionIndex];
      setPrimaryConcern(selectedOption);
      const nextQuestions = questions[currentQuestionId].nextQuestions?.[selectedOption] || [];
      setQuestionQueue(nextQuestions);
      setCurrentQuestionId(nextQuestions[0]);
    } else {
      const remainingQuestions = questionQueue.filter(id => id !== currentQuestionId);
      
      if (remainingQuestions.length > 0) {
        setQuestionQueue(remainingQuestions);
        setCurrentQuestionId(remainingQuestions[0]);
      } else {
        setIsComplete(true);
        if (user) {
          await saveAssessment(newAnswers);
        }
      }
    }
  };

  const saveAssessment = async (finalAnswers: { [key: string]: number }) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const { level, score } = calculateSeverity(finalAnswers);
      const recommendations = getRecommendations(level, primaryConcern);

      const { error: saveError } = await supabase
        .from('assessments')
        .insert({
          user_id: user.id,
          severity_level: level,
          score: score,
          recommendations: recommendations,
        });

      if (saveError) throw saveError;
    } catch (err: any) {
      console.error('Error saving assessment:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionId];
  const progress = calculateProgress();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mental Health Assessment</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!isComplete ? (
        <div className="bg-white p-6 rounded-lg shadow-lg overflow-hidden">
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-purple-600 h-2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {Object.keys(answers).length + 1} of {
                currentQuestionId === 'initial-1' 
                  ? '4 (Initial Assessment)' 
                  : '4'
              }
            </p>
          </div>

          <motion.div
            key={currentQuestionId}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <div className="text-center mb-8">
            <motion.div 
              className="mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {calculateSeverity(answers).level === 'minor' ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              ) : (
                <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold mb-4">Assessment Complete</h2>
            <p className="text-gray-600 mb-6">
              Based on your responses, your condition appears to be{' '}
              <span className="font-semibold">{calculateSeverity(answers).level}</span>
            </p>
          </div>

          <Recommendations severityLevel={calculateSeverity(answers).level} />

          <div className="mt-8 space-y-4">
            <motion.button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Detailed Results
            </motion.button>
            <motion.button
              onClick={() => {
                setCurrentQuestionId('initial-1');
                setAnswers({});
                setQuestionQueue([]);
                setIsComplete(false);
                setPrimaryConcern('');
                setError(null);
              }}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Take Assessment Again
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Assessment;