'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChalkboardTeacher, 
  FaGraduationCap, 
  FaCheck, 
  FaRegClock,
  FaChartLine,
  FaRegCalendarAlt,
  FaPlay,
  FaLock,
  FaUnlock,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import { 
  BsSearch, 
  BsThreeDotsVertical, 
  BsTranslate, 
  BsBarChart, 
  BsCheckCircleFill,
  BsStarFill,
  BsArrowRight
} from 'react-icons/bs';
import { MdOutlineQuiz, MdOutlineAssignment, MdOutlineSchool } from 'react-icons/md';
import { RiMedalLine, RiTimerLine } from 'react-icons/ri';

const AdaptiveAssessmentsTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Mock assessments data
  const assessments = [
    {
      id: 1,
      title: 'Basic Digital Literacy',
      category: 'Digital Skills',
      difficulty: 'Beginner',
      questions: 15,
      timeLimit: 20, // minutes
      language: 'Hindi',
      completionRate: 78,
      image: 'https://via.placeholder.com/150',
      description: 'Test your understanding of basic computer operations, internet usage, and digital tools.',
      completed: false,
      locked: false
    },
    {
      id: 2,
      title: 'Financial Literacy Fundamentals',
      category: 'Financial Literacy',
      difficulty: 'Intermediate',
      questions: 20,
      timeLimit: 30,
      language: 'Hindi',
      completionRate: 65,
      image: 'https://via.placeholder.com/150',
      description: 'Assess your knowledge of basic financial concepts, banking, and money management.',
      completed: true,
      score: 85,
      locked: false
    },
    {
      id: 3,
      title: 'Agricultural Best Practices',
      category: 'Agriculture',
      difficulty: 'Intermediate',
      questions: 25,
      timeLimit: 35,
      language: 'Bengali',
      completionRate: 42,
      image: 'https://via.placeholder.com/150',
      description: 'Test your knowledge of modern farming techniques, crop management, and sustainable practices.',
      completed: false,
      locked: false
    },
    {
      id: 4,
      title: 'Health and Nutrition Basics',
      category: 'Health',
      difficulty: 'Beginner',
      questions: 15,
      timeLimit: 20,
      language: 'Tamil',
      completionRate: 89,
      image: 'https://via.placeholder.com/150',
      description: 'Evaluate your understanding of basic health concepts, nutrition, and preventive healthcare.',
      completed: false,
      locked: false
    },
    {
      id: 5,
      title: 'Advanced Digital Marketing',
      category: 'Digital Skills',
      difficulty: 'Advanced',
      questions: 30,
      timeLimit: 45,
      language: 'Hindi',
      completionRate: 35,
      image: 'https://via.placeholder.com/150',
      description: 'Test your knowledge of digital marketing strategies, social media, and online business.',
      completed: false,
      locked: true
    },
    {
      id: 6,
      title: 'Entrepreneurship Fundamentals',
      category: 'Business',
      difficulty: 'Intermediate',
      questions: 20,
      timeLimit: 30,
      language: 'Marathi',
      completionRate: 58,
      image: 'https://via.placeholder.com/150',
      description: 'Assess your understanding of business concepts, entrepreneurship, and market analysis.',
      completed: false,
      locked: true
    }
  ];
  
  // Mock questions for assessments
  const mockQuestions = {
    1: [
      {
        id: 1,
        question: 'What is the main function of a web browser?',
        options: [
          'To create documents',
          'To access websites on the internet',
          'To store files on the computer',
          'To send emails'
        ],
        correctAnswer: 1
      },
      {
        id: 2,
        question: 'Which of these is NOT a common input device?',
        options: [
          'Keyboard',
          'Mouse',
          'Monitor',
          'Scanner'
        ],
        correctAnswer: 2
      },
      {
        id: 3,
        question: 'What does "URL" stand for?',
        options: [
          'Universal Resource Locator',
          'Uniform Resource Locator',
          'United Resource Link',
          'Universal Reference Link'
        ],
        correctAnswer: 1
      }
    ],
    2: [
      {
        id: 1,
        question: 'What is a budget?',
        options: [
          'A list of all your debts',
          'A plan for how to spend your money',
          'A type of bank account',
          'A government tax'
        ],
        correctAnswer: 1
      }
    ]
  };
  
  const categories = ['all', 'Digital Skills', 'Financial Literacy', 'Agriculture', 'Health', 'Business'];
  
  // Filter assessments based on active category and search term
  const filteredAssessments = assessments.filter(assessment => 
    (activeCategory === 'all' || assessment.category === activeCategory) &&
    (assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     assessment.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Start assessment
  const startAssessment = (assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setAssessmentCompleted(false);
    setAssessmentResult(null);
    setTimeLeft(assessment.timeLimit * 60); // Convert minutes to seconds
    setShowAssessmentModal(true);
    setTimerActive(true);
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  // Handle next question
  const handleNextQuestion = () => {
    const questions = mockQuestions[currentAssessment.id];
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete assessment
      completeAssessment();
    }
  };

  // Complete assessment
  const completeAssessment = () => {
    setTimerActive(false);
    
    // Calculate score
    const questions = mockQuestions[currentAssessment.id];
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Set result
    setAssessmentResult({
      score,
      totalQuestions: questions.length,
      correctAnswers,
      timeTaken: (currentAssessment.timeLimit * 60) - timeLeft,
      strengths: ['Digital Concepts', 'Internet Usage'],
      weaknesses: ['Hardware Knowledge', 'Security Concepts']
    });
    
    setAssessmentCompleted(true);
  };

  // Timer effect
  useEffect(() => {
    let timer;
    
    if (timerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      // Time's up, complete assessment
      completeAssessment();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [timerActive, timeLeft]);

  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaChalkboardTeacher className="mr-2 text-green-500 text-3xl" />
        Adaptive Assessments
      </h1>
      
      {/* Featured Assessment */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg overflow-hidden mb-8"
      >
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0 md:pr-6">
            <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-xs font-medium mb-3">
              Featured Assessment
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Personalized Skill Assessment
            </h3>
            <p className="text-green-100 mb-4">
              Take our adaptive assessment to identify your skill levels and get personalized learning recommendations.
              Available in 8 regional languages.
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => startAssessment(assessments[0])}
                className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center"
              >
                <FaPlay className="mr-2" /> Start Assessment
              </button>
              <button className="bg-green-400 bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-40 transition-colors flex items-center">
                <FaDownload className="mr-2" /> Download Offline
              </button>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-green-400 bg-opacity-30 rounded-full flex items-center justify-center">
                <div className="w-40 h-40 bg-green-400 bg-opacity-40 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <MdOutlineQuiz className="text-green-600 text-4xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-green-500" /> Your Assessment Progress
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Completed</h3>
              <span className="text-green-600 bg-green-100 rounded-full w-8 h-8 flex items-center justify-center">
                <BsCheckCircleFill />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">1/6</p>
            <p className="text-xs text-gray-500 mt-1">Assessments finished</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Average Score</h3>
              <span className="text-blue-600 bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                <BsBarChart />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">85%</p>
            <p className="text-xs text-gray-500 mt-1">Across all assessments</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Skills Identified</h3>
              <span className="text-purple-600 bg-purple-100 rounded-full w-8 h-8 flex items-center justify-center">
                <RiMedalLine />
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-xs text-gray-500 mt-1">Strengths & areas to improve</p>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700">Next Assessment</h3>
              <span className="text-amber-600 bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center">
                <FaRegCalendarAlt />
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800 truncate">Agricultural Best Practices</p>
            <p className="text-xs text-gray-500 mt-1">Recommended for you</p>
          </div>
        </div>
      </motion.div>
      
      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 flex flex-col md:flex-row gap-4 justify-between"
      >
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assessments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Assessments Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map(assessment => (
            <div 
              key={assessment.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden border ${
                assessment.completed ? 'border-green-200' : assessment.locked ? 'border-gray-200' : 'border-green-100'
              }`}
            >
              <div className="h-32 bg-gray-100 relative">
                <img 
                  src={assessment.image} 
                  alt={assessment.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  {assessment.locked ? (
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <FaLock className="text-gray-500 text-lg" />
                    </div>
                  ) : assessment.completed ? (
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <FaCheck className="text-white text-lg" />
                    </div>
                  ) : (
                    <button 
                      onClick={() => startAssessment(assessment)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaPlay className="text-green-600 text-lg ml-1" />
                    </button>
                  )}
                </div>
                {assessment.completed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {assessment.score}%
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">{assessment.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    assessment.difficulty === 'Beginner' 
                      ? 'bg-green-100 text-green-800' 
                      : assessment.difficulty === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                  }`}>
                    {assessment.difficulty}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <MdOutlineQuiz className="mr-1" />
                  <span>{assessment.questions} questions</span>
                  <span className="mx-2">•</span>
                  <RiTimerLine className="mr-1" />
                  <span>{assessment.timeLimit} min</span>
                  <span className="mx-2">•</span>
                  <BsTranslate className="mr-1" />
                  <span>{assessment.language}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assessment.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 w-24">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${assessment.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{assessment.completionRate}%</span>
                  </div>
                  <button 
                    onClick={() => assessment.locked ? null : startAssessment(assessment)}
                    className={`text-sm font-medium flex items-center ${
                      assessment.locked 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-green-600 hover:text-green-800 transition-colors'
                    }`}
                  >
                    {assessment.completed ? 'Retake' : assessment.locked ? 'Locked' : 'Start'} 
                    <BsArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredAssessments.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-3">
              <FaFilter className="text-5xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No assessments found</h3>
            <p className="text-gray-600">Try changing your filters or search term</p>
          </div>
        )}
      </motion.div>
      
      {/* Assessment Modal */}
      {showAssessmentModal && currentAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            {!assessmentCompleted ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">{currentAssessment.title}</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <RiTimerLine className="mr-1" />
                      <span>{formatTime(timeLeft)}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setShowAssessmentModal(false);
                        setTimerActive(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Question */}
                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <span className="text-green-600 font-medium">{currentQuestionIndex + 1}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Question {currentQuestionIndex + 1} of {mockQuestions[currentAssessment.id].length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MdOutlineQuiz className="mr-1" />
                        <span>{currentAssessment.difficulty}</span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                      {mockQuestions[currentAssessment.id][currentQuestionIndex].question}
                    </h4>
                    
                    <div className="space-y-3">
                      {mockQuestions[currentAssessment.id][currentQuestionIndex].options.map((option, index) => (
                        <div 
                          key={index}
                          onClick={() => handleAnswerSelect(mockQuestions[currentAssessment.id][currentQuestionIndex].id, index)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedAnswers[mockQuestions[currentAssessment.id][currentQuestionIndex].id] === index
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-200 hover:bg-green-50/30'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              selectedAnswers[mockQuestions[currentAssessment.id][currentQuestionIndex].id] === index
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswers[mockQuestions[currentAssessment.id][currentQuestionIndex].id] === index && (
                                <FaCheck className="text-white text-xs" />
                              )}
                            </div>
                            <span className="text-gray-800">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => {
                      setShowAssessmentModal(false);
                      setTimerActive(false);
                    }}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[mockQuestions[currentAssessment.id][currentQuestionIndex].id]}
                    className={`px-4 py-2 rounded-lg text-white ${
                      selectedAnswers[mockQuestions[currentAssessment.id][currentQuestionIndex].id]
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestionIndex < mockQuestions[currentAssessment.id].length - 1 ? 'Next Question' : 'Finish'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Assessment Results</h3>
                  <button 
                    onClick={() => setShowAssessmentModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 mb-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium mb-1">Your Score</h4>
                      <p className="text-green-100">
                        {assessmentResult.score >= 90 ? 'Excellent! You\'ve mastered this topic.' :
                         assessmentResult.score >= 80 ? 'Great job! You have a strong understanding.' :
                         assessmentResult.score >= 70 ? 'Good effort! Keep practicing to improve.' :
                         'Keep learning! You\'ll get better with more practice.'}
                      </p>
                    </div>
                    <div className="relative">
                      <svg className="w-24 h-24" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E2E8F0"
                          strokeWidth="3"
                          strokeDasharray="100, 100"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#4ADE80"
                          strokeWidth="3"
                          strokeDasharray={`${assessmentResult.score}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold">{assessmentResult.score}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Assessment Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Questions</span>
                        <span className="text-sm font-medium text-gray-800">{assessmentResult.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Correct Answers</span>
                        <span className="text-sm font-medium text-gray-800">{assessmentResult.correctAnswers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Time Taken</span>
                        <span className="text-sm font-medium text-gray-800">{Math.floor(assessmentResult.timeTaken / 60)}m {assessmentResult.timeTaken % 60}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Difficulty</span>
                        <span className="text-sm font-medium text-gray-800">{currentAssessment.difficulty}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Skill Analysis</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Strengths</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {assessmentResult.strengths.map((strength, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-600">Areas to Improve</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {assessmentResult.weaknesses.map((weakness, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                            >
                              {weakness}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recommended Learning Resources</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-gray-200 flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <MdOutlineSchool className="text-blue-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-800">Introduction to Digital Tools</h5>
                        <p className="text-xs text-gray-500">15 min video course • Hindi</p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        <BsArrowRight />
                      </button>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-gray-200 flex items-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <MdOutlineAssignment className="text-purple-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-800">Computer Security Basics</h5>
                        <p className="text-xs text-gray-500">Interactive tutorial • Hindi</p>
                      </div>
                      <button className="text-purple-600 hover:text-purple-800">
                        <BsArrowRight />
                      </button>
                    </div>
                    
                    <div className="bg-white p-3 rounded border border-gray-200 flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <FaGraduationCap className="text-green-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-800">Hardware Components Explained</h5>
                        <p className="text-xs text-gray-500">Reading material • Hindi</p>
                      </div>
                      <button className="text-green-600 hover:text-green-800">
                        <BsArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setShowAssessmentModal(false)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-green-500 rounded-lg text-green-600 hover:bg-green-50 flex items-center">
                      <FaDownload className="mr-2" />
                      Download Results
                    </button>
                    <button 
                      onClick={() => {
                        setShowAssessmentModal(false);
                        // Here you would typically navigate to learning resources
                      }}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      View Learning Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Recommended Assessments Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <RiMedalLine className="mr-2 text-green-500" /> Recommended for You
        </h2>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-base font-medium text-gray-800 mb-2">
                Complete your skill assessment journey
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your profile and previous assessments, we recommend these assessments to help you identify more skills and learning opportunities.
              </p>
              
              <div className="space-y-3">
                {assessments.filter(a => !a.completed && !a.locked).slice(0, 2).map(assessment => (
                  <div key={assessment.id} className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <MdOutlineQuiz className="text-green-600 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800">{assessment.title}</h4>
                      <p className="text-xs text-gray-500">{assessment.questions} questions • {assessment.timeLimit} min • {assessment.language}</p>
                    </div>
                    <button 
                      onClick={() => startAssessment(assessment)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                    >
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-medium text-gray-800">Your Progress</h3>
                <span className="text-xs text-gray-500">1 of 6 completed</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '16.67%' }}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Beginner</span>
                  <span className="text-xs font-medium text-gray-800">1/2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Intermediate</span>
                  <span className="text-xs font-medium text-gray-800">0/3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Advanced</span>
                  <span className="text-xs font-medium text-gray-800">0/1</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <BsStarFill className="text-green-500 text-xs" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">Complete all assessments</h4>
                    <p className="text-xs text-gray-500">Earn a comprehensive skill certificate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdaptiveAssessmentsTab;