'use client';
import React from 'react';
import Link from 'next/link';
import { 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaBookReader, 
  FaUsers, 
  FaSignOutAlt,
  FaNetworkWired,
  FaRobot,
} from 'react-icons/fa';
import { IoMdSchool } from 'react-icons/io';
import { RiTranslate, RiDashboardLine } from 'react-icons/ri';
import { MdOutlineWifiOff, MdOutlineRecordVoiceOver } from 'react-icons/md';
import { BsRobot, BsLightningCharge } from 'react-icons/bs';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: <RiDashboardLine /> },
    { id: 'AILearningEngine', label: 'AIXplain Assistant', icon: <BsRobot /> },
    { id: 'RegionalContent', label: 'Regional Content', icon: <RiTranslate /> },
    { id: 'OpportunityNavigator', label: 'Opportunity Navigator', icon: <FaUsers /> },
    { id: 'ContentGenerator', label: 'Content Generator ', icon: <FaChalkboardTeacher /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm z-10 flex flex-col h-screen fixed">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <IoMdSchool className="text-2xl text-green-600" />
          <span className="text-xl font-bold text-gray-800">Digi Shiksha</span>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Accessibility Tools
          </h3>
          <div className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors">
              <MdOutlineWifiOff className="text-lg" />
              <span className="text-sm">Offline Content</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors">
              <MdOutlineRecordVoiceOver className="text-lg" />
              <span className="text-sm">Voice Learning</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors">
              <FaBookReader className="text-lg" />
              <span className="text-sm">Simplified Content</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors">
          <FaSignOutAlt />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;