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
      <div
        className={`w-full md:flex-1 bg-white rounded-xl shadow-md mx-4 md:mx-0 max-[450px]:mx-2 h-fit min-h-[450px] ${
          selectedSection === 'timeSlot'
            ? 'p-2 sm:p-3 md:p-4 max-[450px]:p-2 pt-0 sm:pt-0 md:pt-0 max-[450px]:pt-0'
            : 'p-3 sm:p-4 md:p-6 max-[450px]:p-3'
        }`}
      >
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
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let isActive = true;
    setIsLoading(true);
    setApiError('');
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    const endPoint = `${api.feedbackAnonymous}?${params.toString()}`;
    void callApi({
      method: Method.GET,
      endPoint,
      onSuccess: (response) => {
        if (!isActive) return;
        const payload = response?.data ?? response;
        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];
        setItems(list);
        const total =
          Number(payload?.meta?.totalItems ?? payload?.totalItems ?? payload?.total ?? payload?.count ?? list.length) || 0;
        setTotalItems(total);
        setIsLoading(false);
      },
      onError: (err) => {
        if (!isActive) return;
        setItems([]);
        setApiError(err?.message || 'Failed to load feedback.');
        setIsLoading(false);
      },
    });
    return () => {
      isActive = false;
    };
  }, [page, limit]);

  return (
    <div className="pt-0 pl-2 pr-4 pb-4 md:pt-1 md:pl-4 md:pr-6 md:pb-6">
      <div className="flex items-baseline gap-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
        <span className="text-sm text-gray-400">({items.length})</span>
      </div>
      {apiError ? <div className="text-red-500 text-sm mb-4">{apiError}</div> : null}
      {isLoading ? <div className="text-gray-600 text-sm mb-4">Loading...</div> : null}
      <div className="space-y-4">
        {items.map((c, idx) => {
          const key = c?._id || c?.id || idx;
          const author = 'Anonymous';
          const body =
            c?.comment ||
            c?.text ||
            c?.feedback ||
            c?.message ||
            '-';
          return (
            <div key={key} className="rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
              <div className="text-sm font-semibold text-gray-900 mb-2">{author}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{body}</div>
            </div>
          );
        })}
        {!isLoading && items.length === 0 ? (
          <div className="text-gray-600 text-sm">No comments found.</div>
        ) : null}
      </div>
      {totalItems > limit && (
        <div className="flex flex-wrap items-center justify-end gap-2 mt-6">
          {Array.from({ length: Math.ceil(totalItems / limit) }).map((_, i) => {
            const num = i + 1;
            const active = num === page;
            return (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`px-3 py-1 rounded-lg border text-sm ${
                  active ? 'border-teal-700 bg-teal-700 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TimeSlotPanel = ({ availability }) => {
  const initialAppliedRef = useRef(false);
  const allDays = useMemo(() => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSame, setIsSame] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
              const nextSelected = {};
              const nextSlots = {};
              allDays.forEach((day) => {
                nextSelected[day] = false;
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
                const slots = Array.isArray(d?.timeSlots) ? d.timeSlots : [];
                const validSlots = slots.filter((s) => (s?.from || '').trim() && (s?.to || '').trim());
                if (validSlots.length > 0) {
                  nextSelected[mapped] = true;
                  nextSlots[mapped] = validSlots.slice(0, 3).map((s) => ({
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
    setSelectedDays((prev) => {
      const isSelecting = !prev[day];
      const next = { ...prev, [day]: isSelecting };

      if (isSelecting && isSame) {
        const sourceDay = allDays.find((d) => prev[d]);
        if (sourceDay && daySlots[sourceDay]) {
          const sourceSlots = (daySlots[sourceDay] || []).filter(
            (s) => (s.from || '').trim() && (s.to || '').trim()
          );
          setDaySlots((prevSlots) => ({
            ...prevSlots,
            [day]:
              sourceSlots.length > 0
                ? sourceSlots.slice(0, 2).map((s) => ({ from: s.from, to: s.to }))
                : [{ from: '', to: '' }],
          }));
        }
      }

      return next;
    });
  };

  const handleSameChange = () => {
    const newIsSame = !isSame;
    setIsSame(newIsSame);

    if (newIsSame) {
      const firstSelectedDay = allDays.find((day) => selectedDays[day]);
      if (firstSelectedDay && daySlots[firstSelectedDay]) {
        const sourceSlots = (daySlots[firstSelectedDay] || []).filter(
          (s) => (s.from || '').trim() && (s.to || '').trim()
        );

        setDaySlots((prev) => {
          const next = { ...prev };
          allDays.forEach((day) => {
            if (selectedDays[day] && day !== firstSelectedDay) {
              next[day] =
                sourceSlots.length > 0
                  ? sourceSlots.slice(0, 2).map((s) => ({ from: s.from, to: s.to }))
                  : [{ from: '', to: '' }];
            }
          });
          return next;
        });
      }
    }
  };

  const updateTime = (day, index, field, value) => {
    setDaySlots((prev) => {
      const daySlotsForDay = [...(prev[day] || [{ from: '', to: '' }])];
      const currentSlot = daySlotsForDay[index] || { from: '', to: '' };
      const updatedSlot = { ...currentSlot, [field]: value };
      daySlotsForDay[index] = updatedSlot;
      const next = {
        ...prev,
        [day]: daySlotsForDay,
      };

      const hasFilledSlot = daySlotsForDay.some(
        (slot) => (slot.from || '').trim() && (slot.to || '').trim()
      );
      setSelectedDays((prevSelected) => ({
        ...prevSelected,
        [day]: hasFilledSlot,
      }));

      return next;
    });
  };

  const addSlot = (day) => {
    setDaySlots((prev) => {
      const current = prev[day] || [{ from: '', to: '' }];
      if (current.length >= 2) return prev;
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
        window.showToast("No changes in time slots.", "error");
      }
      return;
    }

    const invalidDays = [];
    const duplicateDays = [];
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

      const keyMap = {};
      filledSlots.forEach((s) => {
        const fromTrim = (s.from || '').trim();
        const toTrim = (s.to || '').trim();
        if (!fromTrim || !toTrim) {
          return;
        }
        const key = `${fromTrim}__${toTrim}`;
        if (!keyMap[key]) {
          keyMap[key] = 0;
        }
        keyMap[key] += 1;
      });
      const hasDuplicate = Object.values(keyMap).some((count) => count > 1);
      if (hasDuplicate) {
        duplicateDays.push(day);
      }

      const hasInvalid = filledSlots.some((s) => !isValidSlot(s));
      if (hasInvalid) {
        invalidDays.push(day);
      }
    }

    if (duplicateDays.length > 0) {
      if (window.showToast) {
        window.showToast(
          `Remove duplicate time slots for: ${duplicateDays.join(', ')}`,
          "error"
        );
      }
      return;
    }

    if (invalidDays.length > 0) {
      if (window.showToast) {
        window.showToast(
          `Time slots for ${invalidDays.join(', ')} should be within an hour.`,
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
      {isEditing && (
        <>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Add Time slot</h1>
          <p className="text-sm text-gray-500 mb-4 max-w-xl">
           Use this page to update the therapist’s time slots. You can add, edit, or remove available session timings as needed.
          </p>
        </>
      )}

      {isEditing && (
        <div className="mb-4">
          <label className="flex items-center cursor-pointer gap-3">
            <div
              className={`w-4.5 h-4.5 rounded-[6px] border flex items-center justify-center transition-colors ${
                isSame ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
              }`}
            >
              {isSame && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={isSame}
              onChange={handleSameChange}
              className="hidden"
            />
            <span className="text-gray-900 text-base">Same time for all day</span>
          </label>
        </div>
      )}

      <div className="space-y-6">
        {allDays.map((day) => (
          <div key={day} className="flex flex-col gap-2 pb-4 md:pb-0">
            <div className="flex flex-nowrap items-center gap-4 overflow-x-auto pb-2 hide-scrollbar">
              <button
                type="button"
                onClick={isEditing ? () => toggleDay(day) : undefined}
                className="flex items-center gap-3 min-w-[120px]"
              >
                <div
                  className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${
                    selectedDays[day] ? 'bg-teal-700 border-teal-700' : 'border-gray-200 bg-white'
                  }`}
                >
                  {selectedDays[day] ? (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : null}
                </div>
                <span className="text-base font-bold text-[#102a43] whitespace-nowrap">{day}</span>
              </button>

              {selectedDays[day] ? (
                <div className="flex flex-nowrap items-center gap-3">
                  {(daySlots[day] || [{ from: '', to: '' }]).map((slot, index) => (
                    <React.Fragment key={index}>
                      <div className="relative">
                        <input
                          type={slot.from ? 'time' : 'text'}
                          placeholder="From"
                          onFocus={
                            isEditing
                              ? (e) => {
                                  e.target.type = 'time';
                                }
                              : undefined
                          }
                          onBlur={
                            isEditing
                              ? (e) => {
                                  if (!e.target.value) e.target.type = 'text';
                                }
                              : undefined
                          }
                          value={slot.from}
                          onChange={
                            isEditing
                              ? (e) => updateTime(day, index, 'from', e.target.value)
                              : undefined
                          }
                          readOnly={!isEditing}
                          className="w-[120px] h-[40px] px-3 rounded-[10px] bg-[#F8F8F8] text-sm text-gray-600 focus:outline-none placeholder-gray-400 opacity-100"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type={slot.to ? 'time' : 'text'}
                          placeholder="To"
                          onFocus={
                            isEditing
                              ? (e) => {
                                  e.target.type = 'time';
                                }
                              : undefined
                          }
                          onBlur={
                            isEditing
                              ? (e) => {
                                  if (!e.target.value) e.target.type = 'text';
                                }
                              : undefined
                          }
                          value={slot.to}
                          onChange={
                            isEditing
                              ? (e) => updateTime(day, index, 'to', e.target.value)
                              : undefined
                          }
                          readOnly={!isEditing}
                          className="w-[120px] h-[40px] px-3 rounded-[10px] bg-[#F8F8F8] text-sm text-gray-600 focus:outline-none placeholder-gray-400 opacity-100"
                        />
                      </div>
                    </React.Fragment>
                  ))}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() =>
                        (daySlots[day] || [{ from: '', to: '' }]).length < 2
                          ? addSlot(day)
                          : removeSlot(day)
                      }
                      className="w-8 h-8 bg-teal-700 hover:bg-teal-800 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      {(daySlots[day] || [{ from: '', to: '' }]).length < 2 ? (
                        <Plus className="w-4 h-4" />
                      ) : (
                        <Minus className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleUpdate();
              } else {
                setIsEditing(true);
              }
            }}
            disabled={isUpdating}
            className={`bg-teal-700 text-white font-medium w-[312px] h-[50px] rounded-[12px] hover:bg-teal-800 transition-colors flex items-center justify-center ${
              isUpdating ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isUpdating ? 'Updating...' : isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
