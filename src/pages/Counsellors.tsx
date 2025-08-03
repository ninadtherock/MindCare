import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  counselor: {
    name: string;
    email: string;
  };
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, counselor }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSchedule = async () => {
    if (!selectedDate || !user) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/schedule-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          counselorName: counselor.name,
          counselorEmail: counselor.email,
          patientName: user.email,
          patientEmail: user.email,
          dateTime: selectedDate.toISOString(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMeetLink(data.meetLink);
      } else {
        throw new Error(data.error || 'Failed to schedule session');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>

            <h2 className="text-2xl font-bold mb-6">Schedule Session with {counselor.name}</h2>

            {success ? (
              <div className="text-center">
                <div className="mb-4 text-green-600">
                  Session scheduled successfully!
                </div>
                {meetLink && (
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Join your session using this link:</p>
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 underline"
                    >
                      Google Meet Link
                    </a>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date and Time
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={60}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={new Date()}
                    className="w-full p-2 border rounded-md"
                    placeholderText="Click to select"
                  />
                </div>

                {error && (
                  <div className="mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSchedule}
                  disabled={!selectedDate || loading}
                  className={`w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors ${
                    (!selectedDate || loading) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Scheduling...' : 'Schedule Session'}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Counsellors = () => {
  const [selectedCounselor, setSelectedCounselor] = useState<{ name: string; email: string; } | null>(null);

  const counselors = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@mindcare.com',
      specialization: 'Anxiety & Depression',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
      rating: 4.9,
      reviews: 120,
    },
    // Add more counselors...
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Counsellors</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counselors.map((counselor, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <img
              src={counselor.image}
              alt={counselor.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{counselor.name}</h2>
            <p className="text-gray-600 mb-4">Specializing in {counselor.specialization}</p>
            <div className="flex items-center space-x-2 mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-600">{counselor.rating} ({counselor.reviews} reviews)</span>
            </div>
            <button
              onClick={() => setSelectedCounselor({ name: counselor.name, email: counselor.email })}
              className="flex items-center justify-center w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Session
            </button>
          </motion.div>
        ))}
      </div>

      <ScheduleModal
        isOpen={!!selectedCounselor}
        onClose={() => setSelectedCounselor(null)}
        counselor={selectedCounselor || { name: '', email: '' }}
      />
    </motion.div>
  );
};

export default Counsellors;