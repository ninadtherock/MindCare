import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, LogIn, UserPlus, X, Home, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, signIn, signUp, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signIn('email', email, password);
      } else {
        await signUp(email, password);
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <Brain className="h-8 w-8 text-purple-600" />
                <span className="ml-2 text-xl font-bold text-gray-800">MindCare</span>
              </Link>
              {user && (
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-purple-600">Dashboard</Link>
                  <Link to="/assessment" className="text-gray-700 hover:text-purple-600">Assessment</Link>
                  <Link 
                    to="/counselor-enrollment" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Become a Counselor</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setShowAuthModal(true);
                    }}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {showAuthModal && (
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
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Log In' : 'Sign Up'}</h2>

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

                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  {isLogin ? 'Log In' : 'Sign Up'}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </button>
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;