import React from 'react'
import images from '../assets/Images';

const AuthLayout = ({ title = "Welcome", children }) => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Left Section */}
      <div className="w-full lg:w-[60%] relative bg-black h-[50vh] lg:h-full">
        <img
          src={images.therapyImage}
          alt="Therapy Session"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="relative z-10 p-6 md:p-10 text-white h-full flex flex-col justify-between">
          <div>
            <h1 className="text-white text-3xl md:text-5xl font-nunitoBold">MindCare</h1>
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-nunitoBold leading-tight">
              Lorem ipsum dolor sit amet, consectetur.
            </h2>
            <p className="mt-4 text-sm md:text-base font-nunitoReguler">
              Praesent gravida tincidunt blandit. Ut porta aliquet nulla. Nullam vel
              metus semper, ullamcorper ipsum sed, lacinia mauris. Suspendisse potenti.
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center items-center bg-white p-6 md:p-10">
        <h2 className="text-3xl md:text-4xl font-nunitoSemiBold mb-6">{title}</h2>
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
