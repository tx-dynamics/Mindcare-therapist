import React, { useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, Clock, X } from 'lucide-react';
import { appointmentsData } from '../../components/Data';

const Appointment = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
const [feedback, setFeedback] = useState('');
  // Sample appointments data

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


  const completedAppointments = [
    {
      id: 13,
      name: "Lisa Anderson",
      date: "10 JAN, 2024",
      time: "10:00 AM",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
      goals: "Completed therapy for social anxiety. Successfully developed confidence in public speaking and group interactions.",
      note: "Final session completed successfully. Student has made remarkable progress and feels confident to continue independently. Follow-up scheduled in 3 months.",
      aiSummary: "Treatment goals successfully achieved. Student demonstrates significant improvement in social confidence and anxiety management skills."
    },
    {
      id: 14,
      name: "Kevin Park",
      date: "08 JAN, 2024",
      time: "2:00 PM",
      avatar: "https://images.unsplash.com/photo-1502767089025-6572583495b9?w=150&h=150&fit=crop&crop=face",
      goals: "Completed anger management program. Successfully learned emotional regulation and conflict resolution techniques.",
      note: "Program completed with excellent results. Student reports improved relationships at home and school. Parents very pleased with progress.",
      aiSummary: "Anger management program successfully completed. Student achieved all therapeutic goals and shows sustained behavioral improvements."
    },
    {
      id: 15,
      name: "Hannah Kim",
      date: "05 JAN, 2024",
      time: "3:30 PM",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
      goals: "Completed grief counseling following family loss. Successfully processed emotions and developed healthy coping strategies.",
      note: "Grief work completed successfully. Student has processed loss in healthy way and developed strong coping mechanisms. Resilience building achieved.",
      aiSummary: "Grief counseling concluded with positive outcomes. Student demonstrates healthy grief processing and strong emotional resilience."
    },
    {
      id: 16,
      name: "Marcus Johnson",
      date: "03 JAN, 2024",
      time: "1:00 PM",
      avatar: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      goals: "Completed academic stress management program. Successfully developed study strategies and stress reduction techniques.",
      note: "Academic support program completed. Student achieved improved grades and better stress management. Ready for independent academic success.",
      aiSummary: "Academic stress management program successfully completed. Student shows significant improvement in both academic performance and stress levels."
    },
    {
      id: 17,
      name: "Zoe Martinez",
      date: "01 JAN, 2024",
      time: "11:30 AM",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face",
      goals: "Completed self-esteem building program. Successfully developed positive self-image and confidence in personal abilities.",
      note: "Self-esteem work completed with excellent outcomes. Student shows remarkable confidence improvement and positive self-regard.",
      aiSummary: "Self-esteem building program concluded successfully. Student achieved significant improvements in self-confidence and self-worth."
    },
    {
      id: 18,
      name: "Tyler Brooks",
      date: "28 DEC, 2023",
      time: "4:00 PM",
      avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=150&h=150&fit=crop&crop=face",
      goals: "Completed relationship counseling program. Successfully improved communication skills and family dynamics.",
      note: "Family therapy goals achieved. Improved communication between student and parents. Family reports much better relationships at home.",
      aiSummary: "Relationship counseling program completed with positive family outcomes. Communication skills and family dynamics significantly improved."
    }
  ];

  const getCurrentAppointments = () => {
    return activeTab === 'upcoming' ? appointmentsData : completedAppointments;
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleBackClick = () => {
    setSelectedAppointment(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAppointment(null);
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
  

  if (selectedAppointment) {
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
              <span className="text-sm font-medium">Back to Appointments</span>
            </button>

            {/* Student Info */}
            <div className="flex items-center mb-8">
              <img 
                src={selectedAppointment.avatar} 
                alt={selectedAppointment.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <h1 className="text-2xl font-semibold text-gray-800">{selectedAppointment.name}</h1>
            </div>

            {/* Appointment Details */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Appointment date & time</h2>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{selectedAppointment.time}</span>
                </div>
              </div>
            </div>

            {/* Mental Health Goals */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Mental Health Goals</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.goals}</p>
            </div>

            {/* Note */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-1">Note</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.note}</p>
            </div>

            {/* AI Summary */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">Ai Summary</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.aiSummary}</p>
            </div>
              {activeTab === 'completed' && (  
              <div className='flex justify-end w-full'>
<button  onClick={()=>setIsModalOpen(true)} className="bg-teal-700 text-white  px-6 py-2 mt-6 rounded-md hover:bg-teal-800  transition-colors ">
          Give Feedback
        </button>
            </div>)}
          </div>
        </div>
      </div>
         {isModalOpen &&  (
       <Modal onClose={() => setIsModalOpen(false)}>
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">Feedback</h2>

    <textarea
      className={`w-full mt-2 p-3 border ${
        error ? 'border-red-500' : 'border-gray-300'
      } rounded-lg focus:outline-none focus:border-teal-600`}
      rows="4"
      placeholder="Write feedback..."
      value={feedback}
      onChange={(e) => {
        setFeedback(e.target.value);
        if (error) setError(false); // clear error when typing
      }}
    ></textarea>

    {error && (
      <p className="text-red-500 text-sm mt-1">Please write feedback</p>
    )}

    <div className="mt-6 flex justify-end gap-3">
      <button
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
        onClick={()=>setIsModalOpen(false) }
      >
        Cancel
      </button>
      <button
        onClick={() => {
          if (!feedback.trim()) {
            setError(true);
          } else {
            setError(false);
          setIsModalOpen(false);
            // submit feedback here
          }
        }}
        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
      >
        Send
      </button>
    </div>
  </div>
</Modal>
      )}
      </>
    );
  }

  return (
    <> 
    <div className="min-h-screen ">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">My Appointments</h1>
          
          {/* Date Picker - Only show for Upcoming tab */}
          {activeTab === 'upcoming' && (
              <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
               
                <span className="text-gray-700">{formatDate(selectedDate)}</span>
             <Calendar className="w-5 h-5 text-gray-500" />
              </button>

              {/* Calendar Dropdown */}
              {showCalendar && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4 w-80">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                    </button>
                    <h3 className="font-semibold">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {generateCalendar().map((day, index) => (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(day)}
                        className={`h-8 text-sm rounded hover:bg-teal-100 transition-colors ${
                          day === selectedDate.getDate() ? 'bg-teal-600 text-white hover:bg-teal-700' : 
                          day ? 'text-gray-700 hover:bg-gray-100' : ''
                        }`}
                        disabled={!day}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`px-6 py-2 rounded-full text-sm font-medium mr-2 transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Appointments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {getCurrentAppointments().map((appointment) => (
            <div 
              key={appointment.id}
              onClick={() => handleAppointmentClick(appointment)}
              className="bg-white rounded-3xl  p-6 cursor-pointer  duration-200"
            >
              <div className="flex items-center">
                <img 
                  src={appointment.avatar} 
                  alt={appointment.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{appointment.name}</h3>
                  <p className="text-sm text-gray-600">{appointment.date} - {appointment.time}</p>
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

export default Appointment;
