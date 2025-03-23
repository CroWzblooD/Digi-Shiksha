'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBookOpen, 
  FaFileUpload,
  FaDownload,
  FaBookmark,
  FaShare
} from 'react-icons/fa';
import { 
  BsTranslate, 
  BsSearch, 
  BsBookmarkStar,
  BsMic,
  BsArrowRight
} from 'react-icons/bs';
import { MdOutlineSummarize, MdQuiz, MdOutlineSchool, MdOutlineMenuBook } from 'react-icons/md';
import { toast } from 'react-hot-toast'; // Add this import for notifications

const LocalContentTab = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [summaryLevel, setSummaryLevel] = useState('simple');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeView, setActiveView] = useState('chapters'); // 'chapters', 'upload', 'saved'
  const [summaryError, setSummaryError] = useState(null); // Add this line to fix the error
  const [summaryContext, setSummaryContext] = useState(null);

  // Sample data
  const classes = ['6', '7', '8', '9', '10', '11', '12'];
  const subjects = ['all', 'Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];
  const languages = ['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'];

  // Sample chapters data
  const chaptersData = [
    {
      id: 1,
      title: 'Real Numbers',
      subject: 'Mathematics',
      class: '10',
      chapter: '1',
      complexity: 'medium',
      keyTopics: ['Euclid\'s Division Lemma', 'Fundamental Theorem of Arithmetic', 'Irrational Numbers'],
      image: 'https://img.freepik.com/free-vector/hand-drawn-mathematics-background_23-2148157511.jpg',
      popularity: 85
    },
    {
      id: 2,
      title: 'Chemical Reactions',
      subject: 'Science',
      class: '10',
      chapter: '2',
      complexity: 'high',
      keyTopics: ['Types of Reactions', 'Balancing Equations', 'Oxidation and Reduction'],
      image: 'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg',
      popularity: 78
    },
    {
      id: 3,
      title: 'Nationalism in India',
      subject: 'Social Science',
      class: '10',
      chapter: '3',
      complexity: 'medium',
      keyTopics: ['Non-Cooperation Movement', 'Civil Disobedience', 'Quit India Movement'],
      image: 'https://img.freepik.com/free-vector/hand-drawn-indian-independence-day-background_23-2149492108.jpg',
      popularity: 92
    },
    {
      id: 4,
      title: 'Light - Reflection',
      subject: 'Science',
      class: '10',
      chapter: '4',
      complexity: 'medium',
      keyTopics: ['Laws of Reflection', 'Spherical Mirrors', 'Mirror Formula'],
      image: 'https://img.freepik.com/free-vector/realistic-light-bulb-with-electricity_23-2149129410.jpg',
      popularity: 75
    },
    {
      id: 5,
      title: 'Polynomials',
      subject: 'Mathematics',
      class: '10',
      chapter: '5',
      complexity: 'low',
      keyTopics: ['Zeros of Polynomials', 'Division Algorithm', 'Relationship between Zeros and Coefficients'],
      image: 'https://img.freepik.com/free-vector/realistic-math-chalkboard-background_23-2148163817.jpg',
      popularity: 80
    },
    {
      id: 6,
      title: 'Acids and Bases',
      subject: 'Science',
      class: '10',
      chapter: '6',
      complexity: 'high',
      keyTopics: ['pH Scale', 'Neutralization Reactions', 'Salts and their Properties'],
      image: 'https://img.freepik.com/free-vector/realistic-science-laboratory-equipment_23-2148485455.jpg',
      popularity: 88
    }
  ];

  // Filter chapters based on search, class, and subject
  const filteredChapters = chaptersData.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.keyTopics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass = chapter.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || chapter.subject === selectedSubject;
    
    return matchesSearch && matchesClass && matchesSubject;
  });

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    setGeneratedSummary(null);
    setSummaryError(null);
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setGeneratedSummary(null); // Reset summary
      setSummaryError(null);    // Reset error
  
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryError(null);
  
    try {
      let textToSummarize = "";
  
      if (uploadedFile) {
        if (uploadedFile.type.startsWith("image/") || uploadedFile.type === "application/pdf") {
          const formData = new FormData();
          formData.append("file", uploadedFile);
          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
            { method: "POST", body: formData }
          );
          const uploadData = await uploadResponse.json();
          if (!uploadData.secure_url) throw new Error("Failed to upload to Cloudinary");
          const fileUrl = uploadData.secure_url;
  
          const ocrResponse = await fetch("/api/ocr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl: fileUrl })
          });
          const ocrData = await ocrResponse.json();
          if (!ocrData.success) throw new Error("OCR failed: " + ocrData.error);
          textToSummarize = ocrData.text;
        } else if (uploadedFile.type === "text/plain") {
          const reader = new FileReader();
          textToSummarize = await new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(uploadedFile);
          });
        } else {
          throw new Error("Unsupported file type. Please upload a text file, image, or PDF.");
        }
      } else if (selectedChapter) {
        if (!selectedChapter.text) throw new Error("Chapter text not available");
        textToSummarize = selectedChapter.text;
      } else {
        throw new Error("No content selected or uploaded");
      }
  
      const response = await fetch("/api/Summarizers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSummarize,
          language: selectedLanguage,
          summaryLevel: summaryLevel
        })
      });
  
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
  
      if (!data.success) throw new Error(data.error || "Failed to generate summary");
      setGeneratedSummary(data.summary);
      toast.success("Summary generated successfully!");
  
      // Set summary context to open the modal
      if (uploadedFile) {
        setSummaryContext({ type: 'upload', file: uploadedFile });
      } else if (selectedChapter) {
        setSummaryContext({ type: 'chapter', chapter: selectedChapter });
      }
  
    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaryError(error.message);
      toast.error("Failed to generate summary: " + error.message);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-block bg-green-50 p-3 rounded-full mb-4">
          <MdOutlineSummarize className="text-4xl text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          NCERT Simplifier
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understand complex NCERT concepts in simple language, in your preferred regional language
        </p>
      </motion.div>
      
      {/* Main Navigation */}
      <div className="bg-white text-black rounded-xl shadow-sm mb-8 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveView('chapters')}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${
              activeView === 'chapters' 
                ? 'bg-green-50 text-green-600 border-b-2 border-green-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MdOutlineMenuBook className="inline mr-2 text-lg" />
            NCERT Chapters
          </button>
          <button
            onClick={() => setActiveView('upload')}
            className={`flex-1 py-4 px-4 text-black font-medium text-center transition-colors ${
              activeView === 'upload' 
                ? 'bg-green-50 text-green-600 border-b-2 border-green-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaFileUpload className="inline mr-2" />
            Upload Content
          </button>
          <button
            onClick={() => setActiveView('saved')}
            className={`flex-1 py-4 px-4 font-medium text-center transition-colors ${
              activeView === 'saved' 
                ? 'bg-green-50 text-green-600 border-b-2 border-green-500' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaBookmark className="inline mr-2" />
            Saved Summaries
          </button>
        </div>
      </div>
      
      {/* NCERT Chapters View */}
      {activeView === 'chapters' && (
        <div className="space-y-8 text-black">
          {/* Filters */}
          <div className="bg-white rounded-xl text-black shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-black font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-black text-sm text-black font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-black font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search chapters, topics..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Chapter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map(chapter => (
              <div 
                key={chapter.id}
                onClick={() => setSelectedChapter(chapter)}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="h-40 bg-gray-100 relative">
                  <img 
                    src={chapter.image} 
                    alt={chapter.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-lg">
                    <span className="font-medium">Chapter {chapter.chapter}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-800">{chapter.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chapter.complexity === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : chapter.complexity === 'medium'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}>
                      {chapter.complexity.charAt(0).toUpperCase() + chapter.complexity.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex text-black items-center text-sm text-gray-500 mb-3">
                    <MdOutlineSchool className="mr-1" />
                    <span>Class {chapter.class}</span>
                    <span className="mx-2">•</span>
                    <FaBookOpen className="mr-1" />
                    <span>{chapter.subject}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {chapter.keyTopics.slice(0, 2).map((topic, index) => (
                      <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        {topic}
                      </span>
                    ))}
                    {chapter.keyTopics.length > 2 && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                        +{chapter.keyTopics.length - 2} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500" 
                          style={{ width: `${chapter.popularity}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">{chapter.popularity}% popular</span>
                    </div>
                    <button className="text-green-600 hover:text-green-800 transition-colors">
                      <BsArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Content View */}
      {activeView === 'upload' && (
        <div className="bg-white text-black text-black rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Your Content</h2>
          
          <div className="mb-6">
            {!uploadedFile ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-300 transition-colors"
                onClick={() => document.getElementById('fileInput').click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="mb-3">
                  <FaFileUpload className="text-gray-400 text-5xl mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">Upload your study material</h3>
                <p className="text-sm text-gray-600 mb-4">Drag and drop files here or click to browse</p>
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-block">
                  Browse Files
                </button>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX (Max size: 20MB)
                </p>
              </div>
            ) : (
              <div className="border border-gray-200 text-black rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <FaFileUpload className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{uploadedFile.name}</h3>
                      <p className="text-xs text-gray-500">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setFilePreview(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
                
                {filePreview && uploadedFile.type.startsWith('image/') && (
                  <div className="p-4 border-b border-gray-200">
                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={filePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select
                        className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {subjects.filter(subject => subject !== 'all').map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {classes.map(cls => (
                          <option key={cls} value={cls}>Class {cls}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Title</label>
                    <input
                      type="text"
                      placeholder="Enter a title for your content"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary Level</label>
                    <div className="flex space-x-4">
                      {['simple', 'detailed', 'advanced'].map(level => (
                        <label key={level} className="flex items-center">
                          <input
                            type="radio"
                            name="summaryLevel"
                            value={level}
                            checked={summaryLevel === level}
                            onChange={() => setSummaryLevel(level)}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setFilePreview(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        isGeneratingSummary
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isGeneratingSummary ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Summary...
                        </>
                      ) : (
                        <>
                          <MdOutlineSummarize className="mr-2" />
                          Generate Summary
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

{summaryContext && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
      {/* Header */}
      {summaryContext.type === 'chapter' ? (
        <div className="relative h-48 bg-gray-100">
          <img
            src={summaryContext.chapter.image}
            alt={summaryContext.chapter.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-6 text-white">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-green-500 px-2 py-1 rounded text-xs font-medium">
                  Chapter {summaryContext.chapter.chapter}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  summaryContext.chapter.complexity === 'low'
                    ? 'bg-green-400'
                    : summaryContext.chapter.complexity === 'medium'
                      ? 'bg-blue-400'
                      : 'bg-purple-400'
                }`}>
                  {summaryContext.chapter.complexity.charAt(0).toUpperCase() + summaryContext.chapter.complexity.slice(1)} Complexity
                </span>
              </div>
              <h2 className="text-2xl font-bold">{summaryContext.chapter.title}</h2>
              <p className="text-sm text-gray-200">{summaryContext.chapter.subject} • Class {summaryContext.chapter.class}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{summaryContext.file.name}</h2>
          <p className="text-sm text-gray-600">Uploaded File • {(summaryContext.file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </div>
      )}

      {/* Body */}
      <div className="p-6">
        {summaryContext.type === 'chapter' && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {summaryContext.chapter.keyTopics.map((topic, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Summary Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {languages.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Summary Level</label>
                  <div className="flex space-x-4">
                    {['simple', 'detailed', 'advanced'].map(level => (
                      <label key={level} className="flex items-center">
                        <input
                          type="radio"
                          name="summaryLevel"
                          value={level}
                          checked={summaryLevel === level}
                          onChange={() => setSummaryLevel(level)}
                          className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingSummary}
                className={`w-full py-3 rounded-lg flex items-center justify-center ${
                  isGeneratingSummary
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isGeneratingSummary ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Summary...
                  </>
                ) : (
                  <>
                    <MdOutlineSummarize className="mr-2" />
                    Generate {summaryLevel.charAt(0).toUpperCase() + summaryLevel.slice(1)} Summary
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {generatedSummary && !isGeneratingSummary && (
          <div className="bg-white border border-gray-200 text-black rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <MdOutlineSummarize className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium  text-gray-800">Simplified Summary</h3>
                  <p className="text-xs text-gray-500">
                    {summaryContext.type === 'chapter' ? summaryContext.chapter.title : summaryContext.file.name} • {selectedLanguage} • {summaryLevel.charAt(0).toUpperCase() + summaryLevel.slice(1)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {navigator.clipboard.writeText(generatedSummary)}}
                  className="text-gray-500 hover:text-gray-700"
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                <button
                  onClick={() => {setIsBookmarked(!isBookmarked)}}
                  className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
                  title={isBookmarked ? "Remove bookmark" : "Bookmark this summary"}
                >
                  <FaBookmark className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="prose max-w-none">
                <div className="whitespace-pre-line">
                  {generatedSummary}
                </div>
              </div>
            </div>
          </div>
        )}

        {summaryError && !isGeneratingSummary && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mt-4">
            <p className="font-medium">Error generating summary</p>
            <p className="text-sm">{summaryError}</p>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="p-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={() => setSummaryContext(null)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      
      {/* Saved Summaries View */}
      {activeView === 'saved' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Saved Summaries</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-300 transition-colors">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-800">
                      {['Real Numbers', 'Chemical Reactions', 'Nationalism in India'][item - 1]}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                      {['Mathematics', 'Science', 'Social Science'][item - 1]}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MdOutlineSchool className="mr-1" />
                    <span>Class 10</span>
                    <span className="mx-2">•</span>
                    <BsTranslate className="mr-1" />
                    <span>{['Hindi', 'Bengali', 'Tamil'][item - 1]}</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {[
                      'Real numbers include all rational and irrational numbers. They can be represented on a number line and include numbers like 5, -3, 0, 1/2, √2, and π.',
                      'Chemical reactions involve the transformation of reactants into products. Types include combination, decomposition, displacement, and redox reactions.',
                      'Nationalism in India grew during the colonial period as a response to British rule. Key movements included Non-Cooperation, Civil Disobedience, and Quit India.'
                    ][item - 1]}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Saved on {['May 15', 'May 18', 'May 20'][item - 1]}, 2023</span>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaShare className="text-sm" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <FaDownload className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Chapter Detail Modal */}
      {selectedChapter && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="relative h-48 bg-gray-100">
              <img 
                src={selectedChapter.image} 
                alt={selectedChapter.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 text-white">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-green-500 px-2 py-1 rounded text-xs font-medium">
                      Chapter {selectedChapter.chapter}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      selectedChapter.complexity === 'low' 
                        ? 'bg-green-400' 
                        : selectedChapter.complexity === 'medium'
                          ? 'bg-blue-400'
                          : 'bg-purple-400'
                    }`}>
                                      {selectedChapter.complexity.charAt(0).toUpperCase() + selectedChapter.complexity.slice(1)} Complexity
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedChapter.title}</h2>
                  <p className="text-sm text-gray-200">{selectedChapter.subject} • Class {selectedChapter.class}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedChapter(null)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="p-6 text-black">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center">
                  <MdOutlineSchool className="mr-1" />
                  Class {selectedChapter.class}
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center">
                  <FaBookOpen className="mr-1" />
                  Chapter {selectedChapter.chapter}
                </div>
                <div className={`px-3 py-1 rounded-full text-sm flex items-center ${
                  selectedChapter.complexity === 'low' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedChapter.complexity === 'medium'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                }`}>
                  <BsArrowRight className="mr-1" />
                  {selectedChapter.complexity.charAt(0).toUpperCase() + selectedChapter.complexity.slice(1)} Complexity
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center">
                  <BsTranslate className="mr-1" />
                  {selectedLanguage}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Key Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedChapter.keyTopics.map((topic, index) => (
                    <div key={index} className="bg-gray-100 px-3 py-2 rounded-lg text-gray-700">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Summary Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Summary Level</label>
                    <div className="flex space-x-4">
                      {['simple', 'detailed', 'advanced'].map(level => (
                        <label key={level} className="flex items-center">
                          <input
                            type="radio"
                            name="summaryLevel"
                            value={level}
                            checked={summaryLevel === level}
                            onChange={() => setSummaryLevel(level)}
                            className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleGenerateSummary}
                  disabled={isGeneratingSummary}
                  className={`w-full py-3 rounded-lg flex items-center justify-center ${
                    isGeneratingSummary
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isGeneratingSummary ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <MdOutlineSummarize className="mr-2" />
                      Generate {summaryLevel.charAt(0).toUpperCase() + summaryLevel.slice(1)} Summary
                    </>
                  )}
                </button>
              </div>
              
              // Inside the component, update the UI for displaying summary results
              
              // In the chapter detail modal, update the summary display section:
              {generatedSummary && !isGeneratingSummary && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <MdOutlineSummarize className="text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Simplified Summary</h3>
                        <p className="text-xs text-gray-500">{selectedChapter?.title} • {selectedLanguage} • {summaryLevel.charAt(0).toUpperCase() + summaryLevel.slice(1)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {navigator.clipboard.writeText(generatedSummary)}}
                        className="text-gray-500 hover:text-gray-700"
                        title="Copy to clipboard"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => {setIsBookmarked(!isBookmarked)}}
                        className={`${isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-gray-700'}`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this summary"}
                      >
                        <FaBookmark className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-line">
                        {generatedSummary}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {summaryError && !isGeneratingSummary && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 mt-4">
                  <p className="font-medium">Error generating summary</p>
                  <p className="text-sm">{summaryError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalContentTab;
