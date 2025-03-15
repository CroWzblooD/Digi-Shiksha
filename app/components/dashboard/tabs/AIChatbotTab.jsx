'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsRobot, BsLightningCharge, BsTranslate, BsStarFill, BsArrowRight, BsChevronDown, BsChevronUp, BsBookmark, BsBookmarkFill, BsThreeDots, BsPlayFill, BsPauseFill } from 'react-icons/bs';
import { FaUser, FaRegLightbulb, FaRegFileAlt, FaRegClock, FaRegStar } from 'react-icons/fa';
import { MdOutlineRecordVoiceOver, MdOutlineTranslate, MdOutlineSchool } from 'react-icons/md';
import { RiTranslate, RiVoiceprintFill } from 'react-icons/ri';
import Image from 'next/image';

const AIChatbotTab = () => {
  // State for active feature
  const [activeFeature, setActiveFeature] = useState('chat');
  
  // State for chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      content: "Hello! I'm your AI learning assistant. How can I help you today with your educational content?",
      timestamp: new Date().toISOString(),
      format: 'text'
    }
  ]);
  
  // State for user input
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  // Ref for chat container to auto-scroll
  const chatContainerRef = useRef(null);
  const audioRef = useRef(null);
  
  // Auto-scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Sample language options
  const languages = [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 
    'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'
  ];
  
  // Sample templates for quick prompts
  const promptTemplates = [
    {
      id: 'template1',
      title: 'Create Learning Module',
      prompt: 'Create a learning module about digital literacy for 12-15 age group students in Hindi.',
      icon: <FaRegFileAlt className="text-green-500" />
    },
    {
      id: 'template2',
      title: 'Simplify Content',
      prompt: 'Simplify this content for rural students with basic literacy: Financial services are essential for economic development and poverty reduction.',
      icon: <MdOutlineSchool className="text-green-500" />
    },
    {
      id: 'template3',
      title: 'Generate Quiz',
      prompt: 'Create a 5-question quiz about internet safety with multiple choice answers.',
      icon: <FaRegLightbulb className="text-amber-500" />
    },
    {
      id: 'template4',
      title: 'Voice Script',
      prompt: 'Write a voice-based learning script about women safety for students without internet access.',
      icon: <RiVoiceprintFill className="text-purple-500" />
    }
  ];
  
  // Features data
  const features = [
    {
      id: 'chat',
      name: 'AI Chat Assistant',
      icon: <BsRobot className="mr-3 text-lg" />,
      active: true
    },
    {
      id: 'translation',
      name: 'Content Translation',
      icon: <MdOutlineTranslate className="mr-3 text-lg" />,
      active: false
    },
    {
      id: 'voice',
      name: 'Voice Generation',
      icon: <MdOutlineRecordVoiceOver className="mr-3 text-lg" />,
      active: false
    },
    {
      id: 'quiz',
      name: 'Quiz Generator',
      icon: <FaRegLightbulb className="mr-3 text-lg" />,
      active: false
    }
  ];
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (userInput.trim() === '') return;
    
    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: userInput,
      timestamp: new Date().toISOString(),
      format: 'text'
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      let responseContent = '';
      let responseFormat = 'text';
      
      // Generate different responses based on active feature
      if (activeFeature === 'chat') {
        const response = generateChatResponse(userInput);
        responseContent = response.content;
        responseFormat = response.format;
      } else if (activeFeature === 'translation') {
        const response = generateTranslationResponse(userInput, selectedLanguage);
        responseContent = response.content;
        responseFormat = response.format;
      } else if (activeFeature === 'voice') {
        const response = generateVoiceResponse(userInput);
        responseContent = response.content;
        responseFormat = response.format;
      } else if (activeFeature === 'quiz') {
        const response = generateQuizResponse(userInput);
        responseContent = response.content;
        responseFormat = response.format;
      }
      
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        content: responseContent,
        timestamp: new Date().toISOString(),
        format: responseFormat
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle feature selection
  const handleFeatureClick = (featureId) => {
    setActiveFeature(featureId);
    
    // Clear chat when switching features
    setMessages([
      {
        id: 1,
        sender: 'ai',
        content: getWelcomeMessage(featureId),
        timestamp: new Date().toISOString(),
        format: 'text'
      }
    ]);
  };
  
  // Get welcome message based on feature
  const getWelcomeMessage = (featureId) => {
    switch(featureId) {
      case 'chat':
        return "Hello! I'm your AI learning assistant. How can I help you today with your educational content?";
      case 'translation':
        return `I can help translate your educational content to ${selectedLanguage}. What would you like to translate?`;
      case 'voice':
        return "I can create voice scripts for your educational content. What topic would you like a voice script for?";
      case 'quiz':
        return "I can generate quizzes based on your educational content. What topic would you like a quiz for?";
      default:
        return "Hello! How can I assist you today?";
    }
  };
  
  // Handle template selection
  const handleTemplateClick = (template) => {
    setActiveTemplate(template.id);
    setUserInput(template.prompt);
  };
  
  // Play audio for voice messages
  const playAudio = (audioUrl, messageId) => {
    if (audioRef.current) {
      if (isPlaying && currentAudio === messageId) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentAudio(null);
      } else {
        if (currentAudio !== messageId) {
          audioRef.current.src = audioUrl;
        }
        audioRef.current.play();
        setIsPlaying(true);
        setCurrentAudio(messageId);
      }
    }
  };
  
  // Response generators for different features
  const generateChatResponse = (input) => {
    if (input.toLowerCase().includes('learning module') || input.toLowerCase().includes('module')) {
      return {
        content: {
          title: "Digital Literacy Learning Module",
          sections: [
            {
              title: "Introduction to Digital Literacy",
              description: "Basic concepts and importance of digital literacy in today's world."
            },
            {
              title: "Understanding Digital Devices",
              description: "Introduction to computers, smartphones, and other digital devices."
            },
            {
              title: "Internet Basics and Safety",
              description: "How the internet works and staying safe online."
            },
            {
              title: "Digital Communication Tools",
              description: "Using email, messaging apps, and social media responsibly."
            },
            {
              title: "Information Literacy",
              description: "Finding, evaluating, and using online information effectively."
            },
            {
              title: "Practical Exercises",
              description: "Hands-on activities to practice digital literacy skills."
            }
          ]
        },
        format: 'module'
      };
    } else if (input.toLowerCase().includes('simplify')) {
      return {
        content: "Here's a simplified version:\n\n\"Money services help people and villages grow. They help poor people have better lives. When people can save money in banks and get loans, they can start small businesses and earn more.\"",
        format: 'text'
      };
    } else if (input.toLowerCase().includes('quiz')) {
      return {
        content: {
          title: "Internet Safety Quiz",
          questions: [
            {
              question: "What should you do if you receive an email asking for your password?",
              options: [
                "Reply with your password",
                "Ignore and delete the email",
                "Click on any links in the email",
                "Share the email with friends"
              ],
              answer: 1
            },
            {
              question: "Which of these is a strong password?",
              options: [
                "password123",
                "your name",
                "Tr5&9p!L@2q",
                "12345678"
              ],
              answer: 2
            },
            {
              question: "What is 'phishing'?",
              options: [
                "A fun online game",
                "A type of computer virus",
                "Attempts to trick you into revealing personal information",
                "A way to speed up your internet"
              ],
              answer: 2
            }
          ]
        },
        format: 'quiz'
      };
    } else if (input.toLowerCase().includes('voice') || input.toLowerCase().includes('script')) {
      return {
        content: {
          title: "Women's Safety Voice Script",
          script: "Welcome to today's lesson on personal safety. Today we'll learn about important safety practices for women in various situations.\n\nFirst, let's talk about being aware of your surroundings. Always notice who is around you and what is happening nearby.",
          audioUrl: "/demo-audio.mp3"
        },
        format: 'voice'
      };
    } else {
      return {
        content: "I understand you're interested in creating educational content. Could you provide more details about the specific type of content you need help with? I can assist with creating learning modules, simplifying content, generating quizzes, or creating voice scripts.",
        format: 'text'
      };
    }
  };
  
  const generateTranslationResponse = (input, language) => {
    const translations = {
      'Hindi': {
        content: {
          original: input,
          translated: 'मैंने आपकी आवश्यकताओं के अनुसार एक शिक्षण मॉड्यूल बनाया है। यहां एक मसौदा रूपरेखा है...',
          language: 'Hindi'
        },
        format: 'translation'
      },
      'Bengali': {
        content: {
          original: input,
          translated: 'আমি আপনার প্রয়োজনীয়তা অনুসারে একটি শিক্ষা মডিউল তৈরি করেছি। এখানে একটি খসড়া রূপরেখা রয়েছে...',
          language: 'Bengali'
        },
        format: 'translation'
      },
      'Tamil': {
        content: {
          original: input,
          translated: 'உங்கள் தேவைகளின் அடிப்படையில் ஒரு கற்றல் தொகுதியை உருவாக்கியுள்ளேன். இங்கே ஒரு வரைவு வரைவு உள்ளது...',
          language: 'Tamil'
        },
        format: 'translation'
      }
    };
    
    return translations[language] || {
      content: {
        original: input,
        translated: `I've translated your content to ${language}. Here's the translated version...`,
        language: language
      },
      format: 'translation'
    };
  };
  
  const generateVoiceResponse = (input) => {
    const topic = input.replace('Write a voice-based learning script about ', '').replace(' for students without internet access', '');
    
    return {
      content: {
        title: `${topic} Voice Script`,
        script: `Welcome to our lesson on ${topic}. Today, we'll explore key concepts that will help you understand this important topic.\n\nLet's begin by understanding the basics of ${topic} and why it matters in our daily lives.`,
        audioUrl: "/demo-audio.mp3"
      },
      format: 'voice'
    };
  };
  
  const generateQuizResponse = (input) => {
    const topic = input.replace('Create a 5-question quiz about ', '').replace(' with multiple choice answers', '');
    
    return {
      content: {
        title: `${topic} Quiz`,
        questions: [
          {
            question: `What is the most important aspect of ${topic}?`,
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            answer: 2
          },
          {
            question: `Which of the following best describes ${topic}?`,
            options: ["Description 1", "Description 2", "Description 3", "Description 4"],
            answer: 1
          },
          {
            question: `How can ${topic} benefit rural communities?`,
            options: ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
            answer: 0
          }
        ]
      },
      format: 'quiz'
    };
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Render message content based on format
  const renderMessageContent = (message) => {
    switch(message.format) {
      case 'module':
        return (
          <div className="bg-white/80 rounded-lg p-3 mt-2">
            <h3 className="font-semibold text-green-700">{message.content.title}</h3>
            <div className="mt-2 space-y-2">
              {message.content.sections.map((section, index) => (
                <div key={index} className="border-l-2 border-green-300 pl-3">
                  <h4 className="font-medium text-sm">{index + 1}. {section.title}</h4>
                  <p className="text-xs text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end">
              <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                Download Module
              </button>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="bg-white/80 rounded-lg p-3 mt-2">
            <h3 className="font-semibold text-green-700">{message.content.title}</h3>
            <div className="mt-2 space-y-4">
              {message.content.questions.map((q, qIndex) => (
                <div key={qIndex} className="border border-gray-100 rounded-lg p-3 bg-white/90">
                  <h4 className="font-medium text-sm mb-2">Question {qIndex + 1}: {q.question}</h4>
                  <div className="space-y-2 ml-2">
                    {q.options.map((option, oIndex) => (
                      <div 
                        key={oIndex} 
                        className={`flex items-center p-2 rounded-md ${
                          q.answer === oIndex 
                            ? 'bg-green-50 border border-green-200' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                          q.answer === oIndex 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {String.fromCharCode(97 + oIndex)}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                Download Quiz
              </button>
              <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                Generate More Questions
              </button>
            </div>
          </div>
        );
      
      case 'voice':
        return (
          <div className="bg-white/80 rounded-lg p-3 mt-2">
            <h3 className="font-semibold text-green-700">{message.content.title}</h3>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-700 whitespace-pre-line">{message.content.script}</p>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <button 
                onClick={() => playAudio(message.content.audioUrl, message.id)}
                className="flex items-center text-xs bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
              >
                {isPlaying && currentAudio === message.id ? (
                  <>
                    <BsPauseFill className="mr-1" /> Pause Audio
                  </>
                ) : (
                  <>
                    <BsPlayFill className="mr-1" /> Play Audio
                  </>
                )}
              </button>
              <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                Download Script
              </button>
            </div>
            <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
        );
      
      case 'translation':
        return (
          <div className="bg-white/80 rounded-lg p-3 mt-2">
            <h3 className="font-semibold text-green-700">Translation to {message.content.language}</h3>
            <div className="mt-2 grid grid-cols-1 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Original Text:</div>
                <p className="text-sm text-gray-700">{message.content.original}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-xs text-gray-500 mb-1">Translated Text ({message.content.language}):</div>
                <p className="text-sm text-green-700">{message.content.translated}</p>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full hover:bg-green-100 transition-colors">
                Copy Translation
              </button>
              <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition-colors">
                Translate to Another Language
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        );
    }
  };
  
  // Handle voice input
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(prev => prev + ' ' + transcript);
      };
      
      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setShowLanguageDropdown(false);
    
    if (activeFeature === 'translation') {
      // Update welcome message for translation feature
      setMessages([
        {
          id: 1,
          sender: 'ai',
          content: `I can help translate your educational content to ${language}. What would you like to translate?`,
          timestamp: new Date().toISOString(),
          format: 'text'
        }
      ]);
    }
  };
  
  return (
    <div className="p-6 bg-gradient-to-br from-green-50/50 to-blue-50/30">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - AI Features */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* AI Assistant Features */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BsLightningCharge className="mr-2 text-green-500" /> AI Features
            </h2>
            
            <div className="space-y-3">
              {features.map(feature => (
                <button 
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg ${
                    activeFeature === feature.id 
                      ? 'bg-green-50/80 text-green-700 hover:bg-green-100' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="flex items-center">
                    {feature.icon}
                    <span className="text-sm font-medium">{feature.name}</span>
                  </div>
                  {activeFeature === feature.id && (
                    <div className="bg-green-200/50 text-green-800 text-xs px-2 py-1 rounded-full">Active</div>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Prompt Templates */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaRegFileAlt className="mr-2 text-green-500" /> Prompt Templates
            </h2>
            
            <div className="space-y-3">
              {promptTemplates.map(template => (
                <button 
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`w-full flex items-center p-3 rounded-lg ${
                    activeTemplate === template.id 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                >
                  <div className="p-2 rounded-md bg-white shadow-sm mr-3">
                    {template.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{template.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[180px]">{template.prompt}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-green-600 hover:text-green-700 flex items-center justify-center">
              <span>View all templates</span>
              <BsArrowRight className="ml-1" />
            </button>
          </div>
          
          {/* Recent Conversations */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaRegClock className="mr-2 text-green-500" /> Recent Conversations
            </h2>
            
            <div className="space-y-3">
              <button className="w-full flex items-center p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Digital Literacy Module</div>
                  <div className="text-xs text-gray-500">Yesterday, 3:45 PM</div>
                </div>
                <BsBookmark className="text-gray-400 hover:text-green-500" />
              </button>
              
              <button className="w-full flex items-center p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Agricultural Science Quiz</div>
                  <div className="text-xs text-gray-500">Oct 12, 2023</div>
                </div>
                <BsBookmarkFill className="text-green-500" />
              </button>
              
              <button className="w-full flex items-center p-3 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Financial Literacy Translation</div>
                  <div className="text-xs text-gray-500">Oct 10, 2023</div>
                </div>
                <BsBookmark className="text-gray-400 hover:text-green-500" />
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Main Chat Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-3 flex flex-col"
        >
          {/* Chat Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100 flex flex-col h-[900px]">
            {/* Chat Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <BsRobot className="text-green-600 text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">AI Learning Assistant</h2>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      Online
                    </span>
                    <span className="mx-2">•</span>
                    <div className="relative">
                      <button 
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex items-center text-green-600 hover:text-green-700"
                      >
                        <RiTranslate className="mr-1" />
                        {selectedLanguage}
                        {showLanguageDropdown ? <BsChevronUp className="ml-1" /> : <BsChevronDown className="ml-1" />}
                      </button>
                      
                      {showLanguageDropdown && (
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 w-36 max-h-48 overflow-y-auto">
                          {languages.map(language => (
                            <button
                              key={language}
                              onClick={() => handleLanguageChange(language)}
                              className={`block w-full text-left px-3 py-1.5 text-xs ${
                                selectedLanguage === language 
                                  ? 'bg-green-50 text-green-700' 
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Simplified header buttons - removed star */}
              <div className="flex space-x-2">
                <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                  <BsThreeDots />
                </button>
              </div>
            </div>
            
            {/* Chat Messages - Fixed height with scrolling */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{ 
                height: "calc(100% - 180px)",
                overflowY: "auto",
                overflowX: "hidden"
              }}
            >
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-green-500 text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl rounded-tl-none border border-green-100'
                  } p-3 shadow-sm`}>
                    <div className="flex items-center mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        message.sender === 'user' 
                          ? 'bg-green-400' 
                          : 'bg-green-100'
                      }`}>
                        {message.sender === 'user' 
                          ? <FaUser className="text-white text-xs" /> 
                          : <BsRobot className="text-green-600 text-xs" />
                        }
                      </div>
                      <span className="text-xs opacity-75">
                        {message.sender === 'user' ? 'You' : 'AI Assistant'}
                      </span>
                      <span className="text-xs opacity-50 ml-auto">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    
                    {renderMessageContent(message)}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-sm text-gray-800 rounded-2xl rounded-tl-none p-3 shadow-sm border border-green-100 max-w-[80%]">
                    <div className="flex items-center mb-1">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <BsRobot className="text-green-600 text-xs" />
                      </div>
                      <span className="text-xs opacity-75">AI Assistant</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Input - Fixed at bottom */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="relative">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type your message here..."
                  className="w-full text-black border border-gray-200 rounded-xl p-1 pr-8 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300/30 bg-white/90 backdrop-blur-sm resize-none shadow-sm placeholder:text-start placeholder:text-gray-400 placeholder:font-light placeholder:text-sm transition-all"
                  rows={2}
                  style={{
                    textAlign: userInput ? 'left' : 'start',
                    paddingTop: userInput ? '1.5rem' : '1.5rem',
                  }}
                ></textarea>
                
                <button
                  onClick={handleSendMessage}
                  disabled={userInput.trim() === '' || isTyping}
                  className={`absolute right-3 bottom-3 p-2.5 rounded-full ${
                    userInput.trim() === '' || isTyping
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transform hover:scale-105'
                  } transition-all duration-200`}
                >
                  <BsArrowRight className="text-lg" />
                </button>
              </div>
              
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                <div>
                  Press <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono">Enter</span> to send, 
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 font-mono ml-1">Shift + Enter</span> for new line
                </div>
                
                {/* Functional buttons */}
                <div className="flex space-x-2">
                  <button 
                    onClick={handleVoiceInput}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                    title="Voice input"
                  >
                    <MdOutlineRecordVoiceOver className="text-lg" />
                  </button>
                  <button 
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                    title="Change language"
                  >
                    <MdOutlineTranslate className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white"
          >
            <div className="flex items-start">
              <div className="mr-4">
                {activeFeature === 'chat' && <BsRobot className="text-3xl" />}
                {activeFeature === 'translation' && <MdOutlineTranslate className="text-3xl" />}
                {activeFeature === 'voice' && <MdOutlineRecordVoiceOver className="text-3xl" />}
                {activeFeature === 'quiz' && <FaRegLightbulb className="text-3xl" />}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeFeature === 'chat' && 'AI Chat Assistant'}
                  {activeFeature === 'translation' && 'Content Translation'}
                  {activeFeature === 'voice' && 'Voice Generation'}
                  {activeFeature === 'quiz' && 'Quiz Generator'}
                </h3>
                
                <p className="text-green-50 text-sm">
                  {activeFeature === 'chat' && 'Our AI assistant helps you create educational content tailored to your needs. Ask for learning modules, simplified content, or educational resources.'}
                  {activeFeature === 'translation' && 'Translate your educational content into multiple Indian languages to reach a wider audience and make learning accessible.'}
                  {activeFeature === 'voice' && 'Generate voice scripts for educational content that can be delivered through voice-based channels for students without internet access.'}
                  {activeFeature === 'quiz' && 'Create interactive quizzes on any topic to test knowledge and enhance learning through assessment.'}
                </p>
                
                <div className="mt-4 flex space-x-2">
                  <button className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                    Learn More
                  </button>
                  <button className="bg-white text-green-600 text-sm px-4 py-2 rounded-lg hover:bg-green-50 transition-colors">
                    View Examples
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIChatbotTab;