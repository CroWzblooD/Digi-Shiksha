'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaMicrophone, 
  FaImage, 
  FaVolumeUp, 
  FaWhatsapp, 
  FaSms, 
  FaPhone, 
  FaBook, 
  FaGraduationCap,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaRobot,
  FaUpload,
  FaSpinner,
  FaCheck,
  FaRegLightbulb,
  FaRegCommentDots,
  FaRegFileAlt,
  FaRegClock
} from 'react-icons/fa';
import { MdTranslate, MdQuiz, MdChildCare, MdWorkOutline, MdOutlineSchool } from 'react-icons/md';
import { BsStars, BsChatDots, BsArrowRight, BsCalendarCheck } from 'react-icons/bs';
import { RiParentLine, RiVoiceprintFill } from 'react-icons/ri';

const AIXplainTab = () => {
  // State for active feature
  const [activeFeature, setActiveFeature] = useState('ncert');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedClass, setSelectedClass] = useState('Class 8');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  
  // Languages available
  const languages = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia'];
  
  // Subjects available
  const subjects = ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Sanskrit'];
  
  // Classes available
  const classes = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  
  // Features data
  const features = [
    {
      id: 'ncert',
      title: 'NCERT Answer Bot',
      icon: <FaBook className="text-green-600" />,
      description: 'Upload a textbook page or question for instant voice explanations in your language'
    },
    {
      id: 'voice-test',
      title: 'AI-Graded Voice Tests',
      icon: <RiVoiceprintFill className="text-green-600" />,
      description: 'Practice tests with verbal answers and get instant feedback'
    },
    {
      id: 'simplifier',
      title: 'Teach Me Like I\'m 10',
      icon: <MdChildCare className="text-green-600" />,
      description: 'Convert complex concepts into simple, relatable explanations'
    },
    {
      id: 'skill-builder',
      title: 'Daily Skill Builder',
      icon: <MdWorkOutline className="text-green-600" />,
      description: 'Short lessons combining academic topics with practical job skills'
    },
    {
      id: 'parent-chat',
      title: 'AI-Parent Teacher Chat',
      icon: <RiParentLine className="text-green-600" />,
      description: 'Voice-based progress updates and recommendations for parents'
    }
  ];
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        setUploadedImage(URL.createObjectURL(file));
        setIsUploading(false);
      }, 1500);
    }
  };
  
  // Trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };
  
  // Start voice recording
  const startRecording = () => {
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 3000);
  };
  
  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaRobot className="mr-2 text-green-500 text-3xl" />
          AIXplain Learning Assistant
        </h1>
        <p className="text-gray-600 mt-1">
          Personalized educational support in your language, anytime, anywhere
        </p>
      </motion.div>
      
      {/* Features Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-green-100 overflow-x-auto"
      >
        <div className="flex space-x-2 min-w-max">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-4 py-3 rounded-lg transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeFeature === feature.id
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'bg-green-50 text-gray-700 hover:bg-green-100'
              }`}
            >
              <span>{feature.icon}</span>
              <span className="font-medium">{feature.title}</span>
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Main Content Area */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden"
      >
        {/* NCERT Answer Bot */}
        {activeFeature === 'ncert' && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaBook className="text-2xl text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">NCERT Answer Bot</h2>
                <p className="text-gray-600">Upload a textbook page or ask a question to get instant explanations</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaRegLightbulb className="text-green-500 mr-2" /> How it works
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Upload a photo of your NCERT textbook page or handwritten question</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Select your preferred language for the explanation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Get voice explanations and step-by-step solutions instantly</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Upload Question</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>5 minutes (5 questions)</option>
                        <option>10 minutes (10 questions)</option>
                        <option>15 minutes (15 questions)</option>
                        <option>20 minutes (20 questions)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <MdQuiz className="mr-2" /> Start Voice Test
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                {isUploading ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col items-center justify-center">
                    <FaSpinner className="text-green-500 text-3xl animate-spin mb-3" />
                    <p className="text-gray-600">Processing your image...</p>
                  </div>
                ) : uploadedImage ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col">
                    <h3 className="font-medium text-gray-800 mb-3">Your Question</h3>
                    <div className="relative mb-4 flex-shrink-0">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded question" 
                        className="w-full h-48 object-contain border border-gray-200 rounded-lg"
                      />
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex-grow">
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FaRobot className="text-green-500 mr-2" /> AIXplain Answer
                      </h3>
                      <p className="text-gray-700 mb-3">
                        To find the value of x in the equation 2x + 5 = 15, we need to isolate x by following these steps:
                      </p>
                      <ol className="space-y-1 text-gray-700 mb-4 pl-5 list-decimal">
                        <li>Subtract 5 from both sides: 2x + 5 - 5 = 15 - 5</li>
                        <li>Simplify: 2x = 10</li>
                        <li>Divide both sides by 2: 2x ÷ 2 = 10 ÷ 2</li>
                        <li>Therefore: x = 5</li>
                      </ol>
                    <div className="flex items-center mt-3 space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <FaVolumeUp />
                      <span>Listen in {selectedLanguage}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                      <FaWhatsapp className="text-green-600" />
                      <span>Send to WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 h-full flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <FaUpload className="text-green-500 text-3xl" />
                </div>
                <h3 className="font-medium text-gray-800 mb-1">Upload a Question</h3>
                <p className="text-gray-500 text-center mb-4">Take a photo of your textbook or handwritten question</p>
                <button
                  onClick={triggerFileUpload}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <FaImage className="mr-2" /> Select Image
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FaCheck className="text-green-500 text-3xl" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-center text-gray-800 mb-2">Success!</h3>
              <p className="text-center text-gray-600 mb-4">
                Your question has been processed. The answer is ready.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                View Answer
              </button>
            </div>
          </div>
        )}
      </div>
    )}
    
    {/* AI-Graded Voice Tests */}
    {activeFeature === 'voice-test' && (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <RiVoiceprintFill className="text-2xl text-green-500 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI-Graded Voice Tests</h2>
            <p className="text-gray-600">Practice tests with verbal answers and get instant feedback</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <FaRegLightbulb className="text-green-500 mr-2" /> How it works
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Select your subject and class</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Answer questions verbally in your preferred language</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Get instant scores and personalized revision plans</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-3">Start a Voice Test</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Class</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Duration</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option>5 minutes (5 questions)</option>
                    <option>10 minutes (10 questions)</option>
                    <option>15 minutes (15 questions)</option>
                    <option>20 minutes (20 questions)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <MdQuiz className="mr-2" /> Start Voice Test
                </button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-800 mb-3">Recent Test Results</h3>
            
            <div className="space-y-3">
              <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">Science - Class 8</h4>
                    <p className="text-xs text-gray-500">Completed on May 15, 2023</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">85%</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Strong in: Plant Biology, Light</p>
                  <p className="text-sm text-gray-600">Needs work: Chemical Reactions</p>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">Mathematics - Class 8</h4>
                    <p className="text-xs text-gray-500">Completed on May 10, 2023</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">72%</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Strong in: Algebra, Geometry</p>
                  <p className="text-sm text-gray-600">Needs work: Fractions, Percentages</p>
                </div>
              </div>
              
              <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">Social Studies - Class 8</h4>
                    <p className="text-xs text-gray-500">Completed on May 5, 2023</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-sm font-medium px-2.5 py-0.5 rounded-full">90%</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">Strong in: Indian History, Geography</p>
                  <p className="text-sm text-gray-600">Needs work: World History</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center">
                <FaRegFileAlt className="mr-2" /> View All Test Results
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Teach Me Like I'm 10 */}
    {activeFeature === 'simplifier' && (
      <div className="p-6">
        <div className="flex items-center mb-4">
          <MdChildCare className="text-2xl text-green-500 mr-3" />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Teach Me Like I'm 10</h2>
            <p className="text-gray-600">Convert complex concepts into simple, relatable explanations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                <FaRegLightbulb className="text-green-500 mr-2" /> How it works
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                  <span>Upload a complex textbook page or concept</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                  <span>Our AI converts it into simple language with rural life examples</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                  <span>Get voice or text explanations in your regional language</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-800 mb-3">Upload Complex Concept</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Topic</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option>Climate Change</option>
                    <option>Photosynthesis</option>
                    <option>Gravity and Motion</option>
                    <option>Democracy and Government</option>
                    <option>Electricity and Circuits</option>
                        <option>Economic Systems</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Simplification Level</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>Very Simple (Age 8-10)</option>
                        <option>Simple (Age 11-13)</option>
                        <option>Moderate (Age 14-16)</option>
                      </select>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={triggerFileUpload}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <FaImage />
                          <span>Upload Image</span>
                        </button>
                        
                        <button
                          onClick={startRecording}
                          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            isRecording 
                              ? 'bg-red-500 text-white animate-pulse' 
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <FaMicrophone />
                          <span>{isRecording ? 'Recording...' : 'Voice Input'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-800 mb-3">Simplified Explanation</h3>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">Climate Change</h4>
                  
                  <div className="mb-4 pb-4 border-b border-green-100">
                    <p className="text-sm text-gray-500 mb-1">Original Complex Concept:</p>
                    <p className="text-gray-700">
                      Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels like coal, oil, and gas, which produces heat-trapping gases.
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Simplified Explanation:</p>
                    <p className="text-gray-700 mb-3">
                      Climate change is like when your village pond gets smaller every summer. But now, it's happening faster than before.
                    </p>
                    <p className="text-gray-700 mb-3">
                      Think of it this way: When you burn wood for cooking, it makes smoke. Big factories and cars make a special kind of smoke that creates a blanket around Earth. This blanket traps heat, just like how your woolen shawl keeps you warm in winter.
                    </p>
                    <p className="text-gray-700">
                      Because of this blanket, our Earth is getting warmer. That's why some years you might notice less rain for your crops, or sometimes too much rain causing floods.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <FaVolumeUp />
                    <span>Listen in {selectedLanguage}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                    <FaWhatsapp className="text-green-600" />
                    <span>Share via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Daily Skill Builder */}
        {activeFeature === 'skill-builder' && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <MdWorkOutline className="text-2xl text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Daily Skill Builder</h2>
                <p className="text-gray-600">Short lessons combining academic topics with practical job skills</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaRegLightbulb className="text-green-500 mr-2" /> How it works
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Get daily 5-minute lessons that combine academic topics with job skills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>Learn through voice lessons in your regional language</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Practice with real-world examples relevant to rural life</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Your Preferences</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Career Interest</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>Agriculture</option>
                        <option>Small Business</option>
                        <option>Healthcare</option>
                        <option>Technology</option>
                        <option>Education</option>
                        <option>Skilled Trade</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Focus</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="whatsapp" 
                            name="delivery" 
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            defaultChecked 
                          />
                          <label htmlFor="whatsapp" className="ml-2 block text-sm text-gray-700">
                            WhatsApp
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="sms" 
                            name="delivery" 
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" 
                          />
                          <label htmlFor="sms" className="ml-2 block text-sm text-gray-700">
                            SMS
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="missedcall" 
                            name="delivery" 
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" 
                          />
                          <label htmlFor="missedcall" className="ml-2 block text-sm text-gray-700">
                            Missed Call (Voice)
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center"
                    >
                      <BsCalendarCheck className="mr-2" /> Schedule Daily Lessons
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-800">Today's Skill Builder</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">New</span>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">Mathematics + Agriculture</h4>
                      <span className="text-xs text-gray-500">5 min lesson</span>
                    </div>
                    
                    <p className="text-gray-700 mb-3">
                      <span className="font-medium">Today's Topic:</span> Calculating Fertilizer Ratios for Your Farm
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Math Concept:</p>
                        <p className="text-sm text-gray-600">
                          Learn how to calculate ratios and proportions to determine the right amount of fertilizer for different crop areas.
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">Practical Skill:</p>
                        <p className="text-sm text-gray-600">
                          Write a professional WhatsApp message to a seed supplier to inquire about prices and availability.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <FaVolumeUp />
                        <span>Listen in {selectedLanguage}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                        <FaRegClock />
                        <span>Schedule for Later</span>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-800 mb-3">Upcoming Lessons</h3>
                  
                  <div className="space-y-3">
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">Science + Healthcare</h4>

                          <p className="text-xs text-gray-500">Tomorrow - 5 min lesson</p>
                          
                        </div>
                        <p className="text-sm text-gray-600">
                          Learn about the human body's immune system and basic first aid techniques for rural settings.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">English + Small Business</h4>
                          <p className="text-xs text-gray-500">Day after tomorrow - 5 min lesson</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Practice writing product descriptions and learn basic marketing vocabulary for your local business.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">Social Studies + Technology</h4>
                          <p className="text-xs text-gray-500">In 3 days - 5 min lesson</p>
                        </div>
                        <p className="text-sm text-gray-600">
                          Learn about digital government services and how to access agricultural subsidies online.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Your Skill Progress</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Mathematics Skills</span>
                        <span className="text-xs text-gray-500">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Agricultural Knowledge</span>
                        <span className="text-xs text-gray-500">90%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Digital Communication</span>
                        <span className="text-xs text-gray-500">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Financial Literacy</span>
                        <span className="text-xs text-gray-500">45%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* AI-Parent Teacher Chat */}
        {activeFeature === 'parent-chat' && (
          <div className="p-6">
            <div className="flex items-center mb-4">
              <RiParentLine className="text-2xl text-green-500 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">AI-Parent Teacher Chat</h2>
                <p className="text-gray-600">Voice-based progress updates and recommendations for parents</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                    <FaRegLightbulb className="text-green-500 mr-2" /> How it works
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      <span>Parents send a voice note asking about their child's progress</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      <span>AI analyzes the student's test history and performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-200 text-green-800 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      <span>Parents receive personalized voice responses with recommendations</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-medium text-gray-800 mb-3">Ask About Your Child</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                      <input
                        type="text"
                        placeholder="Enter student name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class/Grade</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                      >
                        {classes.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option>How is my child performing overall?</option>
                        <option>Which subjects need improvement?</option>
                        <option>What skills has my child mastered recently?</option>
                        <option>How can I help my child at home?</option>
                        <option>Is my child attending all classes?</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                      >
                        {languages.map(language => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        onClick={startRecording}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg transition-colors ${
                          isRecording 
                            ? 'bg-red-500 text-white animate-pulse' 
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        <FaMicrophone />
                        <span>{isRecording ? 'Recording...' : 'Record Voice Question'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium text-gray-800 mb-3">Student Progress Report</h3>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FaGraduationCap className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Rohit Kumar</h4>
                      <p className="text-xs text-gray-500">Class 8 - Section B</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Mathematics</span>
                        <span className="text-xs text-gray-500">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Science</span>
                        <span className="text-xs text-gray-500">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">English</span>
                        <span className="text-xs text-gray-500">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Social Studies</span>
                        <span className="text-xs text-gray-500">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-green-100 pt-3">
                    <h5 className="font-medium text-gray-800 mb-2">AI Teacher Feedback:</h5>
                    <p className="text-gray-700 mb-3">
                      Rohit is performing well in Science and Mathematics. His understanding of concepts is strong, but he needs to work on his problem-solving speed. In English, his reading comprehension is excellent, but he needs more practice with writing essays.
                    </p>
                    <p className="text-gray-700">
                      For Social Studies, I recommend using our "Teach Me Like I'm 10" feature to simplify complex historical concepts. The free government tutor at the community center on Tuesdays and Thursdays could also help.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <FaVolumeUp />
                    <span>Listen in {selectedLanguage}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors">
                    <FaWhatsapp className="text-green-600" />
                    <span>Share via WhatsApp</span>
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">Local Resources</h3>
                  
                  <div className="space-y-3">
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <h4 className="font-medium text-gray-800">Free Government Tutoring</h4>
                      <p className="text-sm text-gray-600">
                        Available at Community Center on Tuesdays and Thursdays (4-6 PM)
                        </p>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <h4 className="font-medium text-gray-800">District Library</h4>
                      <p className="text-sm text-gray-600">
                        Open daily 9 AM - 6 PM, offers free textbooks and study materials
                      </p>
                    </div>
                    
                    <div className="border border-gray-100 rounded-lg p-3 hover:bg-green-50 transition-colors">
                      <h4 className="font-medium text-gray-800">Digital Learning Center</h4>
                      <p className="text-sm text-gray-600">
                        Free computer access and internet for students on weekends
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      {/* Success Message Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheck className="text-green-500 text-3xl" />
              </div>
            </div>
            <h3 className="text-xl font-medium text-center text-gray-800 mb-2">Success!</h3>
            <p className="text-center text-gray-600 mb-4">
              Your request has been processed. We'll send you the information shortly.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIXplainTab;