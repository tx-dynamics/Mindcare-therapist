import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import EditProfile from '../../components/EditProfile';
import ChangePassword from '../../components/ChangePassword';
import TermsConditions from '../../components/TermCondition';
import PrivacyPolicy from '../../components/PrivacyPolicy';

const MyProfile = () => {
  const [selectedSection, setSelectedSection] = useState('editProfile');
  const { therapistProfile } = useOutletContext() || {};

  const renderContent = () => {
    switch (selectedSection) {
      case 'editProfile':
        return <EditProfile profile={therapistProfile} />;
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
    <div className="min-h-screen  flex flex-col md:flex-row  gap-4">
      <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
        <MenuItem
          label="Edit Profile"
          subtitle="Details about your Personal Information"
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
          subtitle="Lorem ipsum dolor sit"
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
      <div className="w-full md:flex-1  bg-white rounded-xl shadow-md p-4 self-start">
        {renderContent()}
      </div>
    </div>
  );
};

const MenuItem = ({ label, subtitle, onClick, active }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-4 rounded-xl shadow-sm border flex justify-between items-center ${
      active ? 'border-teal-700' : 'border-gray-100'
    } bg-white hover:bg-gray-50 transition`}
  >
    <div>
      <div className="font-semibold text-black">{label}</div>
      {subtitle ? <div className="text-xs text-gray-500 mt-1">{subtitle}</div> : null}
    </div>
    <ChevronRight className="w-4 h-4 text-gray-500" />
  </div>
);

const ToggleItem = ({ label }) => {
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 bg-white">
      <div>
        <div className="font-semibold text-black">{label}</div>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 rounded-full p-1 transition ${enabled ? 'bg-teal-600' : 'bg-gray-300'}`}
      >
        <div className={`w-4 h-4 rounded-full bg-white transition transform ${enabled ? 'translate-x-6' : ''}`}></div>
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
  const allDays = useMemo(() => ['Monday', 'Tuesday', 'Wednesday'], []);

  const [selectedDays, setSelectedDays] = useState(() => ({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
  }));

  const [daySlots, setDaySlots] = useState(() => ({
    Monday: { slot1: { from: '', to: '' }, slot2: { from: '', to: '' } },
    Tuesday: { slot1: { from: '', to: '' }, slot2: { from: '', to: '' } },
    Wednesday: { slot1: { from: '', to: '' }, slot2: { from: '', to: '' } },
  }));

  const [showSlot2, setShowSlot2] = useState(() => ({
    Monday: false,
    Tuesday: true,
    Wednesday: false,
  }));

  useEffect(() => {
    if (initialAppliedRef.current) return;
    if (!Array.isArray(availability) || availability.length === 0) return;

    const nextSelected = { ...selectedDays };
    const nextSlots = { ...daySlots };
    const nextShow2 = { ...showSlot2 };

    availability.forEach((d) => {
      const name = String(d?.day || '').trim().toLowerCase();
      const mapped =
        name === 'monday'
          ? 'Monday'
          : name === 'tuesday'
            ? 'Tuesday'
            : name === 'wednesday'
              ? 'Wednesday'
              : null;

      if (!mapped) return;
      nextSelected[mapped] = true;
      const slots = Array.isArray(d?.timeSlots) ? d.timeSlots : [];
      if (slots[0]) nextSlots[mapped].slot1 = { from: slots[0]?.from || '', to: slots[0]?.to || '' };
      if (slots[1]) {
        nextSlots[mapped].slot2 = { from: slots[1]?.from || '', to: slots[1]?.to || '' };
        nextShow2[mapped] = true;
      }
    });

    setSelectedDays(nextSelected);
    setDaySlots(nextSlots);
    setShowSlot2(nextShow2);
    initialAppliedRef.current = true;
  }, [availability, daySlots, selectedDays, showSlot2]);

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const updateTime = (day, slot, field, value) => {
    setDaySlots((prev) => ({
      ...prev,
      [day]: { ...prev[day], [slot]: { ...prev[day][slot], [field]: value } },
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6">
        {allDays.map((day) => (
          <div key={day} className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => toggleDay(day)}
              className="flex items-center gap-3 min-w-[120px]"
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedDays[day] ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'
                }`}
              >
                {selectedDays[day] ? (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : null}
              </div>
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </button>

            {selectedDays[day] ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-4">
                  <input
                    type="time"
                    value={daySlots[day].slot1.from}
                    onChange={(e) => updateTime(day, 'slot1', 'from', e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                  <input
                    type="time"
                    value={daySlots[day].slot1.to}
                    onChange={(e) => updateTime(day, 'slot1', 'to', e.target.value)}
                    className="w-28 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                {showSlot2[day] ? (
                  <div className="flex flex-wrap gap-4">
                    <input
                      type="time"
                      value={daySlots[day].slot2.from}
                      onChange={(e) => updateTime(day, 'slot2', 'from', e.target.value)}
                      className="w-28 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                    <input
                      type="time"
                      value={daySlots[day].slot2.to}
                      onChange={(e) => updateTime(day, 'slot2', 'to', e.target.value)}
                      className="w-28 px-3 py-2 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ))}

        <div className="flex justify-end pt-6">
          <button
            type="button"
            className="bg-teal-700 text-white font-medium px-14 py-3 rounded-xl hover:bg-teal-800 transition-colors"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
