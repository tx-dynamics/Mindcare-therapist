import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Star, FileText, MessageSquare } from 'lucide-react';
import images from '../../assets/Images';
import { appointmentsData } from '../../components/Data';
import Home from '../AuthPages/Home';

const Dashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Sample data matching the structure from the images
  const statisticsData = {
    totalAppointments: 345,
    completed: 245,
    myComments: 1040
  };

 

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleBackClick = () => {
    setSelectedAppointment(null);
  };

  if (selectedAppointment) {
    return (
      <div className="min-h-screen font-nunito">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg  p-6 md:p-8">
            {/* Back Button */}
            <button 
              onClick={handleBackClick}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">Back to Appointments</span>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Appointment date & time</h2>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Mental Health Goals</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.goals}</p>
            </div>

            {/* Note */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Note</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.note}</p>
            </div>

            {/* AI Summary */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">AI Summary</h2>
              <p className="text-gray-600 leading-relaxed">{selectedAppointment.aiSummary}</p>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
 
      <div className="max-w-6xl mx-auto">
        {/* Statistics Section */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Total Appointments */}
           <div className=" rounded-lg border border-black p-6">
              <div className="flex items-center mb-4">
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Total Appointments</h3>
                </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Total</span>
                <span className="text-gray-400 mr-2">→</span>
                <span className="text-2xl font-bold text-teal-600">{statisticsData.totalAppointments}</span>
              </div>
            </div>

            {/* Completed */}
            <div className=" rounded-lg border border-black p-6">
              <div className="flex items-center mb-4">
              
                  <FileText className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Completed</h3>
                </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Total</span>
                <span className="text-gray-400 mr-2">→</span>
                <span className="text-2xl font-bold text-teal-600">{statisticsData.completed}</span>
              </div>
            </div>

            {/* My Comments */}
           <div className=" rounded-lg border border-black p-6">
              <div className="flex items-center mb-4">
                  <Star className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">My Comments</h3>
                </div>
             
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Total</span>
                <span className="text-gray-400 mr-2">→</span>
                <span className="text-sm font-bold text-gray-600">{statisticsData.myComments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today Appointments Section */}
        <div>
             <h4 className="text-lg font-semibold text-gray-800 mb-6">Today Appointments</h4>
       
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {appointmentsData.map((appointment) => (
              <div 
                key={appointment.id}
                onClick={() => handleAppointmentClick(appointment)}
                className="bg-white rounded-2xl  p-6 cursor-pointer  duration-200"
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
    </div>
  );
};

export default Dashboard;