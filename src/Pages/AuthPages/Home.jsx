import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const Home = () => {
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });
  
  const [showExtraBoxes, setShowExtraBoxes] = useState({});
  const [timeSlots, setTimeSlots] = useState({});

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayChange = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
    
    // Initialize time slots for the day if not exists
    if (!timeSlots[day]) {
      setTimeSlots(prev => ({
        ...prev,
        [day]: {
          slot1: { from: '', to: '' },
          slot2: { from: '', to: '' }
        }
      }));
    }
  };

  const handleTimeChange = (day, slot, field, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: {
          ...prev[day][slot],
          [field]: value
        }
      }
    }));
  };

  const toggleExtraBoxes = (day) => {
    setShowExtraBoxes(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Initialize time slots for Monday (default selected)
  React.useEffect(() => {
    if (!timeSlots.Monday) {
      setTimeSlots(prev => ({
        ...prev,
        Monday: {
          slot1: { from: '', to: '' },
          slot2: { from: '', to: '' }
        }
      }));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Time slot</h1>
        
        {/* Days and Time Slots Layout */}
        <div className="space-y-6 mb-8">
          {days.map((day) => (
            <div key={day} className="flex items-start gap-6">
              {/* Day Checkbox */}
              <div className="flex items-center min-w-[120px]">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={selectedDays[day]}
                      onChange={() => handleDayChange(day)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedDays[day] 
                        ? 'bg-teal-600 border-teal-600' 
                        : 'border-gray-300 bg-white'
                    }`}>
                      {selectedDays[day] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">{day}</span>
                </label>
              </div>

              {/* Time Slots Content - Shows when day is selected */}
              {selectedDays[day] && (
                <div className="flex-1">
                  <div className="space-y-4 flex flex-row">
                    {/* Default time slot box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                      
                        <input
                          type="text"
                          placeholder="From"
                          value={timeSlots[day]?.slot1?.from || ''}
                          onChange={(e) => handleTimeChange(day, 'slot1', 'from', e.target.value)}
                          className="w-26 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                       
                        <input
                          type="text"
                          placeholder="To"
                          value={timeSlots[day]?.slot1?.to || ''}
                          onChange={(e) => handleTimeChange(day, 'slot1', 'to', e.target.value)}
                          className="w-26 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Extra time slot box (shows when plus button is clicked) */}
                    {showExtraBoxes[day] && (
                      <div className="flex flex-row gap-4">
                        <div className="space-y-2">
                         
                          <input
                            type="text"
                            placeholder="From"
                            value={timeSlots[day]?.slot2?.from || ''}
                            onChange={(e) => handleTimeChange(day, 'slot2', 'from', e.target.value)}
                            className="w-26 px-3 py-2 ml-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                        <div className="space-y-2">
                     
                          <input
                            type="text"
                            placeholder="To"
                            value={timeSlots[day]?.slot2?.to || ''}
                            onChange={(e) => handleTimeChange(day, 'slot2', 'to', e.target.value)}
                            className="w-26 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    {/* Plus/Minus Button */}
                    <div className="flex justify-start ml-4">
                      <button
                        onClick={() => toggleExtraBoxes(day)}
                        className="w-10 h-10  bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                      >
                        {showExtraBoxes[day] ? <Minus size={20} /> : <Plus size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <div className="flex justify-end">
          <button className="bg-teal-600 hover:bg-teal-700  text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;