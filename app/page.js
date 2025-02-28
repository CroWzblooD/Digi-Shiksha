'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheckIcon, 
  MicrophoneIcon, 
  BellAlertIcon, 
  UserGroupIcon, 
  MapIcon, 
  BookOpenIcon,
  HeartIcon,
  GlobeAsiaAustraliaIcon,
  PhoneIcon,
  ChatBubbleBottomCenterTextIcon,
  LightBulbIcon,
  DocumentTextIcon,
  HandRaisedIcon,
  FingerPrintIcon,
  Bars3Icon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  ChevronRightIcon,
  HomeIcon,
  HandRaisedIconSolid,
  ArrowPathIcon,
  BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import { 
  ShieldCheckIcon as ShieldCheckIconSolid, 
  BellAlertIcon as BellAlertIconSolid, 
  UserGroupIcon as UserGroupIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

// Google Maps integration
import { GoogleMap, LoadScript, Marker, Circle, Polyline, InfoWindow } from '@react-google-maps/api';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapType, setMapType] = useState('roadmap');
  const [showSafeRoute, setShowSafeRoute] = useState(false);
  const [mobileMapExpanded, setMobileMapExpanded] = useState(false);
  
  const missionRef = useRef(null);
  const realityRef = useRef(null);
  const mapRef = useRef(null);
  const GOOGLE_PLACES_API_KEY = 'AIzaSyCctB7XAC_6yKjVWFfVaSNW1qytfDkHt3A';

  // Stats with more detailed information
  const realityStats = [
    {
      icon: <ExclamationTriangleIcon className="w-16 h-16 text-red-500" />,
      stat: "81%",
      text: "Women Face Harassment in Public",
      detail: "According to a national survey, 81% of women in urban areas have faced some form of public harassment, with 68% reporting multiple incidents.",
      color: "from-red-500/20 to-red-500/5"
    },
    {
      icon: <ClockIcon className="w-16 h-16 text-amber-500" />,
      stat: "33 min",
      text: "Average Emergency Response Time",
      detail: "Emergency services take an average of 33 minutes to respond to women's safety incidents in metropolitan cities, with rural areas facing even longer delays.",
      color: "from-amber-500/20 to-amber-500/5"
    },
    {
      icon: <BellAlertIconSolid className="w-16 h-16 text-blue-500" />,
      stat: "Only 8%",
      text: "Cases Actually Reported",
      detail: "Due to social stigma, lack of trust in the system, and fear of retaliation, only about 8% of harassment cases are formally reported to authorities.",
      color: "from-blue-500/20 to-blue-500/5"
    },
    {
      icon: <UserGroupIconSolid className="w-16 h-16 text-purple-500" />,
      stat: "92%",
      text: "Women Feel Safer With Community",
      detail: "Studies show that 92% of women report feeling significantly safer when connected to a trusted community network with real-time support systems.",
      color: "from-purple-500/20 to-purple-500/5"
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check if sections are visible for animations
      if (missionRef.current) {
        const rect = missionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Auto-rotate stats
    const intervalId = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % realityStats.length);
    }, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, [realityStats.length]);

  // Map center for Delhi, India (updated from Bangalore)
  const mapCenter = {
    lat: 28.6139,
    lng: 77.2090
  };

  const mapStyles = {
    height: mobileMapExpanded ? '80vh' : '400px',
    width: '100%',
    borderRadius: '1rem',
    transition: 'height 0.3s ease-in-out'
  };

  // Safe and danger zones for Delhi (updated)
  const safeZones = [
    { lat: 28.6139, lng: 77.2090, radius: 800, name: "Connaught Place", rating: "High" }, // Central Delhi
    { lat: 28.5494, lng: 77.2001, radius: 600, name: "Saket", rating: "High" }, // South Delhi
    { lat: 28.5623, lng: 77.2373, radius: 700, name: "Defence Colony", rating: "Very High" }, // South Delhi
    { lat: 28.5362, lng: 77.2410, radius: 500, name: "Greater Kailash", rating: "High" }, // South Delhi
    { lat: 28.6304, lng: 77.2177, radius: 400, name: "Karol Bagh", rating: "Medium" }, // Central Delhi
    { lat: 28.6262, lng: 77.0974, radius: 600, name: "Rajouri Garden", rating: "Medium" }, // West Delhi
    { lat: 28.6181, lng: 77.2858, radius: 500, name: "Laxmi Nagar", rating: "Medium" }, // East Delhi
  ];

  const dangerZones = [
    { lat: 28.6696, lng: 77.2152, radius: 400, name: "Kashmere Gate", desc: "Poorly lit after dark" },  // North Delhi
    { lat: 28.6129, lng: 77.2295, radius: 300, name: "New Delhi Railway Station", desc: "Crowded, reports of theft" },  // Central Delhi
    { lat: 28.5830, lng: 77.3178, radius: 450, name: "Ghazipur", desc: "Isolated areas at night" },  // East Delhi
    { lat: 28.7041, lng: 77.1025, radius: 350, name: "Rohini", desc: "Limited patrol presence" }, // Northwest Delhi
    { lat: 28.5585, lng: 77.1350, radius: 350, name: "Mahipalpur", desc: "Limited street lighting" }, // Southwest Delhi
  ];

  // Police stations
  const policeStations = [
    { lat: 28.6129, lng: 77.2273, name: "Connaught Place Police Station" },
    { lat: 28.5400, lng: 77.2200, name: "Greater Kailash Police Station" },
    { lat: 28.6380, lng: 77.2190, name: "Karol Bagh Police Station" },
    { lat: 28.6529, lng: 77.2370, name: "Civil Lines Police Station" },
    { lat: 28.6406, lng: 77.0997, name: "Rajouri Garden Police Station" },
    { lat: 28.5672, lng: 77.2410, name: "Defence Colony Police Station" },
  ];
  
  // Popular destinations
  const popularDestinations = [
    { lat: 28.6129, lng: 77.2295, name: "New Delhi Railway Station" },
    { lat: 28.5562, lng: 77.1000, name: "Indira Gandhi International Airport" },
    { lat: 28.6024, lng: 77.2145, name: "India Gate" },
    { lat: 28.6542, lng: 77.2373, name: "Delhi University North Campus" },
    { lat: 28.5913, lng: 77.2219, name: "Jantar Mantar" },
  ];
  
  // Safe route path (simulated route from CP to Defence Colony)
  const safeRoutePath = [
    { lat: 28.6139, lng: 77.2090 }, // Start: Connaught Place
    { lat: 28.6129, lng: 77.2200 }, 
    { lat: 28.6100, lng: 77.2250 },
    { lat: 28.6000, lng: 77.2300 },
    { lat: 28.5900, lng: 77.2350 },
    { lat: 28.5800, lng: 77.2380 },
    { lat: 28.5700, lng: 77.2373 },
    { lat: 28.5623, lng: 77.2373 }  // End: Defence Colony
  ];
  
  // Alternative route - less safe but shorter
  const alternativeRoutePath = [
    { lat: 28.6139, lng: 77.2090 }, // Start: Connaught Place
    { lat: 28.6100, lng: 77.2150 },
    { lat: 28.6000, lng: 77.2200 },
    { lat: 28.5900, lng: 77.2250 },
    { lat: 28.5800, lng: 77.2300 },
    { lat: 28.5700, lng: 77.2350 },
    { lat: 28.5623, lng: 77.2373 }  // End: Defence Colony
  ];

  const toggleSafeRoute = () => {
    setShowSafeRoute(!showSafeRoute);
  };

  const toggleMapExpansion = () => {
    setMobileMapExpanded(!mobileMapExpanded);
  };

  return (
    <>
      {/* Navbar - Transparent initially, solid on scroll */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrollPosition > 50 ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <ShieldCheckIconSolid className={`h-8 w-8 mr-2 ${scrollPosition > 50 ? 'text-[#FF1493]' : 'text-white'}`} />
              <span className={`text-2xl md:text-3xl font-bold font-poppins ${scrollPosition > 50 ? 'text-[#FF1493]' : 'text-white'}`}>
                SafeStreet
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Features', href: '#features' },
                { name: 'Community', href: '#community' },
                { name: 'How It Works', href: '#how-it-works' },
                { name: 'Testimonials', href: '#testimonials' }
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-medium hover:opacity-75 transition font-poppins ${scrollPosition > 50 ? 'text-gray-700' : 'text-white'}`}
                >
                  {item.name}
                </a>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF1493] text-white px-6 py-2 rounded-full font-medium hover:bg-[#FF69B4] transition shadow-md font-poppins flex items-center"
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Get Started
              </motion.button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-2xl" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <XMarkIcon className={`w-8 h-8 ${scrollPosition > 50 ? 'text-[#FF1493]' : 'text-white'}`} /> : 
                <Bars3Icon className={`w-8 h-8 ${scrollPosition > 50 ? 'text-[#FF1493]' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col space-y-4">
                  {[
                    { name: 'Home', href: '#home', icon: <HomeIcon className="w-5 h-5 mr-2" /> },
                    { name: 'Features', href: '#features', icon: <StarIconSolid className="w-5 h-5 mr-2" /> },
                    { name: 'Community', href: '#community', icon: <UserGroupIcon className="w-5 h-5 mr-2" /> },
                    { name: 'How It Works', href: '#how-it-works', icon: <DocumentTextIcon className="w-5 h-5 mr-2" /> },
                    { name: 'Testimonials', href: '#testimonials', icon: <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" /> }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 font-medium py-2 hover:text-[#FF1493] transition flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      {item.name}
                    </a>
                  ))}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#FF1493] text-white px-6 py-3 rounded-full font-medium hover:bg-[#FF69B4] transition shadow-md flex items-center justify-center"
                  >
                    <ShieldCheckIcon className="w-5 h-5 mr-2" />
                    Get Started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="min-h-screen bg-gradient-to-b from-[#FFF0F5] to-white font-poppins">
        {/* Enhanced Hero Section with animated elements and interactive components */}
        <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
          {/* Video or animated background - simulated with gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493] to-[#9932CC] overflow-hidden">
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Animated particles effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-white/20 w-6 h-6 backdrop-blur-sm"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, Math.random() * -100, 0],
                    opacity: [0.1, 0.3, 0.1],
                    scale: [1, Math.random() + 0.5, 1],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 10 + Math.random() * 20,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            
            {/* Animated wave effect at bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                <path fill="white" fillOpacity="0.1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,229.3C672,256,768,288,864,277.3C960,267,1056,213,1152,186.7C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 py-32 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-white"
              >
                <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <ShieldCheckIconSolid className="w-5 h-5 mr-2 text-[#FF1493]" />
                  <span className="text-sm font-medium">Women's Safety Initiative</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-poppins">
                  Your Safety Companion
                </h1>
                <p className="text-xl md:text-2xl mb-8 leading-relaxed max-w-xl">
                  Advanced technology and community support for women's personal safety. 
                  Navigate with confidence, day and night.
                </p>
                
                {/* Interactive stats ticker */}
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Safety Impact</h3>
                    <div className="flex gap-2">
                      {realityStats.map((_, i) => (
                        <button 
                          key={i}
                          className={`w-2 h-2 rounded-full ${i === activeStatIndex ? 'bg-[#FF1493]' : 'bg-white/30'}`}
                          onClick={() => setActiveStatIndex(i)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStatIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-4"
                    >
                      <div className="text-4xl font-bold text-[#FF1493]">
                        {realityStats[activeStatIndex].stat}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-white/70">
                          {realityStats[activeStatIndex].text}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#FF1493] px-8 sm:px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition flex items-center justify-center"
                  >
                    <ShieldCheckIconSolid className="w-5 h-5 mr-2" />
                    Join SafeStreet
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center justify-center"
                  >
                    <DocumentTextIcon className="w-5 h-5 mr-2" />
                    How It Works
                  </motion.button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block"
              >
                {/* Interactive app mockup */}
                <div className="relative mx-auto max-w-sm">
                  <div className="relative z-10 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-3 shadow-2xl ring-1 ring-gray-800">
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20" />
                    <div className="bg-gradient-to-br from-white to-pink-50 rounded-[2.5rem] overflow-hidden h-[580px]">
                      {/* App Screen Content */}
                      <div className="h-full flex flex-col">
                        {/* App Header */}
                        <div className="bg-gradient-to-r from-[#FF1493] to-[#9932CC] px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <ShieldCheckIconSolid className="w-6 h-6 text-white mr-2" />
                            <span className="text-white font-semibold">SafeStreet</span>
                          </div>
                          <div className="bg-white/20 p-2 rounded-full">
                            <BellAlertIconSolid className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        
                        {/* App Content */}
                        <div className="flex-1 p-4 overflow-hidden">
                          {/* Map preview */}
                          <div className="bg-blue-100 rounded-lg h-40 mb-4 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-200 opacity-50">
                              {/* Simple map illustration */}
                              <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-green-200 opacity-70" />
                              <div className="absolute bottom-1/3 right-1/3 w-12 h-12 rounded-full bg-red-200 opacity-70" />
                              <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-green-200 opacity-70" />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-8 w-8 bg-[#FF1493] rounded-full flex items-center justify-center animate-pulse">
                                <div className="h-3 w-3 bg-white rounded-full" />
                              </div>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white rounded-lg shadow p-2">
                              <MapIcon className="w-6 h-6 text-gray-500" />
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            {[
                              { icon: <BellAlertIconSolid className="w-6 h-6 text-white" />, label: "SOS", color: "bg-red-500" },
                              { icon: <ShieldCheckIconSolid className="w-6 h-6 text-white" />, label: "Safe Route", color: "bg-green-500" },
                              { icon: <PhoneIcon className="w-6 h-6 text-white" />, label: "Call", color: "bg-blue-500" }
                            ].map((action, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`${action.color} rounded-xl p-3 flex flex-col items-center justify-center`}
                              >
                                <div className="mb-1">{action.icon}</div>
                                <div className="text-xs text-white font-semibold">{action.label}</div>
                              </motion.div>
                            ))}
                          </div>
                          
                          {/* Guardian Status */}
                          <div className="bg-gray-100 rounded-xl p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="font-semibold text-gray-800">Guardians Nearby</h3>
                              <span className="text-green-500 text-xs font-medium bg-green-100 px-2 py-1 rounded-full">5 Active</span>
                            </div>
                            <div className="flex -space-x-2">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                                  {String.fromCharCode(65 + i)}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Safety Tips */}
                          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <div className="bg-white p-2 rounded-lg">
                                <LightBulbIcon className="w-6 h-6 text-amber-500" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800 mb-1">Safety Tip</h3>
                                <p className="text-xs text-gray-600">Share your live location with trusted contacts when traveling at night.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* App Nav */}
                        <div className="px-4 py-3 bg-white border-t border-gray-200 flex justify-around">
                          {[
                            { icon: <HomeIcon className="w-6 h-6" />, active: true },
                            { icon: <MapIcon className="w-6 h-6" /> },
                            { icon: <UserGroupIcon className="w-6 h-6" /> },
                            { icon: <ChatBubbleBottomCenterTextIcon className="w-6 h-6" /> },
                          ].map((item, i) => (
                            <div 
                              key={i} 
                              className={`p-2 rounded-full ${item.active ? 'text-[#FF1493] bg-pink-100' : 'text-gray-400'}`}
                            >
                              {item.icon}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-pink-300 rounded-full blur-xl opacity-30" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-300 rounded-full blur-xl opacity-30" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
         {/* Enhanced Mission Section with interactive elements and visuals */}
         <section ref={missionRef} className="py-32 bg-white relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-pink-100 opacity-70" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-purple-100 opacity-70" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <motion.div 
                className="lg:col-span-5"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  {/* Main image */}
                  <div className="bg-gradient-to-br from-[#FF1493] to-[#9932CC] rounded-3xl overflow-hidden shadow-2xl">
                    <div className="aspect-[4/5] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Image placeholder with illustration */}
                        <div className="text-white flex flex-col items-center justify-center p-8 text-center">
                          <HeartIconSolid className="w-24 h-24 mb-6 text-white/90" />
                          <h3 className="text-2xl font-bold mb-4">Women Supporting Women</h3>
                          <p className="text-white/80">Building a community of care, support and safety for every woman.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating stats cards */}
                  <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 max-w-[180px]">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-lg mr-3">
                        <UserGroupIconSolid className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">10K+</div>
                        <div className="text-xs text-gray-500">Active Guardians</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 max-w-[180px]">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <MapIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800">20+</div>
                        <div className="text-xs text-gray-500">Cities Covered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:col-span-7"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="inline-block px-4 py-2 bg-pink-100 rounded-full mb-6">
                  <div className="flex items-center">
                    <HeartIconSolid className="w-5 h-5 text-[#FF1493] mr-2" />
                    <span className="text-sm font-medium text-[#FF1493]">Our Purpose</span>
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800 font-montserrat leading-tight">
                  Empowering Women Through Technology & Community
                </h2>
                
                <div className="prose prose-lg text-gray-600 mb-8 max-w-3xl">
                  <p>
                    At SafeStreet, we believe that safety is a fundamental right. Our mission is to combine advanced technology with the power of community to create a world where women can move freely without fear.
                  </p>
                  <p>
                    We're building more than an app – we're creating a movement that drives real change in how women navigate their daily lives and respond to threatening situations.
                  </p>
                </div>
                 {/* Mission pillars */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-black">
                  {[
                    {
                      icon: <ShieldCheckIconSolid className="w-10 h-10 text-pink-600" />,
                      title: "Immediate Response",
                      description: "Reducing emergency response time from 30+ minutes to under 5 minutes through our guardian network"
                    },
                    {
                      icon: <GlobeAsiaAustraliaIcon className="w-10 h-10 text-purple-600" />,
                      title: "Accessible Protection",
                      description: "Available in 8 regional languages with offline capabilities for all women regardless of location"
                    },
                    {
                      icon: <UserGroupIconSolid className="w-10 h-10 text-blue-600" />,
                      title: "Community Support",
                      description: "Building networks of verified guardians who can provide immediate physical assistance"
                    },
                    {
                      icon: <HandRaisedIcon className="w-10 h-10 text-amber-600" />,
                      title: "Preventive Education",
                      description: "Empowering women with safety workshops, self-defense training, and community awareness programs"
                    },
                  ].map((pillar, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-white rounded-full p-2 shadow-lg">{pillar.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{pillar.title}</h3>
                        <p className="text-gray-600">{pillar.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Map Section - New Addition */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <div className="inline-block p-4 rounded-full bg-blue-100 mb-8">
                <MapIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-4xl font-bold mb-6 text-gray-800 font-montserrat">SafeStreet Map</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Real-time safety zones and navigation to keep you secure wherever you go.
              </p>
            </motion.div>

            <div className="rounded-2xl overflow-hidden shadow-xl">
              <LoadScript googleMapsApiKey={GOOGLE_PLACES_API_KEY}>
                <GoogleMap
                  mapContainerStyle={mapStyles}
                  zoom={12}
                  center={mapCenter}
                  ref={mapRef}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "labels.text.fill",
                        stylers: [{ color: "#7c93a3" }, { lightness: "-10" }]
                      },
                      {
                        featureType: "administrative.country",
                        elementType: "geometry",
                        stylers: [{ visibility: "on" }]
                      },
                      {
                        featureType: "administrative.province",
                        elementType: "geometry.stroke",
                        stylers: [{ color: "#ffffff" }, { visibility: "on" }, { weight: 1 }]
                      }
                    ]
                  }}
                >
                  {/* Current user location */}
                  <Marker
                    position={mapCenter}
                    icon={{
                      url: '/api/placeholder/48/48',
                      scaledSize: { width: 48, height: 48 }
                    }}
                  />

                  {/* Safe zones */}
                  {safeZones.map((zone, index) => (
                    <Circle
                      key={`safe-${index}`}
                      center={zone}
                      radius={zone.radius}
                      options={{
                        strokeColor: '#4CAF50',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#4CAF50',
                        fillOpacity: 0.2,
                      }}
                    />
                  ))}

                  {/* Danger zones */}
                  {dangerZones.map((zone, index) => (
                    <Circle
                      key={`danger-${index}`}
                      center={zone}
                      radius={zone.radius}
                      options={{
                        strokeColor: '#F44336',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#F44336',
                        fillOpacity: 0.2,
                      }}
                    />
                  ))}
                </GoogleMap>
              </LoadScript>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-black">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Safe Zones</h3>
                  <p className="text-gray-600">Areas with high safety ratings from our community and verified through police data.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Caution Areas</h3>
                  <p className="text-gray-600">Locations with reported incidents that require extra vigilance and caution.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Improved with icons and design */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-pink-50 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center mb-6 text-gray-800 font-montserrat"
            >
              Key Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
            >
              Innovative technology designed for women's safety
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <ShieldCheckIconSolid className="w-12 h-12 text-[#FF1493]" />,
                  title: "AI Protection",
                  description: "Real-time safety alerts and smart route planning to keep you secure wherever you go",
                  color: "pink"
                },
                {
                  icon: <MicrophoneIcon className="w-12 h-12 text-purple-600" />,
                  title: "Voice Assistant",
                  description: "Multilingual support with offline capabilities for immediate help in any situation",
                  color: "purple"
                },
                {
                  icon: <BellAlertIconSolid className="w-12 h-12 text-teal-600" />,
                  title: "Smart SOS",
                  description: "Quick emergency response system that contacts authorities and trusted contacts with one tap",
                  color: "teal"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03, y: -10 }}
                  className="feature-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-pink-100 to-purple-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 font-montserrat">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Features - Enhanced with better icons and design */}
        <section id="community" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-6 text-gray-800 font-montserrat"
            >
              Community Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
            >
              Stronger together with our network of support
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <UserGroupIconSolid className="w-12 h-12 text-blue-600" />,
                  title: "Guardian Network",
                  description: "Connect with verified users nearby for immediate assistance when needed"
                },
                {
                  icon: <MapIcon className="w-12 h-12 text-green-600" />,
                  title: "Safe Routes",
                  description: "Crowd-sourced safety navigation that helps you avoid potentially dangerous areas"
                },
                {
                  icon: <BookOpenIcon className="w-12 h-12 text-amber-600" />,
                  title: "Legal Resources",
                  description: "Instant access to rights information and legal assistance when you need it most"
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg border border-gray-100"
                >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-blue-100 to-green-100">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 font-montserrat">{feature.title}</h3>
                  <p className="text-gray-600 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced with connecting arrows */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-pink-50">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-6 text-gray-800 font-montserrat"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
            >
              Simple steps to get started and stay protected
            </motion.p>
            
            <div className="relative">
              <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-pink-200 via-purple-200 to-pink-200 z-0"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10 text-black">
                {[
                  { 
                    icon: <PhoneIcon className="w-10 h-10 text-pink-600" />, 
                    title: "Download App", 
                    description: "Available in multiple languages on all platforms" 
                  },
                  { 
                    icon: <FingerPrintIcon className="w-10 h-10 text-purple-600" />, 
                    title: "Create Profile", 
                    description: "Quick and secure setup with privacy protection" 
                  },
                  { 
                    icon: <UserGroupIcon className="w-10 h-10 text-blue-600" />, 
                    title: "Join Community", 
                    description: "Connect with local guardians in your area" 
                  },
                  { 
                    icon: <ShieldCheckIcon className="w-10 h-10 text-green-600" />, 
                    title: "Stay Protected", 
                    description: "24/7 safety features always at your fingertips" 
                  }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center relative bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
                  >
                    {index < 3 && (
                      <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full z-20 items-center justify-center">
                        <ChevronRightIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="flex justify-center mb-6 relative">
                      <div className="text-4xl w-24 h-24 flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 rounded-full relative">
                        <div className="absolute inset-0 bg-white rounded-full transform scale-90 flex items-center justify-center">
                          {step.icon}
                        </div>
                        <div className="absolute -top-3 -right-3 bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-semibold mb-3 font-montserrat">{step.title}</h3>
                    <h3 className="text-2xl font-semibold mb-3 font-montserrat">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-center mb-6 text-gray-800 font-montserrat"
            >
              What Our Users Say
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
            >
              Real stories from our community
            </motion.p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "SafeStreet gave me the confidence to travel alone at night. The guardian network is amazing!",
                  name: "Priya S.",
                  location: "Bangalore"
                },
                {
                  quote: "The SOS feature actually saved me from a potentially dangerous situation. Every woman should have this app.",
                  name: "Ananya M.",
                  location: "Mumbai"
                },
                {
                  quote: "I love the safe routes feature. It helps me navigate unfamiliar areas with peace of mind.",
                  name: "Kavitha R.",
                  location: "Delhi"
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-gray-100 relative"
                >
                  <div className="absolute -top-5 -left-5 text-6xl text-pink-300">"</div>
                  <div className="mb-8 pt-6">
                    <p className="text-gray-700 italic text-lg">{testimonial.quote}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.location}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <StarIconSolid key={i} className="w-5 h-5 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-[#FF1493] to-[#9932CC] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-montserrat">Join the SafeStreet Movement</h2>
              <p className="text-xl md:text-2xl mb-12 opacity-90">
                Be part of the change. Download the app and help build a safer community for all women.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#FF1493] px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition flex items-center justify-center"
                >
                  <LightBulbIcon className="w-5 h-5 mr-2" />
                  Get Early Access
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition flex items-center justify-center"
                >
                  <HandRaisedIcon className="w-5 h-5 mr-2" />
                  Become A Guardian
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo and mission */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <ShieldCheckIconSolid className="h-8 w-8 mr-2 text-[#FF1493]" />
                <span className="text-2xl font-bold font-montserrat text-white">
                  SafeStreet
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Empowering women's safety through community and technology.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FF1493] transition"
                  >
                    <span className="sr-only">{social}</span>
                    {/* Replace with actual social icons */}
                    <div className="w-5 h-5 bg-white/80 rounded-sm"></div>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Features', 'Community', 'How It Works', 'Testimonials'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-[#FF1493] transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
              <ul className="space-y-4">
                {['Safety Tips', 'Emergency Contacts', 'Legal Help', 'Support Groups', 'FAQ'].map((resource) => (
                  <li key={resource}>
                    <a href="#" className="text-gray-400 hover:text-[#FF1493] transition">
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start">
                  <GlobeAsiaAustraliaIcon className="w-5 h-5 mr-3 mt-1 text-[#FF1493]" />
                  <span>123 Safety Street, Bangalore, India 560001</span>
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="w-5 h-5 mr-3 text-[#FF1493]" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center">
                  <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-3 text-[#FF1493]" />
                  <span>help@safestreet.app</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} SafeStreet. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 text-sm hover:text-[#FF1493] transition">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-[#FF1493] transition">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 text-sm hover:text-[#FF1493] transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}