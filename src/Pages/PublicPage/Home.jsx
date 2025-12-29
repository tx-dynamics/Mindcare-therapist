import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import SidebarItem from '../../components/SideBarItem';
import images from '../../assets/Images';
import TopBar from '../../components/TopBar';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
import { useAuthStore } from '../../store/authSlice';

const sidebarItems = [
  { label: 'Dashboard', icon: images.dash },
  { label: 'Appointments', icon: images.workout },
  { label: 'Track Attendance', icon: images.track },
  { label: 'Session History', icon: images.track },

  { label: 'Sign Out', icon: images.Signout, isLast: true },
];

const Home = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('Dashboard');
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const logout = useAuthStore((s) => s.logout);
  const [therapistProfile, setTherapistProfile] = useState(null);

  useEffect(() => {
    callApi({
      method: Method.GET,
      endPoint: api.therapistProfileMe,
      onSuccess: (response) => {
        const payload = response?.data ?? response;
        const data = payload?.data ?? payload;
        const me = data?.therapistProfile ?? data?.profile ?? data?.therapist ?? data;
        setTherapistProfile(me);
      },
      onError: () => {
        setTherapistProfile(null);
      },
    });
  }, []);

  const handleClick = async (label) => {
    setSelected(label);
    switch (label) {
      case 'Dashboard':
        navigate('dashboard'); // relative to /Dashboard
        break;
      case 'Appointments':
        navigate('appointments');
        break;
      case 'Track Attendance':
        navigate('track-attendance');
        break;
      case 'Session History':
        navigate('session-history');
        break;

      case 'My Profile':
        navigate('my-profile');
        break;
      case 'Sign Out':
        await callApi({
          method: Method.POST,
          endPoint: api.logout,
          bodyParams: { refreshToken },
          onSuccess: () => {
            logout();
            navigate('/', { replace: true });
          },
          onError: () => {
            logout();
            navigate('/', { replace: true });
          },
        });
        break;
      default:
      // navigate('dashboard');
    }
  };
  return (
    <div className="flex min-h-screen">
      <aside className="w-[95px] sm:w-[230px] bg-white  p-6 fixed inset-y-0 left-0 flex flex-col">
        <h1 className="text-xl font-bold text-teal-700 mb-6 text-center w-full flex justify-center">
          <span className="hidden sm:inline">MindCare</span>
          <span className="sm:hidden">MC</span>
        </h1>

        <div className="flex-1 flex flex-col space-y-3">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={selected === item.label}
              onClick={() => handleClick(item.label)}
              isLast={item.isLast}
            />
          ))}
        </div>
      </aside>

      <main className="ml-[95px] sm:ml-[230px] p-6 flex-1 bg-slate-100 min-h-screen">
        <TopBar
          profile={therapistProfile}
          onClick={() => {
            setSelected('My Profile');
            navigate('my-profile');
          }}
        />
        <div className="mt-6">
          <Outlet context={{ therapistProfile }} />
        </div>
      </main>
    </div>
  );
};

export default Home;
