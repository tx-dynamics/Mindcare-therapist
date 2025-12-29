import React, { useState, useRef } from 'react';
import images from '../assets/Images';

const EditProfile = ({ profile }) => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const displayName =
    profile?.name ||
    profile?.fullName ||
    profile?.user?.name ||
    profile?.user?.fullName ||
    'Therapist';
  const profileImage =
    profile?.profileImage ||
    profile?.user?.profileImage ||
    profile?.user?.avatar ||
    null;
  const bio = profile?.bio || '';
  const location = profile?.location || '';
  const specializations = Array.isArray(profile?.specializations) ? profile.specializations : [];

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
            ) : profileImage ? (
              <img src={profileImage} alt="Profile" className="w-20 h-20 rounded-full object-fill border-2 border-teal-700" />
            ) : (
              <img src={images.camera} alt="Profile" className="w-20 h-20 rounded-full object-cover " />
            )}
          </button>
          <h3 className="font-semibold text-lg mt-4">{displayName}</h3>
        </div>

        <div>
          {bio ? <p className="text-sm mt-4 whitespace-pre-line">{bio}</p> : null}
          <h3 className="font-semibold text-lg mt-4">Location</h3>
          <p className="text-sm mt-4">{location || '-'}</p>
          <h3 className="font-semibold text-lg mt-4">Specializations</h3>
          <div className="flex flex-row gap-2 flex-wrap">
            {specializations.length > 0
              ? specializations.map((spec) => (
                  <p key={spec} className="text-sm mt-4 bg-[#87CEEB] px-4 text-white p-2 rounded-xl">
                    {String(spec).replaceAll('_', ' ')}
                  </p>
                ))
              : <p className="text-sm mt-4">-</p>}
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
