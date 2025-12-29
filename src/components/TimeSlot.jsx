import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

const TimeSlot = ({ onClick, onNext, isSubmitting = false }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [showExtraBoxes, setShowExtraBoxes] = useState({});
  const [timeSlots, setTimeSlots] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!timeSlots.Monday) {
      initializeDay('Monday');
    }
  }, []);

  const initializeDay = (day) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: {
        slot1: { from: '', to: '' },
        slot2: { from: '', to: '' }
      }
    }));
  };

  const handleDayChange = (day) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));

    if (!timeSlots[day]) {
      initializeDay(day);
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

    if (value.trim()) {
      setErrors(prev => ({
        ...prev,
        [`${day}-${slot}-${field}`]: false
      }));
    }
  };

  const toggleExtraBoxes = (day) => {
    setShowExtraBoxes(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    let hasErrors = false;

    Object.keys(selectedDays).forEach(day => {
      if (selectedDays[day] && timeSlots[day]) {
        const slot1 = timeSlots[day].slot1;
        if (!slot1.from.trim()) {
          newErrors[`${day}-slot1-from`] = true;
          hasErrors = true;
        }
        if (!slot1.to.trim()) {
          newErrors[`${day}-slot1-to`] = true;
          hasErrors = true;
        }

        if (showExtraBoxes[day]) {
          const slot2 = timeSlots[day].slot2;
          if (!slot2.from.trim()) {
            newErrors[`${day}-slot2-from`] = true;
            hasErrors = true;
          }
          if (!slot2.to.trim()) {
            newErrors[`${day}-slot2-to`] = true;
            hasErrors = true;
          }
        }
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleNext = () => {
    if (isSubmitting) return;
    if (!validateFields()) return;

    const availability = Object.keys(selectedDays)
      .filter((day) => selectedDays[day] && timeSlots[day])
      .map((day) => {
        const slots = [];
        const slot1 = timeSlots[day]?.slot1;
        if (slot1?.from && slot1?.to) {
          slots.push({ from: slot1.from, to: slot1.to });
        }

        if (showExtraBoxes[day]) {
          const slot2 = timeSlots[day]?.slot2;
          if (slot2?.from && slot2?.to) {
            slots.push({ from: slot2.from, to: slot2.to });
          }
        }

        return { day: day.toLowerCase(), timeSlots: slots };
      })
      .filter((d) => d.timeSlots.length > 0);

    if (typeof onNext === 'function') {
      onNext(availability);
      return;
    }

    if (typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mb-8 mx-auto bg-white rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Time Slot</h1>

        <div className="space-y-6 mb-8">
          {days.map((day) => (
            <div key={day} className="flex flex-col md:flex-row md:items-start gap-6">
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

              {/* Time Input Slots */}
              {selectedDays[day] && (
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Slot 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['from', 'to'].map((field) => (
                        <div key={field} className="space-y-2">
                          <input
                            type="time"
                            value={timeSlots[day]?.slot1?.[field] || ''}
                            onChange={(e) => handleTimeChange(day, 'slot1', field, e.target.value)}
                            className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                              errors[`${day}-slot1-${field}`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {errors[`${day}-slot1-${field}`] && (
                            <p className="text-red-500 text-sm">Fill this field</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Slot 2 (optional) */}
                    {showExtraBoxes[day] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2">
                        {['from', 'to'].map((field) => (
                          <div key={field} className="space-y-2">
                            <input
                              type="time"
                              value={timeSlots[day]?.slot2?.[field] || ''}
                              onChange={(e) => handleTimeChange(day, 'slot2', field, e.target.value)}
                              className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                errors[`${day}-slot2-${field}`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors[`${day}-slot2-${field}`] && (
                              <p className="text-red-500 text-sm">Fill this field</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Toggle Slot 2 Button */}
                    <div className="flex items-start pt-2 ml-2">
                      <button
                        onClick={() => toggleExtraBoxes(day)}
                        className="w-10 h-10 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-lg"
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
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlot;
