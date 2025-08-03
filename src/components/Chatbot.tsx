import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

interface ChatbotProps {
  autoOpen?: boolean;
}

const Chatbot: React.FC<ChatbotProps> = ({ autoOpen = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! I'm your friendly mental health companion. How are you feeling today? Remember, you can talk to me about anything - I'm here to listen and support you.", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [lastContext, setLastContext] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    // Anxiety responses
    if (lowerInput.includes('anxious') || lowerInput.includes('anxiety')) {
      if (lowerInput.includes('work') || lowerInput.includes('job')) {
        return "Work anxiety can be really challenging. I understand how overwhelming deadlines and responsibilities can feel. Would you like to talk about what specific aspects of work are causing you anxiety? We could explore some practical coping strategies together, like breaking tasks into smaller steps or setting healthy boundaries.";
      }
      if (lowerInput.includes('social') || lowerInput.includes('people')) {
        return "Social anxiety is something many people experience. It's completely normal to feel nervous in social situations. Can you tell me more about what specific social situations make you feel anxious? Sometimes, starting with small, comfortable social interactions can help build confidence gradually.";
      }
      return "I hear that you're feeling anxious, and that's completely valid. Let's work through this together. First, let's try a quick grounding exercise: take a deep breath with me, notice five things you can see around you, and feel your feet firmly on the ground. How about we explore what's causing this anxiety and find some strategies that work for you?";
    }

    // Depression responses
    if (lowerInput.includes('sad') || lowerInput.includes('depressed') || lowerInput.includes('depression')) {
      if (lowerInput.includes('lonely') || lowerInput.includes('alone')) {
        return "Feeling sad and lonely can be really hard. I want you to know that even though it might not feel like it right now, you're not alone in this. Would you like to talk about what's making you feel this way? Sometimes, sharing our feelings can be a first step toward feeling better. What kind of support do you feel would be most helpful right now?";
      }
      if (lowerInput.includes('hopeless') || lowerInput.includes('give up')) {
        return "I'm really glad you're reaching out. When everything feels hopeless, it takes courage to keep going and to talk about it. Your feelings are valid, but please remember that hopelessness is often depression speaking, not reality. Can we talk about what's making you feel this way? There are always options and people who want to help, even when it doesn't feel like it.";
      }
      return "I'm here with you, and I'm really listening. Depression can make everything feel heavy and overwhelming, but you don't have to carry this weight alone. Would you like to tell me more about what you're going through? We can take it one small step at a time.";
    }

    // Stress responses
    if (lowerInput.includes('stress') || lowerInput.includes('stressed') || lowerInput.includes('overwhelming')) {
      if (lowerInput.includes('study') || lowerInput.includes('exam') || lowerInput.includes('school')) {
        return "Academic stress can feel really intense. It's completely normal to feel overwhelmed with studies. Let's break this down together - what specific aspect is causing you the most stress right now? We can work on creating a manageable study plan and discuss some stress-relief techniques that work while studying.";
      }
      if (lowerInput.includes('family') || lowerInput.includes('relationship')) {
        return "Relationship and family stress can be particularly challenging because it affects us so personally. Would you like to talk about what's happening? Sometimes, just expressing our feelings about complex relationships can help us see things more clearly. We can also explore healthy ways to manage these relationships while taking care of your own well-being.";
      }
      return "I can hear how stressed you're feeling. Let's pause for a moment and take a deep breath together. Sometimes when everything feels overwhelming, it helps to break things down into smaller pieces. Would you like to tell me what's contributing to your stress? We can work on finding practical ways to manage it together.";
    }

    // Sleep and fatigue
    if (lowerInput.includes('tired') || lowerInput.includes('exhausted') || lowerInput.includes('sleep')) {
      if (lowerInput.includes('insomnia') || lowerInput.includes('cant sleep') || lowerInput.includes("can't sleep")) {
        return "Sleep troubles can be really frustrating and affect our whole day. Let's talk about your bedtime routine. Have you noticed any patterns that might be affecting your sleep? We could explore some relaxation techniques specifically designed for better sleep, like progressive muscle relaxation or breathing exercises.";
      }
      return "Being tired can affect us both physically and emotionally. It sounds like you might be carrying a lot right now. Would you like to explore some energy management strategies or talk about what might be draining your energy? Sometimes, it's not just about sleep, but about finding the right balance in our daily activities.";
    }

    // Positive responses
    if (lowerInput.includes('better') || lowerInput.includes('good') || lowerInput.includes('happy')) {
      if (lastContext.includes('anxiety') || lastContext.includes('stress')) {
        return "I'm so glad you're feeling better! It takes strength to work through anxiety and stress. What do you think helped the most? Understanding what works for you can be really valuable for the future.";
      }
      return "It's wonderful to hear you're feeling good! These positive moments are worth celebrating. Would you like to share what's contributing to your good mood? Sometimes reflecting on what makes us feel better can help us build more positive experiences.";
    }

    // General support responses
    if (lowerInput.includes('help') || lowerInput.includes('support')) {
      return "I'm right here with you, and I want to help. Sometimes the first step is just talking about what's on your mind. What kind of support would be most helpful right now? We can work through this together, whether you need someone to listen, want to explore coping strategies, or just need a friendly chat.";
    }

    // Gratitude responses
    if (lowerInput.includes('thank')) {
      return "You're very welcome! I'm glad we could talk. Remember, supporting each other is what helps us all grow stronger. I'm here whenever you need someone to talk to. How are you feeling now?";
    }

    // Goodbye responses
    if (lowerInput.includes('bye') || lowerInput.includes('goodbye')) {
      return "Take good care of yourself! Remember, you're stronger than you think, and it's okay to reach out whenever you need support. I'll be here when you want to talk again. Have a peaceful day!";
    }

    // Greeting responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hi! I'm really glad you're here. How are you feeling today? Remember, there's no right or wrong way to feel - I'm here to listen and support you, whatever you'd like to talk about.";
    }

    // Default response with context awareness
    setLastContext(lowerInput);
    return "I'm here with you, and I'm listening. Sometimes just sharing our thoughts can help us understand them better. Would you like to tell me more about what's on your mind? We can explore this together at your own pace.";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message with animation
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Generate and add bot response with typing animation
    setTimeout(() => {
      const response = generateResponse(input);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, x: 0, y: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50" ref={chatContainerRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-lg shadow-xl w-96 mb-4 overflow-hidden"
          >
            <motion.div 
              className="bg-purple-600 p-4 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold">Mental Health Support</h3>
            </motion.div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-purple-600 text-white'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <motion.div 
              className="p-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 resize-none"
                  rows={1}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

export default Chatbot;