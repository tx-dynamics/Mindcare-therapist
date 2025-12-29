import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Clock, X } from 'lucide-react';
import { appointmentsData } from '../../components/Data';

const SessionHistory = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSessionHistory, setSelectedSessionHistory] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
const [feedback, setFeedback] = useState('');
  // Sample SessionHistorys data

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
  
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const handleDateSelect = (day) => {
    if (day) {
      const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      setSelectedDate(newDate);
      setShowCalendar(false);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };




 

  const handleSessionHistoryClick = (SessionHistory) => {
    setSelectedSessionHistory(SessionHistory);
  };

  const handleBackClick = () => {
    setSelectedSessionHistory(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedSessionHistory(null);
  };
     const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
    onClick={() => setIsModalOpen(false)}>
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full mx-4 relative"
      onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
   };
  

  if (selectedSessionHistory) {
    return (
      <>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            {/* Back Button */}
            <button 
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Back to Session History</span>
            </button>

            {/* Student Info */}
            <div className="flex items-center mb-8">
              <img 
                src={selectedSessionHistory.avatar} 
                alt={selectedSessionHistory.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <h1 className="text-2xl font-semibold text-gray-800">{selectedSessionHistory.name}</h1>
            </div>

            {/* SessionHistory Details */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Date & time</h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{selectedSessionHistory.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{selectedSessionHistory.time}</span>
                </div>
              </div>
            </div>

            {/* Mental Health Goals */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Mental Health Goals</h2>
              <p className="text-gray-600 leading-relaxed">{selectedSessionHistory.goals}</p>
            </div>

            {/* Note */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Note</h2>
              <p className="text-gray-600 leading-relaxed">{selectedSessionHistory.note}</p>
            </div>

            {/* AI Summary */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Ai Summary</h2>
              <p className="text-gray-600 leading-relaxed">{selectedSessionHistory.aiSummary}</p>
            </div>
              
          </div>
        </div>
      </div>

      </>
    );
  }

  return (
    <> 
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 sm:mb-0">My Session Historys</h3>
          
          {/* Date Picker - Only show for Upcoming tab */}
          
        </div>

        {/* Tab Navigation */}
       

        {/* SessionHistorys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {appointmentsData.map((SessionHistory) => (
            <div 
              key={SessionHistory.id}
              onClick={() => handleSessionHistoryClick(SessionHistory)}
              className="bg-white rounded-2xl p-6 cursor-pointer  duration-200"
            >
              <div className="flex items-center">
                <img 
                  src={SessionHistory.avatar} 
                  alt={SessionHistory.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{SessionHistory.name}</h3>
                  <p className="text-sm text-gray-600">{SessionHistory.date} - {SessionHistory.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
   
    </>
  );
};

export default SessionHistory;
