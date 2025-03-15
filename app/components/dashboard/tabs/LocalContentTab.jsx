'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCloudDownloadAlt, 
  FaFolder, 
  FaFolderOpen, 
  FaFileAlt, 
  FaPlay, 
  FaPause,
  FaSync, 
  FaPlus, 
  FaUpload, 
  FaGlobe, 
  FaWifi, 
  FaWifiSlash,
  FaLanguage,
  FaUserGraduate
} from 'react-icons/fa';
import { 
  BsTranslate, 
  BsSearch, 
  BsThreeDotsVertical, 
  BsArrowRight,
  BsFilter,
  BsLightbulb
} from 'react-icons/bs';
import { MdOutlineSignalWifiOff, MdSignalWifiStatusbarConnectedNoInternet, MdOutlineStorage } from 'react-icons/md';
import { RiAiGenerate } from 'react-icons/ri';

const LocalContentTab = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [storageUsed, setStorageUsed] = useState(65); // percentage
  const [playingContent, setPlayingContent] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generationLanguage, setGenerationLanguage] = useState('Hindi');
  const [generationTopic, setGenerationTopic] = useState('Agriculture');
  const [generationLevel, setGenerationLevel] = useState('Beginner');
  
  // Mock data for local content
  const localContent = [
    {
      id: 1,
      title: 'Sustainable Farming Practices',
      category: 'Agriculture',
      type: 'audio',
      language: 'Hindi',
      size: '12MB',
      duration: '15 min',
      lastAccessed: '2 days ago',
      downloadDate: '2023-10-15',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: true,
      popularity: 85,
      level: 'Beginner'
    },
    {
      id: 2,
      title: 'Digital Banking Basics',
      category: 'Financial Literacy',
      type: 'video',
      language: 'Bengali',
      size: '45MB',
      duration: '22 min',
      lastAccessed: '1 week ago',
      downloadDate: '2023-09-28',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: false,
      popularity: 92,
      level: 'Beginner'
    },
    {
      id: 3,
      title: 'Preventive Healthcare for Families',
      category: 'Health',
      type: 'document',
      language: 'Tamil',
      size: '3MB',
      duration: '10 pages',
      lastAccessed: '3 days ago',
      downloadDate: '2023-10-10',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: false,
      popularity: 78,
      level: 'Intermediate'
    },
    {
      id: 4,
      title: 'Water Conservation Techniques',
      category: 'Agriculture',
      type: 'audio',
      language: 'Hindi',
      size: '18MB',
      duration: '25 min',
      lastAccessed: 'Today',
      downloadDate: '2023-10-18',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: true,
      popularity: 95,
      level: 'Intermediate'
    },
    {
      id: 5,
      title: 'Small Business Management',
      category: 'Business',
      type: 'video',
      language: 'Marathi',
      size: '120MB',
      duration: '45 min',
      lastAccessed: '5 days ago',
      downloadDate: '2023-09-20',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: false,
      popularity: 88,
      level: 'Advanced'
    },
    {
      id: 6,
      title: 'Child Nutrition Guidelines',
      category: 'Health',
      type: 'document',
      language: 'Bengali',
      size: '5MB',
      duration: '15 pages',
      lastAccessed: '1 day ago',
      downloadDate: '2023-10-12',
      thumbnail: 'https://via.placeholder.com/150',
      aiGenerated: true,
      popularity: 90,
      level: 'Beginner'
    }
  ];
  
  // Categories and languages for filtering
  const categories = ['all', 'Agriculture', 'Health', 'Financial Literacy', 'Business', 'Education'];
  const languages = ['all', 'Hindi', 'Bengali', 'Tamil', 'Marathi', 'Telugu', 'Kannada'];
  
  // Filter content based on search, category, and language
  const filteredContent = localContent.filter(content => 
    (activeCategory === 'all' || content.category === activeCategory) &&
    (selectedLanguage === 'all' || content.language === selectedLanguage) &&
    (content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     content.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Toggle play/pause for content
  const togglePlayContent = (id) => {
    if (playingContent === id) {
      setPlayingContent(null);
    } else {
      setPlayingContent(id);
    }
  };
  
  // Handle AI content generation
  const handleGenerateContent = () => {
    if (!generationPrompt) return;
    
    setGeneratingContent(true);
    
    // Simulate AI generation process
    setTimeout(() => {
      setGeneratingContent(false);
      setShowGenerateModal(false);
      setGenerationPrompt('');
      // Here you would integrate with aiXPlain API
      alert('Content generated successfully! It will appear in your local library.');
    }, 3000);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <MdOutlineStorage className="mr-2 text-green-500 text-3xl" />
        Local Educational Content
      </h1>
      
      {/* Offline Mode Banner */}
      {!isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center"
        >
          <div className="bg-amber-100 p-2 rounded-full mr-3">
            <MdOutlineSignalWifiOff className="text-amber-600 text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-amber-800">You're currently offline</h3>
            <p className="text-sm text-amber-700">
              You can still access all your downloaded content. New content and AI generation will be available when you reconnect.
            </p>
          </div>
        </motion.div>
      )}
      
      {/* Storage and Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {/* Storage Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Local Storage</h2>
            <span className={`text-xs px-2 py-1 rounded-full ${
              storageUsed < 70 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {storageUsed}% Used
            </span>
          </div>
          
          <div className="mb-3">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  storageUsed < 70 ? 'bg-green-500' : storageUsed < 90 ? 'bg-amber-500' : 'bg-red-500'
                }`} 
                style={{ width: `${storageUsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>0 GB</span>
              <span>2.6 GB / 4 GB</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Audio</span>
              </div>
              <span className="text-sm font-medium text-gray-700">820 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-sm text-gray-600">Video</span>
              </div>
              <span className="text-sm font-medium text-gray-700">1.5 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-600">Documents</span>
              </div>
              <span className="text-sm font-medium text-gray-700">280 MB</span>
            </div>
          </div>
          
          <button className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
            <FaSync className="mr-2" /> Manage Storage
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="bg-green-50 hover:bg-green-100 transition-colors rounded-lg p-4 flex flex-col items-center justify-center"
              disabled={!isOnline}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <RiAiGenerate className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">Generate with AI</span>
              <span className="text-xs text-gray-500 mt-1">Create new content</span>
            </button>
            
            <button 
              onClick={() => setShowUploadModal(true)}
              className="bg-green-50 hover:bg-green-100 transition-colors rounded-lg p-4 flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FaUpload className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">Upload Content</span>
              <span className="text-xs text-gray-500 mt-1">Add your materials</span>
            </button>
            
            <button 
              className="bg-green-50 hover:bg-green-100 transition-colors rounded-lg p-4 flex flex-col items-center justify-center"
              disabled={!isOnline}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FaCloudDownloadAlt className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">Download New</span>
              <span className="text-xs text-gray-500 mt-1">Browse catalog</span>
            </button>
            
            <button className="bg-green-50 hover:bg-green-100 transition-colors rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FaLanguage className="text-green-600 text-xl" />
              </div>
              <span className="text-sm font-medium text-gray-800">Translate</span>
              <span className="text-xs text-gray-500 mt-1">Change language</span>
            </button>
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
              placeholder="Search local content..."
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
        
        <div className="flex items-center gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {languages.map(language => (
              <option key={language} value={language}>
                {language === 'all' ? 'All Languages' : language}
              </option>
            ))}
          </select>
        </div>
      </motion.div>
      
      {/* Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map(content => (
            <div 
              key={content.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 transition-colors"
            >
              <div className="h-40 bg-gray-100 relative">
                <img 
                  src={content.thumbnail} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  {content.type === 'audio' || content.type === 'video' ? (
                    <button 
                      onClick={() => togglePlayContent(content.id)}
                      className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      {playingContent === content.id ? (
                        <FaPause className="text-green-600 text-lg" />
                      ) : (
                        <FaPlay className="text-green-600 text-lg ml-1" />
                      )}
                    </button>
                  ) : (
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <FaFileAlt className="text-green-600 text-lg" />
                    </div>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <button className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                    <BsThreeDotsVertical className="text-gray-700" />
                  </button>
                </div>
                {content.aiGenerated && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                    <RiAiGenerate className="mr-1" />
                    AI Generated
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">{content.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    content.level === 'Beginner' 
                      ? 'bg-green-100 text-green-800' 
                      : content.level === 'Intermediate'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                  }`}>
                    {content.level}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  {content.type === 'audio' && <FaPlay className="mr-1" />}
                  {content.type === 'video' && <FaPlay className="mr-1" />}
                  {content.type === 'document' && <FaFileAlt className="mr-1" />}
                  <span>{content.duration}</span>
                  <span className="mx-2">•</span>
                  <BsTranslate className="mr-1" />
                  <span>{content.language}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <MdOutlineStorage className="mr-1" />
                    <span>{content.size}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 transition-colors">
                      <FaPlay className="mr-1" />
                      <span>Play</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredContent.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-3">
              <BsFilter className="text-5xl mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">No content found</h3>
            <p className="text-gray-600">Try changing your filters or search term</p>
          </div>
        )}
      </motion.div>
      
      {/* AI-Powered Learning Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 bg-white rounded-xl shadow-sm p-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <RiAiGenerate className="mr-2 text-green-500" /> AI-Powered Rural Education
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 mb-4">
              Create customized educational content for rural communities using aiXPlain's advanced AI models. Generate content in regional languages that works offline and in low-bandwidth areas.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <p className="text-sm text-gray-700">Choose a topic and target language</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">Describe the content you need</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">AI generates educational material</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">4</span>
                </div>
                <p className="text-sm text-gray-700">Download for offline use in rural areas</p>
              </div>
            </div>
            <button 
              onClick={() => setShowGenerateModal(true)}
              disabled={!isOnline}
              className={`mt-6 px-4 py-2 rounded-lg flex items-center ${
                isOnline 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } transition-colors`}
            >
              <RiAiGenerate className="mr-2" />
              Generate New Content
            </button>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BsLightbulb className="text-green-600 text-3xl" />
              </div>
              <h3 className="font-medium text-gray-800">Content Ideas</h3>
              <p className="text-sm text-gray-600 mt-1">Popular topics for rural education</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FaUserGraduate className="text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Sustainable Farming Techniques</h4>
                  <p className="text-xs text-gray-500">Most popular in Hindi regions</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FaUserGraduate className="text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Digital Financial Services</h4>
                  <p className="text-xs text-gray-500">Trending in multiple languages</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <FaUserGraduate className="text-purple-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-800">Maternal & Child Healthcare</h4>
                  <p className="text-xs text-gray-500">High demand in rural areas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Offline Access Guide */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Offline Access Guide</h2>
            <p className="text-gray-600 mb-4">
              Learn how to make educational content available in areas with limited or no internet connectivity.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <FaCloudDownloadAlt className="text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Download in Advance</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Download content when you have stable internet access before traveling to areas with poor connectivity.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <MdSignalWifiStatusbarConnectedNoInternet className="text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800">Low Bandwidth Mode</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Enable low bandwidth mode to access text content even with poor internet connection.
                </p>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <FaGlobe className="mr-2" />
              View Full Guide
            </button>
          </div>
          
          <div className="bg-green-500 p-6 text-white flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-3">Reach 500+ Rural Communities</h3>
            <p className="mb-4">
              Your educational content can help bridge the digital divide and empower rural communities across India.
            </p>
            <div className="flex items-center text-green-100 mb-2">
              <FaWifi className="mr-2" />
              <span>Works in low connectivity areas</span>
            </div>
            <div className="flex items-center text-green-100 mb-2">
              <BsTranslate className="mr-2" />
              <span>Available in 8 regional languages</span>
            </div>
            <div className="flex items-center text-green-100">
              <FaUserGraduate className="mr-2" />
              <span>Reaches 2.5M+ rural learners</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* AI Content Generation Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Generate Educational Content with AI</h3>
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Create customized educational content for rural communities using aiXPlain's advanced AI models. The content will be optimized for offline use.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Language</label>
                    <select
                      value={generationLanguage}
                      onChange={(e) => setGenerationLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {languages.filter(lang => lang !== 'all').map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Topic Category</label>
                    <select
                      value={generationTopic}
                      onChange={(e) => setGenerationTopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                  <div className="flex space-x-4">
                    {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="level"
                          value={level}
                          checked={generationLevel === level}
                          onChange={() => setGenerationLevel(level)}
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Describe the content you need
                  </label>
                  <textarea
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder="E.g., Create a beginner-friendly guide on water conservation techniques for farming that includes practical steps and local context..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                      <BsLightbulb className="text-blue-600 text-sm" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Tips for effective content</h4>
                      <ul className="text-xs text-blue-700 mt-1 list-disc list-inside space-y-1">
                        <li>Be specific about the target audience (e.g., farmers, women entrepreneurs)</li>
                        <li>Mention if you need visuals, audio narration, or text-only content</li>
                        <li>Include cultural context relevant to your target region</li>
                        <li>Specify if content should be optimized for feature phones or smartphones</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateContent}
                  disabled={!generationPrompt || generatingContent}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    !generationPrompt || generatingContent
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {generatingContent ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RiAiGenerate className="mr-2" />
                      Generate Content
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Content Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Upload Educational Content</h3>
                <button 
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <div className="mb-3">
                    <FaUpload className="text-gray-400 text-3xl mx-auto" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-1">Drag and drop files here</h4>
                  <p className="text-sm text-gray-600 mb-4">or click to browse your files</p>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block">
                    Browse Files
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: MP3, MP4, PDF, DOCX, PPTX (Max size: 100MB)
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                    <input
                      type="text"
                      placeholder="Enter a title for your content"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {languages.filter(lang => lang !== 'all').map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Provide a brief description of your content..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <FaUpload className="mr-2" />
                  Upload Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalContentTab;