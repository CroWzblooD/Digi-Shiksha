'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaClone,
  FaShare,
  FaDownload,
  FaFileExport,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaRegClock,
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaBook,
  FaExclamationCircle,
  FaClipboardList,
  FaUserGraduate,
  FaCalendarAlt,
  FaLightbulb
} from 'react-icons/fa';
import { 
  BsLightningCharge, 
  BsQuestionCircle, 
  BsGear, 
  BsGrid,
  BsList,
  BsTranslate,
  BsArrowRight,
  BsCheckCircleFill,
  BsThreeDotsVertical,
  BsFileEarmarkText,
  BsCardChecklist,
  BsFileEarmarkRuled
} from 'react-icons/bs';
import { 
  MdOutlineQuiz, 
  MdOutlineAssignment, 
  MdOutlineSchool,
  MdDragIndicator,
  MdOutlineTimer,
  MdOutlineCategory,
  MdOutlineLanguage,
  MdAssessment,
  MdOutlineScience,
  MdOutlineHistory,

  MdOutlineComputer
} from 'react-icons/md';
import { RiMagicLine, RiAiGenerate, RiDragMove2Line, RiTestTubeLine, RiFileList3Line } from 'react-icons/ri';

const ContentGeneratorTab = () => {
  // State for active tool and content creation
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeContentType, setActiveContentType] = useState('quiz');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdContent, setCreatedContent] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // State for AI generation
  const [generationCount, setGenerationCount] = useState("5");
  const [generationType, setGenerationType] = useState("multiple-choice");
const [generationLanguage, setGenerationLanguage] = useState("English");
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  
  // Content form state
  const [contentForm, setContentForm] = useState({
    title: '',
    category: 'Digital Skills',
    language: 'Hindi',
    description: '',
    timeLimit: 30,
    passingScore: 70,
    showResults: true,
    randomizeQuestions: false,
    allowRetake: true,
    dueDate: '',
    totalPoints: 100,
    contentType: 'quiz'
  });
  
  // Questions/items state
  const [questions, setQuestions] = useState([]);
  
  // Sample data
  const categories = [
    'Digital Skills', 
    'Financial Literacy', 
    'Health & Wellness', 
    'Language Learning',
    'Vocational Skills',
    'Life Skills',
    'Mathematics',
    'Science'
  ];
  
  const languages = ['Hindi', 'English', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Gujarati'];
  
  const questionTypes = [
    { id: 'multiple-choice', label: 'Multiple Choice' },
    { id: 'true-false', label: 'True/False' },
    { id: 'short-answer', label: 'Short Answer' },
    { id: 'fill-blank', label: 'Fill in the Blank' },
    { id: 'matching', label: 'Matching' }
  ];
  
  // Recent content
  const recentContent = [
    {
      id: 1,
      title: 'Digital Literacy Basics',
      type: 'quiz',
      category: 'Digital Skills',
      questions: 10,
      createdAt: '2023-10-15',
      icon: <MdOutlineQuiz className="text-green-500" />
    },
    {
      id: 2,
      title: 'Financial Planning Assessment',
      type: 'assessment',
      category: 'Financial Literacy',
      questions: 15,
      createdAt: '2023-10-12',
      icon: <MdAssessment className="text-blue-500" />
    },
    {
      id: 3,
      title: 'Health Awareness Test',
      type: 'test',
      category: 'Health & Wellness',
      questions: 20,
      createdAt: '2023-10-10',
      icon: <RiTestTubeLine className="text-red-500" />
    },
    {
      id: 4,
      title: 'English Vocabulary Assignment',
      type: 'assignment',
      category: 'Language Learning',
      questions: 8,
      createdAt: '2023-10-08',
      icon: <MdOutlineAssignment className="text-purple-500" />
    }
  ];
  
  // Templates
  const templates = [
    {
      id: 1,
      title: 'Digital Skills Assessment',
      type: 'assessment',
      category: 'Digital Skills',
      questions: 15,
      icon: <MdOutlineComputer className="text-2xl text-blue-500" />
    },
    {
      id: 2,
      title: 'Financial Literacy Quiz',
      type: 'quiz',
      category: 'Financial Literacy',
      questions: 10,
      icon: <FaBook className="text-2xl text-green-500" />
    },
    {
      id: 3,
      title: 'Health Knowledge Test',
      type: 'test',
      category: 'Health & Wellness',
      questions: 20,
      icon: <MdOutlineScience className="text-2xl text-red-500" />
    },
    {
      id: 4,
      title: 'Language Practice Assignment',
      type: 'assignment',
      category: 'Language Learning',
      questions: 8,
      icon: <BsFileEarmarkText className="text-2xl text-purple-500" />
    },
    {
      id: 5,
      title: 'Math Skills Quiz',
      type: 'quiz',
      category: 'Mathematics',
      questions: 12,
      icon: <MdAssessment className="text-2xl text-yellow-500" />
    },
    {
      id: 6,
      title: 'History Timeline Test',
      type: 'test',
      category: 'History',
      questions: 15,
      icon: <MdOutlineHistory className="text-2xl text-amber-500" />
    }
  ];
  
  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContentForm({
      ...contentForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Add a new question/item
  const addQuestion = (type = 'multiple-choice') => {
    const newQuestion = {
      id: questions.length + 1,
      text: '',
      type: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : 
              type === 'true-false' ? ['True', 'False'] : [],
      correctAnswer: type === 'true-false' ? 0 : null,
      points: 10,
      difficulty: 'medium'
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  // Update a question/item
  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };
  
  // Delete a question/item
  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const generateQuestions = async () => {
    if (!generationPrompt || isGenerating) return;
  
    setIsGenerating(true);
  
    try {
      const requestBody = {
        action: 'generate-quiz',
        prompt: generationPrompt,
        category: contentForm.category,
        language: generationLanguage,
        questionCount: parseInt(generationCount),
        questionType: generationType
      };
  
      // Log the data being sent to the backend
      console.log('Sending request to backend:', requestBody);
  
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
  
      // Log the response from the backend
      console.log('Received response from backend:', data);
  
      if (data.success && data.questions) {
        const formattedQuestions = data.questions.map(q => ({
          id: Math.random().toString(36).substr(2, 9),
          text: q.question,
          type: q.options.length > 2 ? 'multiple-choice' : 'true-false',
          options: q.options,
          correctAnswer: q.correctAnswerIndex,
          difficulty: q.difficulty || 'medium',
          points: q.points || 10
        }));
  
        setGeneratedQuestions(formattedQuestions);
  
        setNotification({
          show: true,
          type: 'success',
          message: `Successfully generated ${formattedQuestions.length} questions!`
        });
  
        setTimeout(() => {
          setNotification({ show: false, type: '', message: '' });
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
  
      setNotification({
        show: true,
        type: 'error',
        message: `Error: ${error.message || 'Failed to generate questions'}`
      });
  
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 3000);
    } finally {
      setIsGenerating(false);
    }
  };
  
  
  // Add generated questions to the content
  const addGeneratedQuestions = () => {
    setQuestions([...questions, ...generatedQuestions]);
    setGeneratedQuestions([]);
  };
  
  // Handle content submission
  const handleSubmit = () => {
    if (!contentForm.title || questions.length === 0) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const createdContentData = {
        id: Math.floor(Math.random() * 10000),
        title: contentForm.title,
        questions: questions.length,
        category: contentForm.category,
        language: contentForm.language,
        timeLimit: contentForm.timeLimit,
        passingScore: contentForm.passingScore,
        type: activeContentType
      };
      
      setCreatedContent(createdContentData);
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1500);
  };
  
  // Reset form after content creation
  const resetForm = () => {
    setContentForm({
      title: '',
      category: 'Digital Skills',
      language: 'Hindi',
      description: '',
      timeLimit: 30,
      passingScore: 70,
      showResults: true,
      randomizeQuestions: false,
      allowRetake: true,
      dueDate: '',
      totalPoints: 100,
      contentType: activeContentType
    });
    setQuestions([]);
    setCreatedContent(null);
  };

  
  
  // Get content type icon
  const getContentTypeIcon = (type) => {
    switch(type) {
      case 'quiz':
        return <MdOutlineQuiz className="text-xl" />;
      case 'test':
        return <RiTestTubeLine className="text-xl" />;
      case 'assessment':
        return <MdAssessment className="text-xl" />;
      case 'assignment':
        return <MdOutlineAssignment className="text-xl" />;
      default:
        return <BsQuestionCircle className="text-xl" />;
    }
  };
  
  // Get content type color
  const getContentTypeColor = (type) => {
    switch(type) {
      case 'quiz':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'test':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'assessment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assignment':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get content type title
  const getContentTypeTitle = (type) => {
    switch(type) {
      case 'quiz':
        return 'Quiz Generator';
      case 'test':
        return 'Test Generator';
      case 'assessment':
        return 'Assessment Generator';
      case 'assignment':
        return 'Assignment Generator';
      default:
        return 'Content Generator';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaChalkboardTeacher className="mr-2 text-green-500 text-3xl" />
        Educational Content Generator
      </h1>
      
      {/* Main Tabs */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'dashboard' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <BsGrid className="mr-2" />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'create' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <FaPlus className="mr-2" />
              Create Content
            </div>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'manage' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
                      <div className="flex items-center justify-center">
              <BsGear className="mr-2" />
              Manage Content
            </div>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'templates' 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <BsFileEarmarkText className="mr-2" />
              Templates
            </div>
          </button>
        </div>
        
        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MdOutlineQuiz className="text-green-600 text-2xl" />
                  </div>
                  <span className="text-3xl font-bold text-green-600">12</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Quizzes</h3>
                <p className="text-sm text-gray-500">Total quizzes created</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MdAssessment className="text-blue-600 text-2xl" />
                  </div>
                  <span className="text-3xl font-bold text-blue-600">8</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Assessments</h3>
                <p className="text-sm text-gray-500">Total assessments created</p>
              </div>
              
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <RiTestTubeLine className="text-red-600 text-2xl" />
                  </div>
                  <span className="text-3xl font-bold text-red-600">5</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Tests</h3>
                <p className="text-sm text-gray-500">Total tests created</p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MdOutlineAssignment className="text-purple-600 text-2xl" />
                  </div>
                  <span className="text-3xl font-bold text-purple-600">7</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Assignments</h3>
                <p className="text-sm text-gray-500">Total assignments created</p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Content</h2>
                <button className="text-sm text-green-600 hover:text-green-800 flex items-center">
                  View All <BsArrowRight className="ml-1" />
                </button>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Questions
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentContent.map((content) => (
                        <tr key={content.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                                {content.icon}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{content.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getContentTypeColor(content.type)}`}>
                              {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.questions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {content.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <FaEdit />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <FaClone />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setActiveContentType('quiz');
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-300 hover:shadow-sm transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <MdOutlineQuiz className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Create Quiz</h3>
                  <p className="text-xs text-gray-500">Create interactive quizzes</p>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setActiveContentType('assessment');
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <MdAssessment className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Create Assessment</h3>
                  <p className="text-xs text-gray-500">Create comprehensive assessments</p>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setActiveContentType('test');
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-red-300 hover:shadow-sm transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                    <RiTestTubeLine className="text-red-600 text-2xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Create Test</h3>
                  <p className="text-xs text-gray-500">Create standardized tests</p>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('create');
                    setActiveContentType('assignment');
                  }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-purple-300 hover:shadow-sm transition-all flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <MdOutlineAssignment className="text-purple-600 text-2xl" />
                  </div>
                  <h3 className="text-base font-medium text-gray-800 mb-1">Create Assignment</h3>
                  <p className="text-xs text-gray-500">Create engaging assignments</p>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Create Content Tab */}
        {activeTab === 'create' && (
          <div className="p-6">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                {getContentTypeIcon(activeContentType)}
                <span className="ml-2">{getContentTypeTitle(activeContentType)}</span>
              </h2>
              
              <div className="ml-auto flex space-x-2">
                <select
                  value={activeContentType}
                  onChange={(e) => setActiveContentType(e.target.value)}
                  className="px-3 text-black py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  <option value="quiz">Quiz</option>
                  <option value="test">Test</option>
                  <option value="assessment">Assessment</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
            </div>
            
            {/* Content Creation Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 text-black gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={contentForm.title}
                      onChange={handleFormChange}
                      placeholder={`Enter ${activeContentType} title`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={contentForm.description}
                      onChange={handleFormChange}
                      placeholder={`Enter ${activeContentType} description`}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        name="category"
                        value={contentForm.category}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        name="language"
                        value={contentForm.language}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {activeContentType === 'quiz' || activeContentType === 'test' || activeContentType === 'assessment' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Time Limit (minutes)
                        </label>
                        <input
                          type="number"
                          name="timeLimit"
                          value={contentForm.timeLimit}
                          onChange={handleFormChange}
                          min="1"
                          max="180"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Passing Score (%)
                        </label>
                        <input
                          type="number"
                          name="passingScore"
                          value={contentForm.passingScore}
                          onChange={handleFormChange}
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={contentForm.dueDate}
                          onChange={handleFormChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total Points
                        </label>
                        <input
                          type="number"
                          name="totalPoints"
                          value={contentForm.totalPoints}
                          onChange={handleFormChange}
                          min="1"
                          max="1000"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Questions/Items Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {activeContentType === 'assignment' ? 'Tasks' : 'Questions'} ({questions.length})
                    </h3>
                    <button 
                      onClick={() => addQuestion()}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <FaPlus className="mr-2" /> 
                      Add {activeContentType === 'assignment' ? 'Task' : 'Question'}
                    </button>
                  </div>
                  
                  {questions.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="text-gray-400 mb-3">
                        <BsQuestionCircle className="text-5xl mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-1">
                        No {activeContentType === 'assignment' ? 'tasks' : 'questions'} yet
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Add {activeContentType === 'assignment' ? 'tasks' : 'questions'} manually or generate them with AI
                      </p>
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={() => addQuestion()}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
                        >
                          <FaPlus className="mr-2" /> 
                          Add {activeContentType === 'assignment' ? 'Task' : 'Question'}
                        </button>
                        <button 
                          onClick={() => document.getElementById('ai-generator').scrollIntoView({ behavior: 'smooth' })}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
                        >
                          <RiAiGenerate className="mr-2" /> Use AI Generator
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div 
                          key={question.id} 
                          className="border border-gray-200 rounded-lg p-4 hover:border-green-200 transition-colors"
                        >
                          <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-1">
                              <span className="text-green-600 text-xs font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="mb-2">
                                <input
                                  type="text"
                                  value={question.text}
                                  onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                  placeholder={`Enter ${activeContentType === 'assignment' ? 'task' : 'question'} text`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                              </div>
                              
                              {question.type === 'multiple-choice' && (
                                <div className="space-y-2 mb-3">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <div 
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 cursor-pointer ${
                                          question.correctAnswer === optIndex
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-300'
                                        }`}
                                        onClick={() => updateQuestion(question.id, 'correctAnswer', optIndex)}
                                      >
                                        {question.correctAnswer === optIndex && (
                                          <FaCheck className="text-white text-xs" />
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...question.options];
                                          newOptions[optIndex] = e.target.value;
                                          updateQuestion(question.id, 'options', newOptions);
                                        }}
                                        placeholder={`Option ${optIndex + 1}`}
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(question.id, 'type', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                >
                                  {questionTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.label}</option>
                                  ))}
                                </select>
                                
                                <select
                                  value={question.difficulty}
                                  onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                >
                                  <option value="easy">Easy</option>
                                  <option value="medium">Medium</option>
                                  <option value="hard">Hard</option>
                                </select>
                                
                                <div className="flex items-center">
                                  <span className="text-gray-600 mr-1">Points:</span>
                                  <input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                                    min="1"
                                    max="100"
                                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center"
                                  />
                                </div>
                                
                                <div className="ml-auto flex space-x-2">
                                  <button 
                                    onClick={() => deleteQuestion(question.id)}
                                    className="p-1 text-red-500 hover:text-red-700"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>


{/* AI Generator Section */}
<div id="ai-generator" className="bg-white rounded-xl text-black shadow-sm p-6 mb-6 border-2 border-purple-100">
  <div className="flex items-center mb-4">
    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
      <RiAiGenerate className="text-purple-600 text-xl" />
    </div>
    <h3 className="text-lg text-black font-semibold text-gray-800">AI Content Generator</h3>
  </div>
  
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      What would you like to generate?
    </label>
    <textarea
      value={generationPrompt}
      onChange={(e) => setGenerationPrompt(e.target.value)}
      placeholder={`Describe the ${activeContentType === 'assignment' ? 'tasks' : 'questions'} you want to generate. For example: "Generate 5 multiple choice questions about digital literacy for beginners."`}
      rows="3"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
    ></textarea>
  </div>
  
  <div className="flex items-center text-black justify-between mb-4">
    <div className="flex items-center space-x-4">
      <select
        value={generationCount}
        onChange={(e) => setGenerationCount(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      >
        <option value="5">Generate 5 items</option>
        <option value="10">Generate 10 items</option>
        <option value="15">Generate 15 items</option>
      </select>
      
      <select
        value={generationType}
        onChange={(e) => setGenerationType(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      >
        <option value="multiple-choice">Multiple Choice</option>
        <option value="true-false">True/False</option>
        <option value="mixed">Mixed Types</option>
      </select>
      
      <select
        value={generationLanguage}
        onChange={(e) => setGenerationLanguage(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
      >
        <option value="English">English</option>
        <option value="Gujrati">Gujrati</option>
        <option value="Kannada">Kannada</option>
        <option value="Telugu">telugu</option>
        <option value="Tamil">tamil</option>
        <option value="Bengali">Bengali</option>
        <option value="Hindi">Hindi</option>
      </select>
    </div>
  </div>
  
  <button 
    onClick={generateQuestions}
    disabled={!generationPrompt || isGenerating}
    className={`w-full px-4 py-2 rounded-lg text-white flex items-center justify-center ${
      !generationPrompt || isGenerating
        ? 'bg-purple-300 cursor-not-allowed'
        : 'bg-purple-500 hover:bg-purple-600'
    }`}
  >
    {isGenerating ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Generating Content...
      </>
    ) : (
      <>
        <RiMagicLine className="mr-2" /> Generate with AI
      </>
    )}
  </button>
</div>
                
                                {/* Generated Content */}
                                {generatedQuestions.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-2 border-purple-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={addGeneratedQuestions}
                          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center"
                        >
                          <FaPlus className="mr-2" /> Add All
                        </button>
                        <button 
                          onClick={() => setGeneratedQuestions([])}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center"
                        >
                          <FaTrash className="mr-2" /> Discard
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {generatedQuestions.map((question, index) => (
                        <div 
                          key={index} 
                          className="border border-purple-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                        >
                          <div className="flex items-start">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2 mt-1">
                              <span className="text-purple-600 text-xs font-medium">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2">{question.text}</p>
                              
                              {question.type === 'multiple-choice' && (
                                <div className="space-y-1 mb-2">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center">
                                      <div 
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center mr-2 ${
                                          question.correctAnswer === optIndex
                                            ? 'border-purple-500 bg-purple-500'
                                            : 'border-gray-300'
                                        }`}
                                      >
                                        {question.correctAnswer === optIndex && (
                                          <FaCheck className="text-white text-xs" />
                                        )}
                                      </div>
                                      <span className="text-sm text-gray-700">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                  {question.type === 'multiple-choice' ? 'Multiple Choice' : question.type}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  {question.difficulty}
                                </span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                  {question.points} points
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !contentForm.title || questions.length === 0}
                    className={`px-6 py-3 rounded-lg text-white font-medium flex items-center ${
                      isSubmitting || !contentForm.title || questions.length === 0
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" /> Create {activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)}
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Right Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      {contentForm.title || `Untitled ${activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)}`}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span className="flex items-center mr-3">
                        <MdOutlineCategory className="mr-1" /> {contentForm.category}
                      </span>
                      <span className="flex items-center mr-3">
                        <MdOutlineLanguage className="mr-1" /> {contentForm.language}
                      </span>
                      {(activeContentType === 'quiz' || activeContentType === 'test' || activeContentType === 'assessment') && (
                        <span className="flex items-center">
                          <MdOutlineTimer className="mr-1" /> {contentForm.timeLimit} min
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {contentForm.description || 'No description provided.'}
                    </p>
                    <div className="text-xs text-gray-500">
                      {questions.length} {activeContentType === 'assignment' ? 'tasks' : 'questions'}
                      {(activeContentType === 'quiz' || activeContentType === 'test' || activeContentType === 'assessment') && ` • ${contentForm.passingScore}% passing score`}
                      {contentForm.randomizeQuestions && ' • Questions randomized'}
                      {contentForm.showResults && ' • Immediate results'}
                      {contentForm.allowRetake && ' • Retakes allowed'}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaRegClock className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Time Limit</span>
                      </div>
                      <span className="text-sm font-medium">{contentForm.timeLimit} minutes</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaCheck className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Passing Score</span>
                      </div>
                      <span className="text-sm font-medium">{contentForm.passingScore}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaEye className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Show Results</span>
                      </div>
                      <span className={`text-sm font-medium ${contentForm.showResults ? 'text-green-600' : 'text-red-600'}`}>
                        {contentForm.showResults ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <RiDragMove2Line className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Randomize</span>
                      </div>
                      <span className={`text-sm font-medium ${contentForm.randomizeQuestions ? 'text-green-600' : 'text-red-600'}`}>
                        {contentForm.randomizeQuestions ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FaRegClock className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700">Allow Retake</span>
                      </div>
                      <span className={`text-sm font-medium ${contentForm.allowRetake ? 'text-green-600' : 'text-red-600'}`}>
                        {contentForm.allowRetake ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-1">
                        <FaLightbulb className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1">Clear Instructions</h4>
                        <p className="text-xs text-gray-600">
                          Provide clear instructions to help learners understand what is expected.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-1">
                        <FaLightbulb className="text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1">Varied Question Types</h4>
                        <p className="text-xs text-gray-600">
                          Use different question types to assess various skills and knowledge.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-1">
                        <FaLightbulb className="text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1">Use AI Generator</h4>
                        <p className="text-xs text-gray-600">
                          Save time by using the AI generator to create questions based on your topic.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Manage Content Tab */}
        {activeTab === 'manage' && (
          <div className="p-6 text-black">
            <div className="flex items-center text-black justify-between mb-6">
              <h2 className="text-xl text-black font-semibold text-gray-800">Manage Content</h2>
              <div className="flex text-black space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search content..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <select className="px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="all">All Types</option>
                  <option value="quiz">Quizzes</option>
                  <option value="test">Tests</option>
                  <option value="assessment">Assessments</option>
                  <option value="assignment">Assignments</option>
                </select>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Questions
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentContent.map((content) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {content.icon}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{content.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getContentTypeColor(content.type)}`}>
                            {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {content.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {content.questions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {content.createdAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-800">
                              <FaEdit />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <FaClone />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Templates</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search templates..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  <option value="all">All Types</option>
                  <option value="quiz">Quizzes</option>
                  <option value="test">Tests</option>
                  <option value="assessment">Assessments</option>
                  <option value="assignment">Assignments</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{template.title}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getContentTypeColor(template.type)}`}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {template.questions} questions
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      A template for {template.category.toLowerCase()} {template.type}s with pre-defined questions and settings.
                    </p>
                    <div className="flex justify-between">
                      <button 
                        onClick={() => {
                          setActiveTab('create');
                          setActiveContentType(template.type);
                          // Here you would load the template data
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center text-sm"
                      >
                        <FaPlus className="mr-2" /> Use Template
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                        <BsThreeDotsVertical />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    
{notification.show && (
  <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`}>
    <div className="flex items-center">
      {notification.type === 'success' ? (
        <BsCheckCircleFill className="mr-2" />
      ) : (
        <FaExclamationCircle className="mr-2" />
      )}
      <span>{notification.message}</span>
    </div>
  </div>
)}
      
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsCheckCircleFill className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {activeContentType.charAt(0).toUpperCase() + activeContentType.slice(1)} Created Successfully!
              </h3>
              <p className="text-gray-600">
                Your {activeContentType} has been created and is ready to use.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {getContentTypeIcon(activeContentType)}
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-800">{createdContent?.title}</h4>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">{createdContent?.questions} questions</span>
                    <span className="mr-2">•</span>
                    <span>{createdContent?.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            
            <div className="flex space-x-3">
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Create Another
              </button>
              <button 
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab('manage');
                }}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                View All Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default ContentGeneratorTab;