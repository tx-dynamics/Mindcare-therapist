import React, { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import Home from '../AuthPages/Home';

// Modal Component


const TrackAttendence = ({onClose}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState(null);
  // Sample student data
 const studentsData = [
    { id: 1, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 2, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 3, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 4, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 5, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 6, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 7, name: "Name Here", gym: 40, home: 60, absent: 60 },
    { id: 8, name: "Name Here", gym: 40, home: 60, absent: 60 },
  ];

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




  return (
    <> 
   
      <div className=" bg-white p-4 rounded-2xl">
        
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl md:text- font-semibold text-teal-600">Track Attendance </h1>
            
            {/* Date Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{formatDate(selectedDate)}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
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
          </div>

         
           {/* Attendance Table */}
        <div className="bg-white ">
          {/* Table Header */}
          <div className="bg-teal-600 text-white rounded-xl">
            <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-lg ">
              <div className="text-left">Name</div>
              <div className="text-center">Absent</div>
              <div className="text-center">Attend From Gym</div>
              <div className="text-center">Attend from Home</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {studentsData.map((student) => (
              <div key={student.id} className="grid grid-cols-4 gap-4 p-6 items-center ">
                {/* Name */}
                <div className="text-left">
                  <p className="font-medium text-gray-700 text-lg">{student.name}</p>
                </div>

                {/* Gym */}
                <div className="text-center">
                  <span className="text-gray-600 text-lg">{student.gym}%</span>
                </div>

                {/* Home */}
                <div className="text-center">
                  <span className="text-gray-600 text-lg">{student.home}%</span>
                </div>

                {/* Absent */}
                <div className="text-center">
                  <span className="text-gray-600 text-lg">{student.absent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        </div>
      </div>

      {/* Modal */}

    </>
  );
};

export default TrackAttendence;


