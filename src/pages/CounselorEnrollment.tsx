import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface EnrollmentForm {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  specialization: string[];
  experienceYears: string;
  licenseNumber: string;
  bio: string;
  availability: boolean;
}

const CounselorEnrollment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<EnrollmentForm>({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    specialization: [],
    experienceYears: '',
    licenseNumber: '',
    bio: '',
    availability: true
  });

  const specializationOptions = [
    'Anxiety & Depression',
    'Relationship Counseling',
    'Career Guidance',
    'Stress Management',
    'Trauma & PTSD',
    'Addiction Recovery',
    'Youth Counseling',
    'Family Therapy'
  ];

  const handleSpecializationChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(option)
        ? prev.specialization.filter(item => item !== option)
        : [...prev.specialization, option]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.fullName || !formData.email || !formData.education || 
          !formData.specialization.length || !formData.experienceYears || 
          !formData.licenseNumber || !formData.bio) {
        throw new Error('Please fill in all required fields');
      }

      // Create counselor profile
      const { error: insertError } = await supabase
        .from('counselor_profiles')
        .insert({
          full_name: formData.fullName,
          specialization: formData.specialization,
          experience_years: parseInt(formData.experienceYears),
          bio: formData.bio,
          availability: formData.availability
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/counsellors');
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-8 text-center">
        <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Counselor</h1>
        <p className="text-gray-600">Join our platform to help others in their mental wellness journey</p>
      </div>

      {success ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-50 p-6 rounded-lg text-center"
        >
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800 mb-2">Application Submitted Successfully!</h2>
          <p className="text-green-600">Thank you for applying. We'll review your application and contact you soon.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                  Professional License Number *
                </label>
                <input
                  type="text"
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Information</h2>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                Educational Background *
              </label>
              <textarea
                id="education"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="List your relevant degrees and certifications"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas of Specialization *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specializationOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      formData.specialization.includes(option)
                        ? 'bg-purple-50 border-purple-500'
                        : 'border-gray-200 hover:border-purple-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.specialization.includes(option)}
                      onChange={() => handleSpecializationChange(option)}
                      className="sr-only"
                    />
                    <span className={`text-sm ${
                      formData.specialization.includes(option)
                        ? 'text-purple-700'
                        : 'text-gray-600'
                    }`}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700">
                Years of Experience *
              </label>
              <input
                type="number"
                id="experienceYears"
                value={formData.experienceYears}
                onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Professional Bio *
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Tell us about your approach to counseling and what clients can expect when working with you"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.checked }))}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-700">
                I am available to take on new clients
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default CounselorEnrollment;