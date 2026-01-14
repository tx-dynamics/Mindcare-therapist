import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Plus, Minus, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import EditProfile from '../../components/EditProfile';
import ChangePassword from '../../components/ChangePassword';
import TermsConditions from '../../components/TermCondition';
import PrivacyPolicy from '../../components/PrivacyPolicy';

import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';

const MyProfile = () => {
  const [selectedSection, setSelectedSection] = useState('editProfile');
  const { therapistProfile, refreshProfile } = useOutletContext() || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedSection]);

  const renderContent = () => {
    switch (selectedSection) {
      case 'editProfile':
        return <EditProfile profile={therapistProfile} onProfileUpdate={refreshProfile} />;
      case 'changePassword':
        return <ChangePassword />;
      case 'comments':
        return <CommentsPanel />;
      case 'timeSlot':
        return <TimeSlotPanel availability={therapistProfile?.availability} />;
      case 'terms':
        return <TermsConditions />;
      case 'privacy':
        return <PrivacyPolicy />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 md:gap-6 max-[450px]:gap-3 max-[450px]:overflow-x-hidden">
      <div className="w-full md:w-1/3 lg:w-1/4 space-y-4 px-4 md:px-0 max-[450px]:px-2 max-[450px]:space-y-3">
        <MenuItem
          label="Edit Profile"
          subtitle="Details about your Personal Info"
          active={selectedSection === 'editProfile'}
          onClick={() => setSelectedSection('editProfile')}
        />
        <MenuItem
          label="Change Password"
          subtitle="Change your password for security"
          active={selectedSection === 'changePassword'}
          onClick={() => setSelectedSection('changePassword')}
        />
        <MenuItem
          label="My Comments"
          subtitle="Lorem ipsum dolor sit"
          active={selectedSection === 'comments'}
          onClick={() => setSelectedSection('comments')}
        />
        <MenuItem
          label="Time Slot"
          subtitle="Update Appointment Time"
          active={selectedSection === 'timeSlot'}
          onClick={() => setSelectedSection('timeSlot')}
        />
        <ToggleItem label="App Notifications" />
        <MenuItem
          label="Terms & Condition"
          subtitle="Details about terms & condition"
          active={selectedSection === 'terms'}
          onClick={() => setSelectedSection('terms')}
        />
        <MenuItem
          label="Privacy Policy"
          subtitle="Details about Privacy Policy"
          active={selectedSection === 'privacy'}
          onClick={() => setSelectedSection('privacy')}
        />
      </div>
      <div className="w-full md:flex-1 bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 mx-4 md:mx-0 max-[450px]:mx-2 max-[450px]:p-3 h-fit min-h-[450px]">
        {renderContent()}
      </div>
    </div>
  );
};

