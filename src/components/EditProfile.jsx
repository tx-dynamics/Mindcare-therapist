import React, { useState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import images from '../assets/Images';

const EditProfile = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex px-4">
      <div className="space-y-4 w-full max-w-md ">
        {/* Hidden file input */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden" 
          ref={fileInputRef}
        />
        
        <div className='flex flex-row item-center'> 
          <button 
            onClick={handleButtonClick} 
            className='flex hover:opacity-80 transition-opacity'
          >
            {image ? (
              <img src={image} alt="Profile" className="w-20 h-20 rounded-full object-fill border-2 border-teal-700" />
            ) : (
              <img src={images.camera} alt="Profile" className="w-20 h-20 rounded-full object-cover " />
            )}
          </button>
          <h3 className="font-semibold text-lg mt-4">Name Here</h3>
        </div>

        <div>
          <p className=" text-sm mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercita </p>
        <h3 className="font-semibold text-lg mt-4 ">Location</h3>
        <p className=" text-sm mt-4"> 2972 Westheimer Rd. Santa Ana, Illinois 85486 </p>
            <h3 className="font-semibold text-lg mt-4 ">Specializations</h3>
            <div className='flex flex-row gap-2'> 
      <p className="text-sm mt-4 bg-[#87CEEB] px-10 text-white p-2 rounded-xl">Stress</p>
         <p className="text-sm mt-4 bg-[#87CEEB] px-10 text-white p-2 rounded-xl">Stress</p>
</div>
        </div>
<div className="flex justify-center w-full pt-4">
        <button className="bg-teal-700 text-white ml-46 px-6 py-2 rounded-xl hover:bg-teal-800 w-full transition-colors ">
          Update
        </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;