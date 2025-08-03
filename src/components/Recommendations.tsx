import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';

interface RecommendationsProps {
  severityLevel: 'minor' | 'mild' | 'major';
}

const recommendedVideos = [
  {
    title: 'Understanding Anxiety',
    url: 'https://www.youtube.com/watch?v=WWloIAQpMcQ',
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mindfulness Meditation',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Stress Management Techniques',
    url: 'https://www.youtube.com/watch?v=0fL-pn80s-c',
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  },
];

const Recommendations: React.FC<RecommendationsProps> = ({ severityLevel }) => {
  const navigate = useNavigate();

  const renderMinorRecommendations = () => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold mb-4">AI Chat Support</h3>
        <p className="text-gray-600 mb-4">
          Based on your assessment, we recommend starting with our AI chat support. 
          Our AI assistant can help you with:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>Basic coping strategies</li>
          <li>Mindfulness exercises</li>
          <li>Stress management techniques</li>
          <li>General mental wellness tips</li>
        </ul>
        <p className="text-gray-600 mb-4">
          Feel free to chat with our AI assistant using the chat button below. The conversation
          is private and available 24/7.
        </p>
      </motion.div>
      <Chatbot autoOpen={true} />
    </motion.div>
  );

  const renderMildRecommendations = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Recommended Videos</h3>
      <div className="grid gap-4">
        {recommendedVideos.map((video, index) => (
          <motion.a
            key={index}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex-shrink-0">
              <Youtube className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{video.title}</h4>
              <p className="text-sm text-gray-500">Click to watch on YouTube</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );

  const renderMajorRecommendations = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Professional Support</h3>
      <p className="text-gray-600 mb-4">
        Based on your assessment, we strongly recommend speaking with a professional counselor.
        Our experienced counselors are here to help you navigate through this.
      </p>
      <button
        onClick={() => navigate('/counsellors')}
        className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full justify-center"
      >
        <Users className="h-5 w-5" />
        <span>Connect with a Counselor</span>
      </button>
    </div>
  );

  return (
    <div className="mt-6">
      {severityLevel === 'minor' && renderMinorRecommendations()}
      {severityLevel === 'mild' && renderMildRecommendations()}
      {severityLevel === 'major' && renderMajorRecommendations()}
    </div>
  );
};

export default Recommendations;