const MenuItem = ({ label, subtitle, onClick, active }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 max-[450px]:p-3 rounded-xl shadow-sm border flex justify-between items-center w-full ${active ? 'border-teal-700' : 'border-gray-100'
      } bg-white hover:bg-gray-50 transition`}
  >
    <div>
      <div className="font-semibold text-black max-[450px]:text-sm">{label}</div>
      {subtitle ? <div className="text-xs text-gray-500 mt-1 max-[450px]:text-[11px]">{subtitle}</div> : null}
    </div>
    <ChevronRight className="w-4 h-4 text-gray-500" />
  </div>
);

const ToggleItem = ({ label }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between p-4 max-[450px]:p-3 rounded-xl shadow-sm border border-gray-100 bg-white w-full">
      <div>
        <div className="font-semibold text-black max-[450px]:text-sm">{label}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 rounded-full p-1 transition ${enabled ? 'bg-teal-600' : 'bg-gray-300'} max-[450px]:w-11 max-[450px]:h-5`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition transform ${enabled ? 'translate-x-6' : ''} max-[450px]:w-3.5 max-[450px]:h-3.5`}></div>
      </button>
    </div>
  );
};

const CommentsPanel = () => {
  const comments = useMemo(
    () => [
      {
        id: 1,
        author: 'Anonymous',
        body: 'Lorem ipsum dolor sit amet consectetur. Purus massa tristique arcu tempus ut ac porttitor. Lorem ipsum dolor sit amet consectetur.',
      },
      {
        id: 2,
        author: 'Anonymous',
        body: 'Lorem ipsum dolor sit amet consectetur. Purus massa tristique arcu tempus ut ac porttitor. Lorem ipsum dolor sit amet consectetur.',
      },
      {
        id: 3,
        author: 'Anonymous',
        body: 'Lorem ipsum dolor sit amet consectetur. Purus massa tristique arcu tempus ut ac porttitor. Lorem ipsum dolor sit amet consectetur.',
      },
      {
        id: 4,
        author: 'Anonymous',
        body: 'Lorem ipsum dolor sit amet consectetur. Purus massa tristique arcu tempus ut ac porttitor. Lorem ipsum dolor sit amet consectetur.',
      },
    ],
    []
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        <span className="text-sm text-gray-400">(1040)</span>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-900 mb-2">{c.author}</div>
            <div className="text-sm text-gray-500 leading-relaxed">{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeSlotPanel = ({ availability }) => {
  const initialAppliedRef = useRef(false);
  const allDays = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
  const [isUpdating, setIsUpdating] = useState(false);

  const [selectedDays, setSelectedDays] = useState(() => ({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  }));

  const [daySlots, setDaySlots] = useState(() => {
    const initial = {};
    ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach((day) => {
      initial[day] = [{ from: '', to: '' }];
    });
    return initial;
  });

  const [initialStateStr, setInitialStateStr] = useState('');

  const selectedCount = Object.values(selectedDays).filter(Boolean).length;

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        await callApi({
          method: Method.GET,
          endPoint: api.therapistProfileMe,
          onSuccess: (response) => {
            const fetchedAvailability = response?.data?.availability;
            if (Array.isArray(fetchedAvailability)) {
              const nextSelected = { ...selectedDays };
              const nextSlots = {};
              allDays.forEach((day) => {
                nextSlots[day] = [{ from: '', to: '' }];
              });

              fetchedAvailability.forEach((d) => {
                const name = String(d?.day || '').trim().toLowerCase();
                const mapped =
                  name === 'monday'
                    ? 'Monday'
                    : name === 'tuesday'
                      ? 'Tuesday'
                      : name === 'wednesday'
                        ? 'Wednesday'
                        : name === 'thursday'
                          ? 'Thursday'
                          : name === 'friday'
                            ? 'Friday'
                            : name === 'saturday'
                              ? 'Saturday'
                              : name === 'sunday'
                                ? 'Sunday'
                                : null;

                if (!mapped) return;
                nextSelected[mapped] = true;
                const slots = Array.isArray(d?.timeSlots) ? d.timeSlots : [];
                if (slots.length > 0) {
                  nextSlots[mapped] = slots.slice(0, 3).map((s) => ({
                    from: s?.from || '',
                    to: s?.to || '',
                  }));
                }
              });

              setSelectedDays(nextSelected);
              setDaySlots(nextSlots);
              setInitialStateStr(JSON.stringify({
                selectedDays: nextSelected,
                daySlots: nextSlots
              }));
            }
          },
          onError: (err) => {
            console.error("Failed to fetch fresh availability", err);
          }
        });
      } catch (e) {
        console.error("Error fetching availability", e);
      }
    };

    fetchAvailability();
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const updateTime = (day, index, field, value) => {
    setDaySlots((prev) => {
      const daySlotsForDay = [...(prev[day] || [{ from: '', to: '' }])];
      const currentSlot = daySlotsForDay[index] || { from: '', to: '' };
      const updatedSlot = { ...currentSlot, [field]: value };
      daySlotsForDay[index] = updatedSlot;
      return {
        ...prev,
        [day]: daySlotsForDay,
      };
    });
  };

  const addSlot = (day) => {
    setDaySlots((prev) => {
      const current = prev[day] || [{ from: '', to: '' }];
      if (current.length >= 3) return prev;
      return {
        ...prev,
        [day]: [...current, { from: '', to: '' }],
      };
    });
  };

  const removeSlot = (day, index) => {
    setDaySlots((prev) => {
      const current = prev[day] || [{ from: '', to: '' }];
      if (current.length <= 1) return prev;
      let next;
      if (typeof index === 'number') {
        if (index < 0 || index >= current.length) return prev;
        next = [...current.slice(0, index), ...current.slice(index + 1)];
      } else {
        next = current.slice(0, -1);
      }
      if (next.length === 0) {
        next = [{ from: '', to: '' }];
      }
      return {
        ...prev,
        [day]: next,
      };
    });
  };

  const handleUpdate = async () => {
    const currentState = {
      selectedDays,
      daySlots
    };

    if (initialStateStr && JSON.stringify(currentState) === initialStateStr) {
      if (window.showToast) {
        window.showToast("No time slot changes detected.", "error");
      }
      return;
    }

    const invalidDays = [];
    const daysToValidate = allDays.filter(day => selectedDays[day]);

    const toMinutes = (time) => {
      const [h, m] = String(time || '').split(':').map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    const isValidSlot = (s) => {
      const start = toMinutes(s.from);
      const end = toMinutes(s.to);
      if (start == null || end == null) return false;
      const diff = end - start;
      return diff > 0 && diff <= 60;
    };
    for (const day of daysToValidate) {
      const slotsForDay = daySlots[day] || [];
      const filledSlots = slotsForDay.filter((s) => s.from || s.to);
      if (filledSlots.length === 0) {
        invalidDays.push(day);
        continue;
      }
      const hasInvalid = filledSlots.some((s) => !isValidSlot(s));
      if (hasInvalid) {
        invalidDays.push(day);
      }
    }

    if (invalidDays.length > 0) {
      if (window.showToast) {
        window.showToast(
          `Please check time slots for: ${invalidDays.join(
            ', '
          )}. Each slot must be at most 1 hour, and start time must be before end time.`,
          "error"
        );
      }
      return;
    }

    setIsUpdating(true);
    try {
      const initialObj = initialStateStr ? JSON.parse(initialStateStr) : {};
      const initialSelected = initialObj.selectedDays || {};

      for (const day of allDays) {
        if (!selectedDays[day] && !initialSelected[day]) {
          continue;
        }

        const slots = [];
        if (selectedDays[day]) {
          const slotsForDay = daySlots[day] || [];
          slots.push(...slotsForDay.filter((s) => isValidSlot(s)));
        }
        await callApi({
          method: Method.PATCH,
          endPoint: api.availability,
          bodyParams: {
            day: day.toLowerCase(),
            timeSlots: slots
          },
          onError: (err) => {
            console.error(`Failed to update ${day}`, err);
          }
        });
      }

      if (window.showToast) {
        window.showToast("Availability updated successfully!", "success");
      }
      setInitialStateStr(JSON.stringify(currentState));
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        {allDays.map((day) => (
          <div key={day} className="flex flex-col gap-3 pb-4 md:pb-0">
            <button
              type="button"
              onClick={() => toggleDay(day)}
              className="flex items-center gap-3 min-w-[140px] mb-2 md:mb-0"
            >
              <div
                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${selectedDays[day] ? 'bg-teal-700 border-teal-700' : 'border-gray-200 bg-white'
                  }`}
              >
                {selectedDays[day] ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
              <span className="text-base font-bold text-[#102a43]">{day}</span>
            </button>

            {selectedDays[day] ? (
              <div className="flex flex-col gap-3 w-full md:w-auto">
                {(daySlots[day] || [{ from: '', to: '' }]).map((slot, index, arr) => {
                  const isLast = index === arr.length - 1;
                  const canAdd = arr.length < 3;

                  return (
                    <div key={index} className="flex flex-wrap items-center gap-3 md:gap-4">
                      <div className="relative">
                        <input
                          type={slot.from ? "time" : "text"}
                          placeholder="From"
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          value={slot.from}
                          onChange={(e) => updateTime(day, index, 'from', e.target.value)}
                          className="w-[calc(50%-0.5rem)] md:w-[130px] px-4 py-3 rounded-xl bg-[#F8F8F8] text-sm text-gray-600 focus:outline-none placeholder-gray-400"
                        />
                      </div>
                      <div className="relative">
                        {index === 1 ? (
                          <button
                            type="button"
                            onClick={() => removeSlot(day, index)}
                            className="absolute -top-3 right-1 text-xs text-gray-800 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        ) : null}
                        <input
                          type={slot.to ? "time" : "text"}
                          placeholder="To"
                          onFocus={(e) => (e.target.type = "time")}
                          onBlur={(e) => {
                            if (!e.target.value) e.target.type = "text";
                          }}
                          value={slot.to}
                          onChange={(e) => updateTime(day, index, 'to', e.target.value)}
                          className="w-[calc(50%-0.5rem)] md:w-[130px] px-4 py-3 rounded-xl bg-[#F8F8F8] text-sm text-gray-600 focus:outline-none placeholder-gray-400"
                        />
                      </div>
                      {isLast ? (
                        <button
                          type="button"
                          onClick={() => (canAdd ? addSlot(day) : removeSlot(day))}
                          className="w-8 h-8 bg-teal-700 hover:bg-teal-800 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          {canAdd ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating}
            className={`bg-teal-700 text-white font-medium w-[312px] h-[50px] rounded-[12px] hover:bg-teal-800 transition-colors flex items-center justify-center ${isUpdating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
