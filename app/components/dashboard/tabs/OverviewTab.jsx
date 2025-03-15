'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaNetworkWired, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa';
import { BsAward, BsClockHistory, BsArrowUpRight, BsRobot, BsCalendarCheck, BsGraphUp , BsCalendarEvent, BsClock, BsGlobe, BsGeoAlt, BsStarFill } from 'react-icons/bs';
import { RiTranslate } from 'react-icons/ri';
import Image from 'next/image';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { 
  FaGraduationCap, 
  FaSchool,
  FaUserGraduate,
  FaHandsHelping
} from 'react-icons/fa';
import { MdAssignment, MdSchool } from 'react-icons/md';

const OverviewTab = () => {

  const [activeTimeframe, setActiveTimeframe] = useState('weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  
  // Google Maps API configuration
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCctB7XAC_6yKjVWFfVaSNW1qytfDkHt3A'
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.error(error)
      );
    }
  }, []);

  // Mock data for charts and stats
  const recentActivities = [
    {
      id: 1,
      title: 'New AI Learning Module',
      description: 'Added "Digital Financial Literacy" module in Hindi and Tamil',
      time: '2 hours ago',
      icon: <BsRobot className="text-blue-500" />
    },
    {
      id: 2,
      title: 'Student Milestone',
      description: 'Priya Sharma completed all modules in "Basic Computer Skills"',
      time: 'Yesterday',
      icon: <FaUsers className="text-green-500" />
    },
    {
      id: 3,
      title: 'Content Translation',
      description: 'Agricultural Science content translated to Bengali and Marathi',
      time: '2 days ago',
      icon: <RiTranslate className="text-purple-500" />
    },
    {
      id: 4,
      title: 'Assessment Created',
      description: 'New adaptive assessment for "Digital Banking" created',
      time: '3 days ago',
      icon: <FaChalkboardTeacher className="text-amber-500" />
    }
  ];

  // Chart data based on timeframe
  const chartData = {
    weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [120, 180, 150, 210, 190, 140, 220],
      total: 1210,
      change: '+12%'
    },
    monthly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      values: [850, 920, 980, 1050],
      total: 3800,
      change: '+8%'
    },
    yearly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      values: [3200, 3400, 3600, 3800, 4100, 4300, 4500, 4700, 4900, 5100, 5300, 5500],
      total: 52400,
      change: '+15%'
    }
  };

  // India village data for map
  const villageData = [
    { lat: 28.6139, lng: 77.2090, region: 'North India', intensity: 'high', type: 'School', name: 'Delhi Public School' }, 
    { lat: 19.0760, lng: 72.8777, region: 'West India', intensity: 'high', type: 'NGO', name: 'Mumbai Education Initiative' },  
    { lat: 12.9716, lng: 77.5946, region: 'South India', intensity: 'high', type: 'School', name: 'Bangalore Academy' }, 
    { lat: 22.5726, lng: 88.3639, region: 'East India', intensity: 'medium', type: 'NSS', name: 'Kolkata NSS Chapter' }, 
    { lat: 17.3850, lng: 78.4867, region: 'South India', intensity: 'medium', type: 'School', name: 'Hyderabad Grammar School' }, 
    { lat: 13.0827, lng: 80.2707, region: 'South India', intensity: 'medium', type: 'NGO', name: 'Chennai Rural Outreach' }, 
    { lat: 23.2599, lng: 77.4126, region: 'Central India', intensity: 'low', type: 'School', name: 'Bhopal Central School' }, 
    { lat: 26.9124, lng: 75.7873, region: 'North India', intensity: 'medium', type: 'NSS', name: 'Jaipur NSS Unit' }, 
    { lat: 25.5941, lng: 85.1376, region: 'East India', intensity: 'low', type: 'School', name: 'Patna Girls School' }, 
    { lat: 26.8467, lng: 80.9462, region: 'North India', intensity: 'low', type: 'NGO', name: 'Lucknow Rural Education Trust' }, 
    { lat: 21.1458, lng: 79.0882, region: 'Central India', intensity: 'medium', type: 'School', name: 'Nagpur International School' }, 
    { lat: 30.7333, lng: 76.7794, region: 'North India', intensity: 'low', type: 'NSS', name: 'Chandigarh NSS Community' }, 
  ];

  const getCircleOptions = (intensity) => {
    const options = {
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0.35,
    };
    
    switch(intensity) {
      case 'high':
        return { ...options, strokeColor: '#10b981', fillColor: '#10b981', radius: 50000 };
      case 'medium':
        return { ...options, strokeColor: '#3b82f6', fillColor: '#3b82f6', radius: 40000 };
      case 'low':
        return { ...options, strokeColor: '#9ca3af', fillColor: '#9ca3af', radius: 30000 };
      default:
        return { ...options, strokeColor: '#9ca3af', fillColor: '#9ca3af', radius: 30000 };
    }
  };

  // Learning statistics instead of total students
  const learningStats = [
    {
      icon: <BsClockHistory className="text-purple-600 text-2xl" />,
      title: "Learning Hours",
      value: "2,847",
      change: "+12.5%",
      bgGradient: "from-purple-500/20 to-purple-500/5"
    },
    {
      icon: <MdAssignment className="text-blue-600 text-2xl" />,
      title: "Assessments Taken",
      value: "1,238",
      change: "+18.2%",
      bgGradient: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: <BsAward className="text-green-600 text-2xl" />,
      title: "Modules Completed",
      value: "456",
      change: "+15.7%",
      bgGradient: "from-green-500/20 to-green-500/5"
    },
    {
      icon: <FaUserGraduate className="text-amber-600 text-2xl" />,
      title: "Certifications Earned",
      value: "324",
      change: "+21.3%",
      bgGradient: "from-amber-500/20 to-amber-500/5"
    }
  ];

  // Nearby educational communities
  const nearbyCommunities = [
    {
      type: "NGO",
      name: "Digital Empowerment Foundation",
      distance: "1.2 km",
      programs: 12,
      icon: <FaHandsHelping className="text-green-600" />
    },
    {
      type: "NSS",
      name: "Delhi University NSS Unit",
      distance: "2.5 km",
      programs: 8,
      icon: <FaSchool className="text-blue-600" />
    },
    {
      type: "School",
      name: "Government Senior Secondary School",
      distance: "3.1 km",
      programs: 15,
      icon: <MdSchool className="text-purple-600" />
    }
  ];

  // Upcoming opportunities
  const upcomingOpportunities = [
    {
      title: "Digital Literacy Workshop",
      organizer: "Tech For Change NGO",
      date: "Next Week",
      type: "Workshop",
      status: "Accepting Applications",
      color: "green"
    },
    {
      title: "Rural Education Drive",
      organizer: "NSS Delhi Chapter",
      date: "In 2 Weeks",
      type: "Volunteer",
      status: "Planning Phase",
      color: "blue"
    },
    {
      title: "Computer Skills Training",
      organizer: "Local Community Center",
      date: "This Month",
      type: "Training",
      status: "Spots Available",
      color: "purple"
    }
  ];

  return (
    <div className="p-6 bg-gray-50">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Dashboard Overview
      </motion.h1>
      
      {/* Stats Overview - Updated with glassy UI */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        {learningStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.bgGradient} p-6 rounded-xl border border-gray-100 backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <BsGraphUp className="mr-1" />
                  {stat.change}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/80 backdrop-blur-sm">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Usage Chart */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-green-500" /> Learning Activity
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTimeframe('weekly')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeTimeframe === 'weekly' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => setActiveTimeframe('monthly')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeTimeframe === 'monthly' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setActiveTimeframe('yearly')}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    activeTimeframe === 'yearly' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            
            {/* Beautiful chart visualization with glassy effect */}
            <div className="h-64 rounded-lg relative overflow-hidden bg-gray-50/30">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <>
                  <div className="absolute bottom-0 left-0 right-0 h-full flex items-end px-4 pt-10 pb-6">
                    {chartData[activeTimeframe].values.map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div 
                          className="w-full max-w-[30px] bg-gradient-to-t from-green-500/90 to-blue-500/90 rounded-t-md mx-1 backdrop-blur-sm shadow-lg transition-all duration-500 ease-out"
                          style={{ 
                            height: `${(value / Math.max(...chartData[activeTimeframe].values)) * 70}%`,
                          }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2">{chartData[activeTimeframe].labels[index]}</div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-md backdrop-blur-sm border border-gray-100 shadow-sm">
                    <div className="text-xs text-gray-500">Total Hours</div>
                    <div className="text-lg font-bold text-gray-800">{chartData[activeTimeframe].total}</div>
                    <div className="text-xs text-green-500 flex items-center">
                      <BsArrowUpRight className="mr-1" /> {chartData[activeTimeframe].change} growth
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Stats cards row */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-center p-4 rounded-lg bg-blue-50/80 backdrop-blur-sm border border-blue-100 hover:shadow-md transition-all hover:bg-blue-50/90"
              >
                <div className="text-sm font-medium text-gray-700">AI Learning</div>
                <div className="text-xl font-semibold text-gray-800 mt-1">4,256 hrs</div>
                <div className="text-xs text-green-500 mt-1 flex items-center justify-center">
                  <BsArrowUpRight className="mr-1" /> 12%
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-center p-4 rounded-lg bg-green-50/80 backdrop-blur-sm border border-green-100 hover:shadow-md transition-all hover:bg-green-50/90"
              >
                <div className="text-sm font-medium text-gray-700">Regional</div>
                <div className="text-xl font-semibold text-gray-800 mt-1">3,158 hrs</div>
                <div className="text-xs text-green-500 mt-1 flex items-center justify-center">
                  <BsArrowUpRight className="mr-1" /> 8%
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-center p-4 rounded-lg bg-purple-50/80 backdrop-blur-sm border border-purple-100 hover:shadow-md transition-all hover:bg-purple-50/90"
              >
                <div className="text-sm font-medium text-gray-700">Assessments</div>
                <div className="text-xl font-semibold text-gray-800 mt-1">2,845 hrs</div>
                <div className="text-xs text-green-500 mt-1 flex items-center justify-center">
                  <BsArrowUpRight className="mr-1" /> 15%
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-center p-4 rounded-lg bg-amber-50/80 backdrop-blur-sm border border-amber-100 hover:shadow-md transition-all hover:bg-amber-50/90"
              >
                <div className="text-sm font-medium text-gray-700">Audio</div>
                <div className="text-xl font-semibold text-gray-800 mt-1">2,227 hrs</div>
                <div className="text-xs text-green-500 mt-1 flex items-center justify-center">
                  <BsArrowUpRight className="mr-1" /> 24%
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Popular Content with glassy effect */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Popular Content</h2>
              <button className="text-sm text-green-600 hover:text-green-700">View All</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <BsRobot className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">Digital Financial Literacy</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>AI Learning</span>
                    <span className="mx-2">•</span>
                    <span>4 languages</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">1,245</div>
                  <div className="text-xs text-gray-500">students</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                  <FaNetworkWired className="text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">Basic Computer Skills</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>Audio Story</span>
                    <span className="mx-2">•</span>
                    <span>6 languages</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">986</div>
                  <div className="text-xs text-gray-500">students</div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50/80 backdrop-blur-sm rounded-lg border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4">
                  <RiTranslate className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-800">Agricultural Science</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span>Regional Content</span>
                    <span className="mx-2">•</span>
                    <span>8 languages</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">845</div>
                  <div className="text-xs text-gray-500">students</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right Column with glassy effect */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg hover:bg-blue-100 transition-colors text-center">
                <BsRobot className="text-blue-600 text-xl mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-700">Create AI Module</span>
              </button>
              <button className="p-3 bg-green-50/80 backdrop-blur-sm rounded-lg hover:bg-green-100 transition-colors text-center">
                <FaUsers className="text-green-600 text-xl mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-700">Add Student</span>
              </button>
              <button className="p-3 bg-purple-50/80 backdrop-blur-sm rounded-lg hover:bg-purple-100 transition-colors text-center">
                <RiTranslate className="text-purple-600 text-xl mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-700">Translate Content</span>
              </button>
              <button className="p-3 bg-amber-50/80 backdrop-blur-sm rounded-lg hover:bg-amber-100 transition-colors text-center">
                <FaChalkboardTeacher className="text-amber-600 text-xl mx-auto mb-2" />
                <span className="text-xs font-medium text-gray-700">New Assessment</span>
              </button>
            </div>
          </div>
          
          {/* Recent Activity with glassy effect */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex p-3 bg-gray-50/60 backdrop-blur-sm rounded-lg border border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">{activity.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-center text-green-600 hover:text-green-700 bg-green-50/60 py-2 rounded-lg backdrop-blur-sm border border-green-100">
              View All Activity
            </button>
          </div>
 
        </motion.div>
      </div>

      {/* Interactive Learning Map with Google Maps */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-6"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              <FaChartPie className="mr-2 text-green-500" /> Village Learning Map
            </h2>
            <div className="flex space-x-2">
              <select className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white/90 backdrop-blur-sm">
                <option>All Regions</option>
                <option>North India</option>
                <option>South India</option>
                <option>East India</option>
                <option>West India</option>
                <option>Central India</option>
              </select>
            </div>
          </div>
          
          {/* Google Maps Integration */}
          <div className="h-96 rounded-lg relative overflow-hidden border border-gray-100">
            {!isLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '0.5rem'
                }}
                center={{ lat: 22.5726, lng: 78.9629 }} // Center of India
                zoom={5}
                options={{
                  styles: [
                    {
                      featureType: "administrative",
                      elementType: "geometry",
                      stylers: [{ visibility: "simplified" }]
                    },
                    {
                      featureType: "water",
                      elementType: "geometry",
                      stylers: [{ color: "#e9f5f8" }]
                    },
                    {
                      featureType: "landscape",
                      elementType: "geometry",
                      stylers: [{ color: "#f5f8f4" }]
                    }
                  ],
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {villageData.map((village, index) => (
                  <React.Fragment key={index}>
                    <Marker
                      position={{ lat: village.lat, lng: village.lng }}
                      icon={{
                        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                        fillColor: village.intensity === 'high' ? '#10b981' : village.intensity === 'medium' ? '#3b82f6' : '#9ca3af',
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: '#ffffff',
                        scale: 1.5,
                        anchor: { x: 12, y: 22 },
                      }}
                    />
                    <Circle
                      center={{ lat: village.lat, lng: village.lng }}
                      options={getCircleOptions(village.intensity)}
                    />
                  </React.Fragment>
                ))}
              </GoogleMap>
            )}
            
            {/* Overlay Stats */}
            <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg shadow-sm backdrop-blur-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-500">Total Reach</div>
              <div className="text-lg font-bold text-gray-800">12,845 villages</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <BsArrowUpRight className="mr-1" /> 18% from last quarter
              </div>
            </div>
            
            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-sm backdrop-blur-sm border border-gray-100">
              <div className="text-xs font-medium text-gray-800 mb-2">Program Intensity</div>
              <div className="flex items-center space-y-1 flex-col">
                <div className="flex items-center w-full">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-600">High Engagement</span>
                </div>
                <div className="flex items-center w-full">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-600">Medium Engagement</span>
                </div>
                <div className="flex items-center w-full">
                  <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                  <span className="text-xs text-gray-600">Low Engagement</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Row with glassy effect */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-100">
              <div className="text-sm font-medium text-gray-700">North India</div>
              <div className="text-lg font-semibold text-gray-800 mt-1">3,245</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <BsArrowUpRight className="mr-1" /> 12% growth
              </div>
            </div>
            <div className="p-3 bg-green-50/80 backdrop-blur-sm rounded-lg border border-green-100">
              <div className="text-sm font-medium text-gray-700">South India</div>
              <div className="text-lg font-semibold text-gray-800 mt-1">4,128</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <BsArrowUpRight className="mr-1" /> 15% growth
              </div>
            </div>
            <div className="p-3 bg-purple-50/80 backdrop-blur-sm rounded-lg border border-purple-100">
              <div className="text-sm font-medium text-gray-700">East India</div>
              <div className="text-lg font-semibold text-gray-800 mt-1">2,845</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <BsArrowUpRight className="mr-1" /> 8% growth
              </div>
            </div>
            <div className="p-3 bg-amber-50/80 backdrop-blur-sm rounded-lg border border-amber-100">
              <div className="text-sm font-medium text-gray-700">West India</div>
              <div className="text-lg font-semibold text-gray-800 mt-1">2,627</div>
              <div className="text-xs text-green-500 mt-1 flex items-center">
                <BsArrowUpRight className="mr-1" /> 10% growth
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Upcoming Opportunities with glassy effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Opportunities</h2>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/80 backdrop-blur-sm">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opportunity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eligibility
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/80 backdrop-blur-sm divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Rural Digital Skills Scholarship</div>
                    <div className="text-xs text-gray-500">Ministry of Electronics & IT</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Scholarship
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rural students, Age 16-22
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-500 font-medium">5 days left</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">View Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Women in Tech Workshop</div>
                    <div className="text-xs text-gray-500">Google India</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Workshop
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Female students, Any age
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-amber-500 font-medium">2 weeks left</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">View Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Agricultural Innovation Grant</div>
                    <div className="text-xs text-gray-500">Ministry of Agriculture</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      Grant
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rural farmers, Any age
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-gray-500 font-medium">1 month left</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-green-600 hover:text-green-900">View Details</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-3 flex justify-center">
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center">
              View All Opportunities
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
      

      {/* Footer with call-to-action */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="mt-8 mb-6 text-center"
      >
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ready to expand your impact?</h2>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Create new learning modules, translate content to more languages, or connect with rural communities through our platform.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <BsRobot className="mr-2" /> Create New Module
            </button>
            <button className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center">
              <RiTranslate className="mr-2" /> Translate Content
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverviewTab;