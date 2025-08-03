import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Shield, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signIn('email', email, password);
      } else {
        await signUp(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const decorativeImages = [
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1512686096451-a15c19314d59?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Decorative floating images */}
      {decorativeImages.map((src, index) => (
        <motion.img
          key={src}
          src={src}
          alt="Decorative"
          className="absolute rounded-2xl shadow-xl"
          style={{
            width: '200px',
            height: '300px',
            objectFit: 'cover',
            top: `${20 + (index * 25)}%`,
            right: `${-5 + (index * 2)}%`,
            zIndex: 0
          }}
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          transition={{ delay: index * 0.2 }}
          whileHover={{ scale: 1.05, rotate: -2 }}
        />
      ))}

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-sm bg-white/30 p-8 rounded-2xl"
          >
            <div className="text-center md:text-left">
              <motion.div 
                className="flex items-center justify-center md:justify-start mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="h-12 w-12 text-purple-600" />
                <h1 className="text-4xl font-bold text-gray-900 ml-3">MindCare</h1>
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Your Journey to Mental Wellness Starts Here
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join our community of individuals committed to mental well-being. Get access to:
              </p>
              <div className="space-y-4">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 10 }}
                >
                  <Brain className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">Personalized Mental Health Assessments</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 10 }}
                >
                  <Heart className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">24/7 AI Support System</span>
                </motion.div>
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ x: 10 }}
                >
                  <Shield className="h-6 w-6 text-purple-600" />
                  <span className="text-gray-700">Professional Counselor Network</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right side - Auth form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-xl shadow-lg backdrop-blur-lg bg-white/80"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <motion.button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLogin ? (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    <span>Create Account</span>
                  </>
                )}
              </motion.button>

              <p className="text-sm text-gray-600 text-center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;