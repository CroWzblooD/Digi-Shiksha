'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaGlobe, FaLaptop } from 'react-icons/fa';
import { BsLightningCharge, BsGraphUp } from 'react-icons/bs';
import { MdOutlineRecordVoiceOver } from 'react-icons/md';
import { RiTranslate } from 'react-icons/ri';

// Donut Chart Component
const DonutChart = ({ percentage, color, size = 120, label, value }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, title, value, change, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </div>
      </div>
      <div className="text-gray-500 text-sm font-medium">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </motion.div>
  );
};

const Dashboard = () => {
  // Mock data for stats
  const stats = [
    { 
      icon: <FaUsers className="text-white text-xl" />, 
      title: "Active Students", 
      value: "2,845", 
      change: 12.5,
      color: "bg-blue-500"
    },
    { 
      icon: <MdOutlineRecordVoiceOver className="text-white text-xl" />, 
      title: "Voice Lessons", 
      value: "12,582", 
      change: 18.2,
      color: "bg-purple-500"
    },
    { 
      icon: <RiTranslate className="text-white text-xl" />, 
      title: "Languages", 
      value: "14", 
      change: 4.3,
      color: "bg-green-500"
    },
    { 
      icon: <BsLightningCharge className="text-white text-xl" />, 
      title: "Assessments", 
      value: "5,672", 
      change: -2.4,
      color: "bg-amber-500"
    }
  ];

  // Mock data for donut charts
  const donutData = [
    { percentage: 78, color: "#4F46E5", label: "Content Engagement", value: "78%" },
    { percentage: 65, color: "#10B981", label: "Offline Usage", value: "65%" },
    { percentage: 92, color: "#F59E0B", label: "Voice Interaction", value: "92%" },
    { percentage: 45, color: "#EC4899", label: "Regional Adoption", value: "45%" }
  ];

  // Mock data for regional distribution
  const regions = [
    { name: "Uttar Pradesh", students: 845, color: "bg-blue-500" },
    { name: "Bihar", students: 632, color: "bg-green-500" },
    { name: "Rajasthan", students: 521, color: "bg-purple-500" },
    { name: "Madhya Pradesh", students: 478, color: "bg-amber-500" },
    { name: "Jharkhand", students: 369, color: "bg-pink-500" }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Rural Education Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              color={stat.color}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Donut Charts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Performance Metrics</h2>
            <div className="flex flex-wrap justify-around gap-4">
              {donutData.map((data, index) => (
                <DonutChart 
                  key={index}
                  percentage={data.percentage}
                  color={data.color}
                  label={data.label}
                  value={data.value}
                />
              ))}
            </div>
          </motion.div>

          {/* Regional Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Regional Distribution</h2>
            <div className="space-y-4">
              {regions.map((region, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${region.color} mr-3`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{region.name}</span>
                      <span className="text-sm font-medium text-gray-700">{region.students}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${region.color} h-2 rounded-full`} 
                        style={{ width: `${(region.students / 845) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity & Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-lg ${['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-amber-100'][index % 4]} mr-4`}>
                    {[<FaBookOpen />, <MdOutlineRecordVoiceOver />, <BsLightningCharge />, <RiTranslate />][index % 4]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {[
                        "New vernacular content added in Hindi",
                        "Voice lesson completed by 45 students",
                        "Assessment results updated for Math module",
                        "Regional content translated to 3 new languages"
                      ][index % 4]}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {["2 hours ago", "Yesterday", "2 days ago", "3 days ago"][index % 4]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Opportunities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Latest Opportunities</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-800">
                      {[
                        "Rural Teacher Training Program",
                        "Digital Skills Scholarship",
                        "Agricultural Technology Workshop",
                        "Government STEM Initiative"
                      ][index % 4]}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${[
                      'bg-green-100 text-green-800',
                      'bg-blue-100 text-blue-800',
                      'bg-amber-100 text-amber-800',
                      'bg-purple-100 text-purple-800'
                    ][index % 4]}`}>
                      {["New", "Featured", "Limited", "Closing Soon"][index % 4]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {[
                      "Applications open for rural teachers to receive digital training",
                      "Scholarships available for students in Bihar and UP",
                      "Learn modern farming techniques with technology integration",
                      "Government funded program for girls in STEM education"
                    ][index % 4]}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500">
                      {["Deadline: 15 Aug", "Deadline: 30 Aug", "Starts: 10 Sep", "Deadline: 5 Sep"][index % 4]}
                    </span>
                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;