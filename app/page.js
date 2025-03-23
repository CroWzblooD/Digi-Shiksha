'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaChalkboardTeacher, FaBook, FaChartLine, FaLaptop, FaMobileAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { RiTranslate } from 'react-icons/ri';
import { MdOutlineAnalytics, MdOutlinePersonalVideo, MdOutlineAccessTime } from 'react-icons/md';
import { BsLightbulb, BsGraphUp, BsStarFill } from 'react-icons/bs';
import { HiOutlineSparkles } from 'react-icons/hi';
import { BiLeaf, BiWorld, } from 'react-icons/bi';

import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 text-gray-800">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-green-50 to-white opacity-70"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-emerald-200/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full filter blur-3xl"></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-white-feathers.png')] opacity-5"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-md bg-white/70 border-b border-green-100 z-50 px-4 md:px-8 py-4 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BiLeaf className="text-emerald-500 text-3xl" />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
              Digi Shiksha
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['home', 'features', 'benefits', 'testimonials', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`text-sm uppercase tracking-wider font-medium transition-all relative group ${
                  activeSection === item ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                  activeSection === item ? 'scale-x-100' : ''
                }`}></span>
              </button>
            ))}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-emerald-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-md bg-white/90 border border-green-100 py-4 px-4 mt-2 rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4">
              {['home', 'features', 'benefits', 'testimonials', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`text-sm uppercase tracking-wider font-medium transition-colors ${
                    activeSection === item ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-4 md:px-8 z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Bridging the <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Educational Gap</span> in Rural India
              </h1>
              <p className="text-lg text-gray-600 mb-8">
              Digi Shiksha leverages AI technology to provide quality education to rural areas, 
                addressing infrastructure limitations, teacher shortages, and outdated teaching methods.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/dashboard">
                  <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    Get Started
                  </button>
                </Link>
                <button className="px-8 py-3 border-2 border-green-500 text-green-600 font-medium rounded-lg hover:bg-green-50 transition-colors">
                  Learn More
                </button>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl blur-md opacity-30"></div>
                <img 
                  src="https://static.vecteezy.com/system/resources/previews/048/904/190/non_2x/vibrant-rural-classroom-with-educational-posters-and-empty-desks-photo.jpg" 
                  alt="Rural Education" 
                  className="relative rounded-2xl border border-green-100 w-full h-auto object-cover shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Features Section */}
       <section id="features" className="relative py-24 px-4 md:px-8 bg-white/80 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-green-100/50 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-teal-100/50 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powered by <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">AI Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Digi Shiksha integrates aiXplain's AI models to create a unique, scalable solution for rural education challenges.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl inline-block mb-5 shadow-md relative">
                <FaChalkboardTeacher className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Adaptive Learning</h3>
              <p className="text-gray-600">
                Personalized learning experiences that adapt to each student's pace and learning style using NLP and adaptive algorithms.
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <MdOutlinePersonalVideo className="text-green-600" />
                  </span>
                  Interactive Q&A in native languages
                </li>
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <BsLightbulb className="text-green-600" />
                  </span>
                  Personalized lesson plans
                </li>
              </ul>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl inline-block mb-5 shadow-md relative">
                <IoMdSchool className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Teacher Support Dashboard</h3>
              <p className="text-gray-600">
                Automated tools to reduce teacher workload by 40% while standardizing education quality across rural schools.
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <FaBook className="text-green-600" />
                  </span>
                  Automated grading system
                </li>
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <MdOutlineAnalytics className="text-green-600" />
                  </span>
                  Student engagement monitoring
                </li>
              </ul>
            </motion.div>

                      {/* Feature 3 */}
                      <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl inline-block mb-5 shadow-md relative">
                <RiTranslate className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Multilingual Content Library</h3>
              <p className="text-gray-600">
                Access to simplified educational content in 12+ regional languages with offline functionality.
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <FaBook className="text-green-600" />
                  </span>
                  Content summarization
                </li>
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <RiTranslate className="text-green-600" />
                  </span>
                  Translation to regional languages
                </li>
              </ul>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 text-white p-4 rounded-xl inline-block mb-5 shadow-md relative">
                <FaChartLine className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Community Analytics</h3>
              <p className="text-gray-600">
                Data-driven insights to track progress and identify at-risk students, empowering communities to take action.
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <BsGraphUp className="text-green-600" />
                  </span>
                  Predictive analytics
                </li>
                <li className="flex items-center">
                  <span className="bg-gradient-to-br from-green-100 to-teal-100 p-2 rounded-full mr-3 shadow-sm">
                    <FaUsers className="text-green-600" />
                  </span>
                  Parent engagement tools
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

            {/* Benefits Section */}
            <section id="benefits" className="relative py-24 px-4 md:px-8 bg-white/80 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-100/40 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-teal-100/40 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Digi Shiksha</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform is designed specifically for the unique challenges of rural education in India.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="order-2 md:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                <div className="flex items-start space-x-5">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <HiOutlineSparkles className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Works Offline</h3>
                    <p className="text-gray-600">
                      Once content is downloaded, the app functions without internet, perfect for areas with limited connectivity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <BiWorld className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Low-Resource Compatible</h3>
                    <p className="text-gray-600">
                      Designed to work on basic smartphones and older computers, ensuring accessibility for all.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <BiLeaf className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Locally Relevant</h3>
                    <p className="text-gray-600">
                      Content is contextualized to local cultures, industries, and environments for better engagement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-5">
                  <div className="bg-white p-4 rounded-xl shadow-md border border-green-100 relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <MdOutlineAccessTime className="text-2xl text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Time-Efficient</h3>
                    <p className="text-gray-600">
                      Reduces learning time by 30% through personalized pacing and focused content delivery.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="order-1 md:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl blur-md opacity-30"></div>
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Rural students using technology" 
                  className="relative rounded-2xl border border-green-100 w-full h-auto object-cover shadow-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-24 px-4 md:px-8 bg-white/80 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-green-100/40 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-100/40 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Users Say</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from teachers, students, and community leaders who have experienced the impact of Digi Shiksha.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Testimonial 1 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-green-100">
                  <img 
                    src="https://randomuser.me/api/portraits/women/79.jpg" 
                    alt="Priya Sharma" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Priya Sharma</h4>
                  <p className="text-green-600">Teacher, Rajasthan</p>
                </div>
              </div>
              
              <p className="text-gray-600 italic mb-4 relative">
                "The automated grading system has reduced my workload significantly. I can now focus on actually teaching rather than administrative tasks. My students are more engaged than ever before."
              </p>
              
              <div className="flex text-amber-500 mt-4 relative">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="w-5 h-5 mr-1" />
                ))}
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-green-100">
                  <img 
                    src="https://randomuser.me/api/portraits/men/67.jpg" 
                    alt="Vikram Singh" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Vikram Singh</h4>
                  <p className="text-green-600">Village Head, Madhya Pradesh</p>
                </div>
              </div>
              
              <p className="text-gray-600 italic mb-4 relative">
                "Our village has seen a transformation since Digi Shiksha was introduced. Children who were dropping out are now excited about learning. The community analytics help us identify which students need additional support."
              </p>
              
              <div className="flex text-amber-500 mt-4 relative">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="w-5 h-5 mr-1" />
                ))}
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div 
              variants={fadeInUp}
              className="bg-white backdrop-blur-sm p-8 rounded-xl border border-green-100 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center mb-6 relative">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-green-100">
                  <img 
                    src="https://randomuser.me/api/portraits/women/63.jpg" 
                    alt="Ananya Patel" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-800">Ananya Patel</h4>
                  <p className="text-green-600">Student, Gujarat</p>
                </div>
              </div>
              
              <p className="text-gray-600 italic mb-4 relative">
                "I love learning with Digi Shiksha! The lessons are in my language and I can study even when there's no internet. The interactive quizzes make learning fun and I've improved my grades a lot."
              </p>
              
              <div className="flex text-amber-500 mt-4 relative">
                {[...Array(5)].map((_, i) => (
                  <BsStarFill key={i} className="w-5 h-5 mr-1" />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

       {/* Contact Section */}
       <section id="contact" className="relative py-24 px-4 md:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-teal-100/30 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">Touch</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Interested in bringing Digi Shiksha to your community? Our AI assistant is ready to help you.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl blur opacity-30"></div>
              
              <div className="relative bg-white/90 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-green-100">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* AI Assistant Side */}
                  <div className="md:w-1/3 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                        <HiOutlineSparkles className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">AI Assistant</h3>
                        <p className="text-green-600 text-sm">Online & Ready</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-gray-600 text-sm italic">
                        "Hello! I'm your AI assistant. I can help answer questions about Digi Shiksha and connect you with our team. What would you like to know?"
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">Quick Questions:</h4>
                      <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 text-sm transition-colors">
                        How can I implement Digi Shiksha?
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 text-sm transition-colors">
                        What's the cost structure?
                      </button>
                      <button className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 text-sm transition-colors">
                        Do you offer training?
                      </button>
                    </div>
                  </div>
                  
                  {/* Contact Form Side */}
                  <div className="md:w-2/3 md:border-l border-green-100 md:pl-8">
                    <h3 className="text-xl font-bold mb-6 text-gray-800">Send us a message</h3>
                    <form className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="relative">
                          <input 
                            type="text" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all peer"
                            placeholder=" "
                            id="name"
                          />
                          <label 
                            htmlFor="name" 
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 peer-focus:text-green-600"
                          >
                            Your Name
                          </label>
                        </div>
                        
                        <div className="relative">
                          <input 
                            type="email" 
                            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all peer"
                            placeholder=" "
                            id="email"
                          />
                          <label 
                            htmlFor="email" 
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 peer-focus:text-green-600"
                          >
                            Email Address
                          </label>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select 
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none"
                          id="inquiry"
                        >
                          <option value="" disabled selected>Select type of inquiry</option>
                          <option value="implementation">Implementation</option>
                          <option value="pricing">Pricing</option>
                          <option value="demo">Request Demo</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <textarea 
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-32 resize-none peer"
                          placeholder=" "
                          id="message"
                        ></textarea>
                        <label 
                          htmlFor="message" 
                          className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-gray-50 px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2 peer-focus:text-green-600"
                        >
                          Your Message
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input 
                          type="checkbox" 
                          id="ai-analysis" 
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label htmlFor="ai-analysis" className="text-sm text-gray-600">
                          Enable AI-powered response analysis for faster feedback
                        </label>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                      >
                        <span>Send Message</span>
                        <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
               {/* Footer */}
      <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 px-4 md:px-8 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-900/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-teal-900/10 rounded-full filter blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                  <FaGraduationCap className="text-white text-xl" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                Digi Shiksha
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                Bridging the educational gap in rural India through innovative AI-powered solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 flex items-center justify-center transition-all duration-300">
                  <FaUsers className="w-4 h-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-teal-500 flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-green-400 to-teal-400 h-0.5 w-1/2 absolute bottom-0 left-0"></span>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {['Home', 'Features', 'Benefits', 'Testimonials', 'Contact'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 opacity-0 transform -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"></span>
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-green-400 to-teal-400 h-0.5 w-1/2 absolute bottom-0 left-0"></span>
                Resources
              </h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Help Center</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 relative inline-block">
                <span className="bg-gradient-to-r from-green-400 to-teal-400 h-0.5 w-1/2 absolute bottom-0 left-0"></span>
                Newsletter
              </h4>
              <p className="text-gray-400 mb-4">
                Stay updated with our latest features and releases
              </p>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button className="absolute right-1 top-1 bg-gradient-to-r from-green-500 to-teal-500 text-white p-2 rounded-md hover:shadow-lg transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Digi Shiksha. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-green-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      </div>
    );
  }