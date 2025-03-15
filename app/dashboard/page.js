'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Import tab components
import OverviewTab from '../components/dashboard/tabs/OverviewTab';
import AIChatbotTab from '../components/dashboard/tabs/AIChatbotTab';
import LocalContentTab from '../components/dashboard/tabs/LocalContentTab';
import StudentsTab from '../components/dashboard/tabs/StudentsTab';
import AdaptiveAssessmentsTab from '../components/dashboard/tabs/AdaptiveAssessmentsTab';
import Sidebar from '../components/dashboard/Sidebar';
import AIXplainTab from '../components/dashboard/tabs/AIXplainTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Function to render different tab contents
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <OverviewTab />;
      case 'AILearningEngine':
        return <AIChatbotTab />;
      case 'RegionalContent':
        return <LocalContentTab />;
      case 'OpportunityNavigator':
        return <StudentsTab />;
      case 'AdaptiveAssessments':
        return <AdaptiveAssessmentsTab />;
      case 'AIXplain':
        return <AIXplainTab />;
      default:
        return <OverviewTab />;
    }
  };

  // Function to get tab title
  const getTabTitle = () => {
    switch (activeTab) {
      case 'Dashboard':
        return 'Dashboard Overview';
      case 'AILearningEngine':
        return 'AI Learning Engine';
      case 'RegionalContent':
        return 'Regional Content';
      case 'OpportunityNavigator':
        return 'Opportunity Navigator';
      case 'AdaptiveAssessments':
        return 'Adaptive Assessments';
      case 'AIXplain':
        return 'AIXplain Assistant';
      default:
        return 'Dashboard';
    }
  };

  // Function to get tab description
  const getTabDescription = () => {
    switch (activeTab) {
      case 'Dashboard':
        return 'Welcome back, Ashish! Here\'s what\'s happening with your rural education initiatives.';
      case 'AILearningEngine':
        return 'Interact with our AI assistant to create personalized learning experiences.';
      case 'RegionalContent':
        return 'Access and manage educational content in 14 regional languages.';
      case 'OpportunityNavigator':
        return 'Discover scholarships, programs and opportunities for rural students.';
      case 'AdaptiveAssessments':
        return 'Create and manage adaptive assessments for different learning levels.';
      case 'AIXplain':
        return 'Voice-based learning content for areas with low literacy or connectivity.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-x-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {getTabTitle()}
          </h1>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-100">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTepI3QIT5POKlkxTpkADpH1mPj9daEClDUoA&s" 
                  alt="User Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden md:block">Ashish K Choudhary</span>
            </div>
          </div>
        </div>
        
        {/* Tab Description */}
        <div className="px-6 pt-6 pb-2">
          <p className="text-gray-500">{getTabDescription()}</p>
        </div>
        
        {/* Tab Content */}
        <motion.div 
          key={activeTab}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}