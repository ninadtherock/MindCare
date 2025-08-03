import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Users } from 'lucide-react';
import Chatbot from '../components/Chatbot';

const Home = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isLoaded, setIsLoaded] = useState(false);

  // Parallax and fade effects based on scroll
  const heroScale = useTransform(scrollY, [0, 500], [1.1, 1.3]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 1.2, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  };

  const heroImageVariants = {
    hidden: { scale: 1.4, opacity: 0 },
    visible: {
      scale: 1.1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeOut"
      }
    }
  };

  const heroContentVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  // Updated mental health related images with verified Unsplash URLs
  const featureImages = [
    {
      url: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?auto=format&fit=crop&w=800&q=80",
      title: "Mental Health Assessment"
    },
    {
      url: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&w=800&q=80",
      title: "Track Your Progress"
    },
    {
      url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=800&q=80",
      title: "Professional Support"
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section with parallax effect */}
      <motion.div 
        className="relative h-[80vh] overflow-hidden"
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="absolute inset-0"
          style={{ scale: heroScale, opacity: heroOpacity, y: heroY }}
          variants={heroImageVariants}
        >
          <motion.img
            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1920&q=80"
            alt="Mental Wellness"
            className="w-full h-full object-cover"
            initial={{ scale: 1.4 }}
            animate={{ scale: 1.1 }}
            transition={{ 
              duration: 20,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-purple-900/60 to-purple-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </motion.div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <motion.div 
            className="text-white max-w-2xl"
            variants={heroContentVariants}
          >
            <motion.h1 
              className="text-6xl font-bold mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              Begin Your Journey to Mental Wellness
            </motion.h1>
            <motion.p 
              className="text-xl mb-8 text-gray-100"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Take the first step towards a healthier mind with our comprehensive mental health support platform.
            </motion.p>
            <motion.button
              onClick={() => navigate('/assessment')}
              className="bg-white text-purple-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-50 transition-colors"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Assessment
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-4xl font-bold text-gray-900 mb-6"
          >
            How We Can Help
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our platform provides personalized support, professional guidance, and tools to help you thrive.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {featureImages.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300"
            >
              <motion.div
                className="relative h-48 overflow-hidden"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={feature.url}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>
              
              <div className="p-6">
                {index === 0 && <Brain className="h-12 w-12 text-purple-600 mb-4" />}
                {index === 1 && <Heart className="h-12 w-12 text-purple-600 mb-4" />}
                {index === 2 && <Users className="h-12 w-12 text-purple-600 mb-4" />}
                
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">
                  {index === 0 && "Take our comprehensive assessment to understand your mental well-being better."}
                  {index === 1 && "Monitor your journey and see how far you've come with our progress tracking tools."}
                  {index === 2 && "Connect with licensed counselors who can provide the support you need."}
                </p>
                <motion.button
                  onClick={() => navigate(index === 0 ? '/assessment' : index === 1 ? '/progress' : '/counsellors')}
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {index === 0 && "Take Assessment"}
                  {index === 1 && "View Progress"}
                  {index === 2 && "Meet Counselors"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative rounded-xl overflow-hidden"
        >
          <motion.img
            variants={imageVariants}
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1920&q=80"
            alt="Mental wellness"
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-transparent" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute inset-0 flex items-center justify-start px-12"
          >
            <div className="text-white max-w-lg">
              <h2 className="text-3xl font-bold mb-4">Start Your Journey Today</h2>
              <p className="text-lg mb-6">
                Take the first step towards better mental health with our comprehensive support system.
              </p>
              <motion.button
                onClick={() => navigate('/assessment')}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Begin Assessment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
        
        <Chatbot />
      </div>
    </div>
  );
};

export default Home;