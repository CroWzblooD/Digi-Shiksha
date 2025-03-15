'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaBriefcase, 
  FaRupeeSign, 
  FaUserTie,
  FaChalkboardTeacher,
  FaUniversity,
  FaLaptopCode,
  FaHeartbeat,
  FaTools,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaBookmark,
  FaRegBookmark,
  FaExternalLinkAlt,
  FaMicrophone,
  FaVideo,
  FaRobot,
  FaStop,
  FaCheck,
  FaArrowRight,
  FaLeaf,
  FaSeedling,
  FaTree,
  FaLightbulb,
  FaTimes,
  FaRedo
} from 'react-icons/fa';
import { BsArrowRight, BsChevronDown, BsChevronUp, BsGrid, BsListUl, BsThreeDots } from 'react-icons/bs';
import { MdOutlineSchool, MdWorkOutline, MdOutlineQuiz, MdVideocam, MdOutlineVideoCall, MdNature, MdEco } from 'react-icons/md';
import { RiUserVoiceLine, RiAiGenerate } from 'react-icons/ri';

const StudentsTab = () => {
  // States for filters and UI controls
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [savedOpportunities, setSavedOpportunities] = useState([1, 3]);
  const [recognition, setRecognition] = useState(null);
  
  // States for interview functionality
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [interviewStage, setInterviewStage] = useState('intro'); 
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState([]);
  const [timer, setTimer] = useState(60);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcribedText, setTranscribedText] = useState(''); //
  const [interviewFeedback, setInterviewFeedback] = useState({
    overall: '',
    strengths: [],
    improvements: [],
    score: 0
  });
  
  // Refs for media handling
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  
  // Add missing state variables
  const [isRecording, setIsRecording] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const userVideoRef = useRef(null);
  
  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            handleNextQuestion();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timer]);
  
  // Cleanup media on unmount
  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, []);
  
  // Setup media devices for interview
  const setupMediaDevices = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        
        recognitionInstance.onresult = (event) => {
          // Handle speech recognition results
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
            
          // Store user's spoken response
          if (event.results[0].isFinal) {
            setUserResponses(prev => {
              const newResponses = [...prev];
              newResponses[currentQuestionIndex] = transcript;
              return newResponses;
            });
          }
        };

        

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
        };

        recognitionInstance.start();
        setRecognition(recognitionInstance);
      }
      

  // Cleanup media resources
  const cleanupMedia = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }

    
        
    if (recognition) {
      recognition.stop();
    }
        
    setIsRecording(false);
    setTimerActive(false);
    setTranscribedText('');
  };
      
      return true;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Please allow camera and microphone access to use the mock interview feature.');
      return false;
    }
  };

  
  
  // Check if camera is displaying properly
  const checkCameraDisplay = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      console.log('Camera is displaying properly');
    } else {
      console.error('Camera is not displaying properly');
    }
  };
  
  // Start recording
  const startRecording = () => {
    if (!streamRef.current) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      
      // Save the response
      setUserResponses(prev => [...prev, {
        question: interviewQuestions[currentQuestionIndex],
        videoURL: videoURL
      }]);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorderRef.current.start();
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Cleanup media
  const cleanupMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
    
    if (recognition) {
      recognition.stop();
    }
    
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }
    
    setIsRecording(false);
    setTimerActive(false);
    setTranscribedText('');
  };
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'All Opportunities', icon: <FaLeaf className="text-green-600" /> },
    { id: 'jobs', name: 'Jobs', icon: <FaBriefcase className="text-green-600" /> },
    { id: 'internships', name: 'Internships', icon: <MdWorkOutline className="text-green-600" /> },
    { id: 'scholarships', name: 'Scholarships', icon: <FaGraduationCap className="text-green-600" /> },
    { id: 'courses', name: 'Courses', icon: <MdOutlineSchool className="text-green-600" /> },
    { id: 'skills', name: 'Skill Development', icon: <FaTools className="text-green-600" /> }
  ];
  
  // Locations for filter
  const locations = ['All Locations', 'Remote', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Rural Areas'];
  
  // Career paths
  const careerPaths = [
    {
      id: 1,
      name: 'Agriculture',
      icon: <FaSeedling className="text-green-600" />
    },
    {
      id: 2,
      name: 'Technology',
      icon: <FaLaptopCode className="text-green-600" />
    },
    {
      id: 3,
      name: 'Healthcare',
      icon: <FaHeartbeat className="text-green-600" />
    },
    {
      id: 4,
      name: 'Education',
      icon: <FaChalkboardTeacher className="text-green-600" />
    },
    {
      id: 5,
      name: 'Finance',
      icon: <FaRupeeSign className="text-green-600" />
    }
  ];
  
  // Mock data for opportunities
  const opportunitiesData = [
    {
      id: 1,
      title: 'Agricultural Extension Officer',
      organization: 'Ministry of Agriculture',
      type: 'jobs',
      location: 'Rural Areas',
      description: 'Work with farmers to implement sustainable farming practices and improve crop yields.',
      salary: '₹30,000 - ₹45,000 per month',
      deadline: '30 Nov 2023',
      skills: ['Agriculture', 'Communication', 'Extension Services'],
      hasInterview: true,
      careerPath: 'agriculture'
    },
    {
      id: 2,
      title: 'Rural Healthcare Internship',
      organization: 'National Health Mission',
      type: 'internships',
      location: 'Rural Areas',
      description: 'Gain hands-on experience in providing healthcare services in rural communities.',
      stipend: '₹15,000 per month',
      duration: '6 months',
      skills: ['Healthcare', 'Community Outreach', 'Basic Medical Knowledge'],
      hasInterview: true,
      careerPath: 'healthcare'
    },
    {
      id: 3,
      title: 'Rural Education Scholarship',
      organization: 'Education For All Foundation',
      type: 'scholarships',
      location: 'All Locations',
      description: 'Financial support for students from rural areas pursuing higher education.',
      amount: 'Up to ₹2,00,000 per year',
      deadline: '15 Dec 2023',
      skills: ['Academic Excellence', 'Leadership', 'Community Service'],
      hasInterview: false,
      careerPath: 'education'
    },
    {
      id: 4,
      title: 'Digital Literacy Trainer',
      organization: 'Digital India Initiative',
      type: 'jobs',
      location: 'Rural Areas',
      description: 'Train rural communities in basic computer skills and digital literacy.',
      salary: '₹25,000 - ₹35,000 per month',
      deadline: '10 Dec 2023',
      skills: ['Teaching', 'Computer Skills', 'Communication'],
      hasInterview: true,
      careerPath: 'education'
    },
    {
      id: 5,
      title: 'Sustainable Farming Course',
      organization: 'Green Earth Institute',
      type: 'courses',
      location: 'Online',
      description: 'Learn organic farming techniques, water conservation, and sustainable agriculture practices.',
      fee: '₹5,000 (Scholarships available)',
      duration: '3 months',
      skills: ['Agriculture', 'Sustainability', 'Environmental Science'],
      hasInterview: false,
      careerPath: 'agriculture'
    },
    {
      id: 6,
      title: 'Rural Entrepreneurship Program',
      organization: 'Start India Foundation',
      type: 'skills',
      location: 'Multiple Locations',
      description: 'Develop skills to start and run successful businesses in rural areas.',
      fee: 'Free (Government Sponsored)',
      duration: '2 months',
      skills: ['Business Planning', 'Marketing', 'Financial Management'],
      hasInterview: true,
      careerPath: 'finance'
    },
    {
      id: 7,
      title: 'Microfinance Officer',
      organization: 'Rural Development Bank',
      type: 'jobs',
      location: 'Rural Areas',
      description: 'Facilitate microloans and financial services to rural entrepreneurs and farmers.',
      salary: '₹28,000 - ₹40,000 per month',
      deadline: '5 Dec 2023',
      skills: ['Finance', 'Communication', 'Rural Economics'],
      hasInterview: true,
      careerPath: 'finance'
    },
    {
      id: 8,
      title: 'Rural Technology Internship',
      organization: 'TechForAll',
      type: 'internships',
      location: 'Remote',
      description: 'Develop technology solutions for rural challenges in agriculture, healthcare, and education.',
      stipend: '₹18,000 per month',
      duration: '4 months',
      skills: ['Programming', 'Problem Solving', 'User Research'],
      hasInterview: true,
      careerPath: 'tech'
    },
    {
      id: 9,
      title: 'Organic Farming Specialist',
      organization: 'Sustainable Agriculture Association',
      type: 'jobs',
      location: 'Rural Areas',
      description: 'Guide farmers in transitioning to organic farming methods and obtaining certification.',
      salary: '₹35,000 - ₹50,000 per month',
      deadline: '20 Dec 2023',
      careerPath: 'agriculture',
      skills: ['Agriculture', 'Technology', 'Market Knowledge'],
      hasInterview: false
    }
  ];

  // Filter opportunities based on active category, search query, and location
  const filteredOpportunities = opportunitiesData.filter(item => {
    const categoryMatch = activeCategory === 'all' || item.type === activeCategory;
    const searchMatch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const locationMatch = selectedLocation === 'All Locations' || item.location === selectedLocation;
    return categoryMatch && searchMatch && locationMatch;
  });

  // Toggle save opportunity
  const toggleSaveOpportunity = (id) => {
    if (savedOpportunities.includes(id)) {
      setSavedOpportunities(savedOpportunities.filter(itemId => itemId !== id));
    } else {
      setSavedOpportunities([...savedOpportunities, id]);
    }
  };

  // Start mock interview - Enhanced version
  const startMockInterview = async (job) => {
    setSelectedJob(job);
    setInterviewStage('intro');
    setShowInterviewModal(true);
    setUserResponses([]);
    setCurrentQuestionIndex(0);
    setInterviewFeedback({
      overall: '',
      strengths: [],
      improvements: [],
      score: 0
    });
  };

  // Generate interview questions - Enhanced with AI-like functionality
  const generateInterviewQuestions = async () => {
    // Simulate API call to generate questions
    setInterviewStage('loading');
    
    // In a real app, this would be an API call to an AI service
    setTimeout(() => {
      // Get questions based on career path
      const careerPath = selectedJob?.careerPath || 'tech';
      
      // Generate dynamic questions based on job details
      const dynamicQuestions = generateDynamicQuestions(selectedJob);
      
      setInterviewQuestions(dynamicQuestions);
      setInterviewStage('questions');
    }, 1500); // Simulate API delay
  };
  
  // Function to generate dynamic questions based on job details
  const generateDynamicQuestions = (job) => {
    const baseQuestions = {
      'tech': [
        "What programming languages are you familiar with?",
        "Describe a technical project you've worked on that you're proud of.",
        "How do you stay updated with the latest technology trends?",
        "How would you explain a complex technical concept to someone without technical background?",
        "What approach do you take when debugging a problem?"
      ],
      'healthcare': [
        "Why are you interested in working in rural healthcare?",
        "How would you handle a medical emergency with limited resources?",
        "What challenges do you think rural communities face in accessing healthcare?",
        "How would you educate a community about preventive healthcare?",
        "Describe your experience working with patients from diverse backgrounds."
      ],
      'finance': [
        "How would you explain microfinance concepts to someone with limited financial literacy?",
        "What methods would you use to assess loan eligibility in rural areas?",
        "How would you build trust in communities that are skeptical of financial institutions?",
        "What challenges might you face in collecting loan repayments in rural areas?",
        "How would you promote financial literacy in rural communities?"
      ],
      'education': [
        "What teaching methodologies would you use in a rural classroom with limited resources?",
        "How would you address the digital divide in rural education?",
        "What strategies would you use to increase school attendance in rural areas?",
        "How would you involve parents and the community in the education process?",
        "What approaches would you take to make education relevant to rural students' lives?"
      ],
      'agriculture': [
        "What sustainable farming practices would you recommend for small-scale farmers?",
        "How would you help farmers get better market access for their produce?",
        "What role can technology play in improving agricultural productivity in rural areas?",
        "How would you address water scarcity issues in farming?",
        "What strategies would you suggest for pest management in organic farming?"
      ]
    };
    
    // Get questions based on career path or default to general questions
    const careerPath = job?.careerPath || 'tech';
    const questions = baseQuestions[careerPath] || baseQuestions.tech;
    
    // Add job-specific questions
    const jobSpecificQuestions = [
      `Tell me about your interest in ${job.title} at ${job.organization}.`,
      `This position requires ${job.skills ? job.skills.join(", ") : "various skills"}. How do your skills align with these requirements?`,
      `How would you contribute to our mission in ${job.location === 'Remote' ? 'a remote environment' : job.location}?`
    ];
    
    // Combine and shuffle questions
    const allQuestions = [...jobSpecificQuestions, ...questions];
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    
    // Return 5 questions
    return shuffled.slice(0, 5);
  };


  
  // Start the actual interview
  const startInterview = async () => {
    const hasAccess = await setupMediaDevices();
    if (hasAccess) {
      setInterviewStage('interview');
      setTimer(60);
      
      // Check if camera is displaying properly
      checkCameraDisplay();
      
      setTimeout(() => {
        startRecording();
        simulateAiSpeaking();
      }, 1000);
    }
  };
  
  // Simulate AI speaking
  const simulateAiSpeaking = () => {
    setAiSpeaking(true);
    setTimeout(() => {
      setAiSpeaking(false);
    }, 3000);
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    stopRecording();
    
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimer(60);
      
      // Small delay before starting next question
      setTimeout(() => {
        startRecording();
        simulateAiSpeaking();
      }, 1500);
    } else {
      handleEndInterview();
    }
  };
  
  // Handle end interview
  const handleEndInterview = () => {
    stopRecording();
    cleanupMedia();
    generateFeedback();
  };
  
  // Generate interview feedback
  const generateFeedback = () => {
    setInterviewStage('loading');
    
    // Simulate API call for feedback generation
    setTimeout(() => {
      // Generate more personalized feedback based on job type
      const jobType = selectedJob?.careerPath || 'tech';
      
      // Strengths based on job type
      const strengthsByType = {
        'tech': [
          "Clear communication of technical concepts",
          "Logical problem-solving approach",
          "Good understanding of technical requirements"
        ],
        'healthcare': [
          "Strong empathy in responses",
          "Good understanding of healthcare challenges",
          "Clear communication of medical concepts"
        ],
        'finance': [
          "Strong grasp of financial concepts",
          "Clear explanation of complex financial ideas",
          "Good understanding of rural financial challenges"
        ],
        'education': [
          "Passion for education evident in responses",
          "Good understanding of teaching methodologies",
          "Clear communication skills for educational context"
        ],
        'agriculture': [
          "Strong knowledge of agricultural practices",
          "Good understanding of rural farming challenges",
          "Practical approach to agricultural solutions"
        ]
      };
      
      // Areas for improvement based on job type
      const improvementsByType = {
        'tech': [
          "Provide more specific coding examples",
          "Consider explaining technical concepts more simply",
          "Highlight more problem-solving experiences"
        ],
        'healthcare': [
          "Include more examples of patient interactions",
          "Discuss preventive healthcare approaches more",
          "Highlight experience with limited resources"
        ],
        'finance': [
          "Provide more examples of financial literacy education",
          "Discuss rural financial inclusion strategies more",
          "Highlight experience with microfinance concepts"
        ],
        'education': [
          "Provide more examples of teaching methodologies",
          "Discuss approaches to digital divide more",
          "Highlight experience with curriculum adaptation"
        ],
        'agriculture': [
          "Provide more examples of modern farming techniques",
          "Discuss sustainable farming approaches more",
          "Highlight experience with agricultural technology"
        ]
      };
      
      // Generate random but realistic scores
      const overallScore = Math.floor(Math.random() * 15) + 80; // 80-95
      
      // Generate question-specific feedback
      const questionFeedback = interviewQuestions.map((q, i) => {
        const score = Math.floor(Math.random() * 20) + 75; // 75-95
        
        // Generate specific feedback based on question content
        let feedback = "";
        if (q.includes("explain") || q.includes("complex")) {
          feedback = "Good explanation, but could be more concise and use more relatable examples.";
        } else if (q.includes("challenge") || q.includes("problem")) {
          feedback = "Strong problem-solving approach. Consider using the STAR method to structure your response.";
        } else if (q.includes("experience") || q.includes("worked")) {
          feedback = "Good examples provided. Try to quantify your achievements more specifically.";
        } else if (q.includes("interest") || q.includes("why")) {
          feedback = "Showed genuine enthusiasm. Could connect more directly to the organization's mission.";
        } else {
          feedback = "Solid response with good structure. Consider adding more specific examples from your experience.";
        }
        
        return {
          question: q,
          score: score,
          feedback: feedback
        };
      });
      
      // Create the feedback object
      const feedback = {
        overall: overallScore >= 90 
          ? "Excellent performance! You demonstrated strong knowledge and communication skills that align well with this position."
          : overallScore >= 80
          ? "Good performance! You showed solid understanding of the requirements, with some areas to refine before the actual interview."
          : "Decent effort! With some practice on the suggested improvements, you'll be well-prepared for the actual interview.",
        strengths: strengthsByType[jobType] || strengthsByType.tech,
        improvements: improvementsByType[jobType] || improvementsByType.tech,
        score: overallScore,
        questionFeedback: questionFeedback
      };
      
      setInterviewFeedback(feedback);
      setInterviewStage('feedback');
    }, 2000);
  };

  return (
    <div className="p-6 bg-green-50">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaLeaf className="mr-2 text-green-500 text-3xl" />
          Opportunity Navigator
        </h1>
        <p className="text-gray-600 mt-1">
          Discover scholarships, jobs, and skill development opportunities tailored for rural students
        </p>
      </motion.div>
      
      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Career Paths Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaUniversity className="mr-2 text-green-500" /> Explore Career Paths
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {careerPaths.map(path => (
              <motion.div
                key={path.id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:border-green-200 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                  {path.icon}
                </div>
                <h3 className="font-medium text-gray-800">{path.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Career Path</p>
                <button className="mt-3 text-xs text-green-600 flex items-center justify-center mx-auto">
                  Explore <BsArrowRight className="ml-1" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-green-100 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-300/30 focus:border-green-300"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Location Filter */}
              <div className="relative">
                <button 
                  onClick={() => setShowLocationFilter(!showLocationFilter)}
                  className="flex items-center space-x-1 px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                >
                  <FaMapMarkerAlt className="text-gray-500" />
                  <span className="text-sm">{selectedLocation}</span>
                  {showLocationFilter ? <BsChevronUp className="ml-1" /> : <BsChevronDown className="ml-1" />}
                </button>
                
                {showLocationFilter && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                    {locations.map(location => (
                      <button
                        key={location}
                        onClick={() => {
                          setSelectedLocation(location);
                          setShowLocationFilter(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedLocation === location 
                            ? 'bg-green-50 text-green-700' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <BsGrid />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-green-50 text-green-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  <BsListUl />
                </button>
              </div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm flex items-center ${
                  activeCategory === category.id
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>
        
        {/* Opportunities List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredOpportunities.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-8 border border-green-100 text-center">
              <FaSearch className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">No opportunities found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {filteredOpportunities.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                >
                  <div className={`${viewMode === 'list' ? 'flex-1 p-4' : 'p-5'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`rounded-full p-2 mr-3 flex-shrink-0 ${
                          item.type === 'jobs' ? 'bg-green-50 text-green-500' :
                          item.type === 'scholarships' ? 'bg-emerald-50 text-emerald-500' :
                          item.type === 'internships' ? 'bg-teal-50 text-teal-500' :
                          item.type === 'courses' ? 'bg-lime-50 text-lime-500' :
                          'bg-green-50 text-green-500'
                        }`}>
                          {item.type === 'jobs' && <FaBriefcase />}
                          {item.type === 'scholarships' && <FaGraduationCap />}
                          {item.type === 'internships' && <MdWorkOutline />}
                          {item.type === 'courses' && <MdOutlineSchool />}
                          {item.type === 'skills' && <FaTools />}
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-gray-800">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.organization}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => toggleSaveOpportunity(item.id)}
                        className="ml-2 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        {savedOpportunities.includes(item.id) 
                          ? <FaBookmark className="text-green-400" /> 
                          : <FaRegBookmark />
                        }
                      </button>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <FaMapMarkerAlt className="mr-1 text-gray-500" />
                        {item.location}
                      </span>
                      
                      {item.deadline && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
                          <FaCalendarAlt className="mr-1" />
                          Deadline: {item.deadline}
                        </span>
                      )}
                      
                      {item.duration && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700">
                          <FaCalendarAlt className="mr-1" />
                          Duration: {item.duration}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.description}</p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {item.skills && item.skills.map((skill, index) => (
                          <span key={index} className="inline-block px-2 py-1 rounded-md text-xs bg-green-50 text-green-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${
                    viewMode === 'grid' 
                      ? 'border-t border-gray-100 px-5 py-3 bg-gray-50 flex justify-between items-center' 
                      : 'border-l border-gray-100 p-4 flex flex-col justify-center space-y-2 bg-gray-50'
                  }`}>
                    {viewMode === 'grid' ? (
                      <>
                        <div className="flex space-x-1">
                          <a 
                            href="#" 
                            className="text-xs bg-white text-green-600 px-2 py-1 rounded-md border border-green-200 hover:bg-green-50 transition-colors flex items-center"
                          >
                            <FaExternalLinkAlt className="mr-1" /> Details
                          </a>
                          
                          {item.hasInterview && (
                            <button 
                              onClick={() => startMockInterview(item)}
                              className="text-xs bg-white text-green-600 px-2 py-1 rounded-md border border-green-200 hover:bg-green-50 transition-colors flex items-center"
                            >
                              <FaMicrophone className="mr-1" /> Mock Interview
                            </button>
                          )}
                        </div>
                        
                        <div>
                          {item.stipend && <span className="text-xs text-gray-500">{item.stipend}</span>}
                          {item.salary && <span className="text-xs text-gray-500">{item.salary}</span>}
                          {item.amount && <span className="text-xs text-gray-500">{item.amount}</span>}
                          {item.fee && <span className="text-xs text-gray-500">{item.fee}</span>}
                        </div>
                      </>
                    ) : (
                      <>
                        <a 
                          href="#" 
                          className="text-sm bg-white text-green-600 px-3 py-1.5 rounded-md border border-green-200 hover:bg-green-50 transition-colors flex items-center justify-center"
                        >
                          <FaExternalLinkAlt className="mr-1" /> View Details
                        </a>
                        
                        {item.hasInterview && (
                          <button 
                            onClick={() => startMockInterview(item)}
                            className="text-sm bg-white text-green-600 px-3 py-1.5 rounded-md border border-green-200 hover:bg-green-50 transition-colors flex items-center justify-center"
                          >
                            <FaMicrophone className="mr-1" /> Mock Interview
                          </button>
                        )}
                        
                        <div className="text-center">
                          {item.stipend && <span className="text-xs text-gray-500">{item.stipend}</span>}
                          {item.salary && <span className="text-xs text-gray-500">{item.salary}</span>}
                          {item.amount && <span className="text-xs text-gray-500">{item.amount}</span>}
                          {item.fee && <span className="text-xs text-gray-500">{item.fee}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Success Stories Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white"
        >
          <h2 className="text-lg font-semibold mb-4">Success Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3 text-green-700 font-medium">
                  RK
                </div>
                <div>
                  <h3 className="font-medium text-white">Rajesh Kumar</h3>
                  <p className="text-xs text-green-100">From Jharkhand</p>
                </div>
              </div>
              <p className="text-sm text-green-100">
                "The scholarship I found through this platform helped me pursue my engineering degree. Now I work as a software developer in Bangalore."
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3 text-green-700 font-medium">
                  SP
                </div>
                <div>
                  <h3 className="font-medium text-white">Sunita Patel</h3>
                  <p className="text-xs text-green-100">From Gujarat</p>
                </div>
              </div>
              <p className="text-sm text-green-100">
                "The agricultural technology training changed how I manage our family farm. Our crop yield has increased by 40% in just one year."
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center mr-3 text-green-700 font-medium">
                  MR
                </div>
                <div>
                  <h3 className="font-medium text-white">Meena Reddy</h3>
                  <p className="text-xs text-green-100">From Andhra Pradesh</p>
                </div>
              </div>
              <p className="text-sm text-green-100">
                "The mock interview practice helped me prepare for my first job interview. I'm now working as a healthcare assistant in my village."
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Mock Interview Modal */}
        {showInterviewModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
            >
              {interviewStage === 'intro' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaUserTie className="mr-2 text-green-500" /> Mock Interview: {selectedJob.title}
                    </h2>
                    <button 
                      onClick={() => setShowInterviewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                    <p className="text-gray-700">
                      Practice your interview skills for this position with our AI interviewer. 
                      The system will generate relevant questions based on the job requirements.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">About the Position</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-start mb-3">
                          <div className={`rounded-full p-2 mr-3 flex-shrink-0 ${
                            selectedJob.type === 'jobs' ? 'bg-green-50 text-green-500' :
                            selectedJob.type === 'internships' ? 'bg-teal-50 text-teal-500' :
                            'bg-emerald-50 text-emerald-500'
                          }`}>
                            {selectedJob.type === 'jobs' && <FaBriefcase />}
                            {selectedJob.type === 'internships' && <MdWorkOutline />}
                            {selectedJob.type === 'scholarships' && <FaGraduationCap />}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-800">{selectedJob.title}</h4>
                            <p className="text-sm text-gray-500">{selectedJob.organization}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{selectedJob.description}</p>
                        
                        <div className="text-sm">
                          <p className="flex items-center text-gray-600 mb-1">
                            <FaMapMarkerAlt className="mr-2 text-gray-400" /> {selectedJob.location}
                          </p>
                          {selectedJob.salary && (
                            <p className="flex items-center text-gray-600 mb-1">
                              <FaRupeeSign className="mr-2 text-gray-400" /> {selectedJob.salary}
                            </p>
                          )}
                          {selectedJob.stipend && (
                            <p className="flex items-center text-gray-600 mb-1">
                              <FaRupeeSign className="mr-2 text-gray-400" /> {selectedJob.stipend}
                            </p>
                          )}
                        </div>

                        
                        
                        {selectedJob.skills && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Required Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedJob.skills.map((skill, index) => (
                                <span key={index} className="inline-block px-2 py-1 rounded-md text-xs bg-green-50 text-green-700">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-800 mb-3">Interview Tips</h3>
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            Speak clearly and at a moderate pace
                          </li>
                          <li className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            Use the STAR method (Situation, Task, Action, Result) for behavioral questions
                          </li>
                          <li className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            Maintain good posture and eye contact with the camera
                          </li>
                          <li className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            Prepare examples that highlight your skills relevant to the position
                          </li>
                          <li className="flex items-start">
                            <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                            You'll have 60 seconds to answer each question
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => generateInterviewQuestions()}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
                      <RiAiGenerate className="mr-2" /> Generate Interview Questions
                    </button>
                  </div>
                </div>
              )}
              
              {interviewStage === 'loading' && (
                <div className="p-6 flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Preparing your interview experience...</p>
                </div>
              )}
              
              {interviewStage === 'questions' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaUserTie className="mr-2 text-green-500" /> Interview Questions
                    </h2>
                    <button 
                      onClick={() => setShowInterviewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                    <p className="text-gray-700">
                      Our AI has generated the following questions based on the job requirements. 
                      When you're ready, click "Start Interview" to begin.
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Your Interview Questions:</h3>
                    <ol className="space-y-3 pl-5 list-decimal">
                      {interviewQuestions.map((question, index) => (
                        <li key={index} className="text-gray-700">{question}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Before You Begin:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        Ensure your camera and microphone are working properly
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        Find a quiet place with good lighting
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        You'll have 60 seconds to answer each question
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        The AI will guide you through each question
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => startInterview()}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                    >
                      <FaVideo className="mr-2" /> Start Interview
                    </button>
                  </div>
                </div>
              )}
              
              {interviewStage === 'interview' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <FaUserTie className="mr-2 text-green-500" /> Mock Interview
                    </h2>
                    <div className="flex items-center">
                      <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-1 rounded-md mr-2">
                        Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                      </span>
                      <button 
                        onClick={() => {
                          stopRecording();
                          cleanupMedia();
                          setShowInterviewModal(false);
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        ></video>
                        
                        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                          You (Live)
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center">
                          <div className="w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></div>
                          REC
                        </div>
                        
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                          {timer} seconds
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={handleNextQuestion}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                        >
                          {currentQuestionIndex < interviewQuestions.length - 1 ? (
                            <>
                              <FaArrowRight className="mr-2" /> Next Question
                            </>
                          ) : (
                            <>
                              <FaCheck className="mr-2" /> Complete Interview
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex flex-col">
                        <div className="flex items-start mb-4">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 text-green-600">
                            <FaRobot />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">AI Interviewer</h3>
                            <p className="text-xs text-gray-500">Virtual Interviewer</p>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className={`p-3 bg-green-50 rounded-lg mb-3 ${aiSpeaking ? 'border-2 border-green-300 animate-pulse' : 'border border-green-100'}`}>
                            <p className="text-gray-700">
                              {aiSpeaking ? (
                                <span className="flex items-center">
                                  <span className="mr-2">Speaking</span>
                                  <span className="flex space-x-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                  </span>
                                </span>
                              ) : (
                                interviewQuestions[currentQuestionIndex]
                              )}
                            </p>
                          </div>
                          
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-gray-700 text-sm">
                              <span className="font-medium">Tips:</span> Use specific examples from your experience. Structure your answer with a clear beginning, middle, and end.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {interviewStage === 'feedback' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Interview Feedback</h2>
                    <button 
                      onClick={() => setShowInterviewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-green-800 mb-4">Strengths</h3>
                      <ul className="space-y-2">
                        {interviewFeedback.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center text-green-700">
                            <FaCheck className="mr-2" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6">
                      <h3 className="text-lg font-medium text-amber-800 mb-4">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {interviewFeedback.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-center text-amber-700">
                            <FaArrowRight className="mr-2" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-800">Overall Performance</h3>
                      <div className="text-3xl font-bold text-purple-600">
                        {interviewFeedback.score}%
                      </div>
                    </div>
                    <p className="text-gray-600">{interviewFeedback.overall}</p>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setInterviewStage('intro');
                        setCurrentQuestionIndex(0);
                        setTimer(60);
                        setUserResponses([]);
                      }}
                      className="px-6 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 flex items-center"
                    >
                      <FaRedo className="mr-2" /> Try Again
                    </button>
                    <button
                      onClick={() => setShowInterviewModal(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentsTab;