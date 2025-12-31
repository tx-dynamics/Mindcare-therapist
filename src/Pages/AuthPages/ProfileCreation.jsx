import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthLayout from '../../layout/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import images from '../../assets/Images';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, X } from 'lucide-react';
import TimeSlot from '../../components/TimeSlot';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
import { useAuthStore } from '../../store/authSlice';

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  location: Yup.string().required('Location is required'),
  bio: Yup.string().required('Bio is required'),
  specializations: Yup.array()
    .min(1, 'Please select at least one specialization')
    .of(Yup.string())
});

const ProfileCreation = () => {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draftProfile, setDraftProfile] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const specializations = ['Stress', 'Anxiety', 'Sleep', 'Focus'];
  const updateUserData = useAuthStore((s) => s.updateUserData);

  const toggleSpecialization = (item, setFieldValue) => {
    const updated = selectedSpecializations.includes(item)
      ? selectedSpecializations.filter((i) => i !== item)
      : [...selectedSpecializations, item];

    setSelectedSpecializations(updated);
    setFieldValue('specializations', updated); // Sync with Formik
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file); // preview URL
      setImage(previewUrl);
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      await callApi({
        method: Method.POST,
        endPoint: api.s3Upload,
        bodyParams: formData,
        multipart: true,
        onSuccess: (response) => {
          const url = response?.data?.url ?? response?.data ?? response?.url;
          if (url) {
            setImage(url);
            window.showToast?.("Image uploaded successfully", "success");
          } else {
            console.warn("S3 Upload response missing URL");
          }
          setIsUploading(false);
        },
        onError: (err) => {
          window.showToast?.("Failed to upload image", "error");
          setIsUploading(false);
          setImage(null);
        }
      });
    }
  };
  const mapSpecializationKey = (value) => {
    const mapping = {
      Stress: 'stress_management',
      Anxiety: 'anxiety',
      Sleep: 'sleep',
      Focus: 'focus',
    };
    if (mapping[value]) return mapping[value];
    return String(value).trim().toLowerCase().replaceAll(' ', '_');
  };

  const handleSubmitProfile = async (availability) => {
    if (!draftProfile || isSavingProfile) return;
    setIsSavingProfile(true);

    const payload = {
      name: draftProfile.name,
      profileImage: image || undefined,
      location: draftProfile.location,
      bio: draftProfile.bio,
      specializations: (draftProfile.specializations || []).map(mapSpecializationKey),
      availability,
    };

    await callApi({
      method: Method.POST,
      endPoint: api.therapistProfile,
      bodyParams: payload,
      onSuccess: (response) => {
        const updated = response?.data;
        if (updated?.user?.isProfileCompleted != null) {
          updateUserData({ isProfileCompleted: updated.user.isProfileCompleted });
        } else {
          updateUserData({ isProfileCompleted: true });
        }
        setIsModalOpen(false);
        navigate('/home');
      },
      onError: (err) => {
        // Handled by global toaster
      },
    });

    setIsSavingProfile(false);
  };
  const Modal = ({ onClose, children }) => {
    return (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50"
        onClick={() => setIsModalOpen(false)}
      >
        <div
          className="bg-white rounded-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
          {children}
        </div>
      </div>
    );
  };
  return (
    <div className='min-height flex'>
      <AuthLayout title="Profile Creation" description="Complete your profile to start receiving appointments.">
        <Formik
          initialValues={{ name: '', location: '', bio: '', specializations: [] }}
          validationSchema={ProfileSchema}
          onSubmit={(values) => {
            if (isUploading) {
              window.showToast?.("Please wait for image upload to complete", "warning");
              return;
            }
            setDraftProfile(values);
            setIsModalOpen(true);
          }}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form className="space-y-1 h-min">


              {/* Profile Image Upload */}
              <div className="flex justify-center items-center ">
                <label htmlFor="imageUpload" className="cursor-pointer relative">
                  <img
                    src={image || images.camera}
                    alt="Upload"
                    className={`w-[120px] h-[120px] rounded-full ${image ? 'border-2 border-teal-700 object-fill' : 'object-contain'
                      }`}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Name */}
              <Field
                name="name"
                type="text"
                placeholder="Add Your Name"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name && touched.name ? 'border-red-500' : 'border-[#A1B0CC]'
                  }`}
              />

              {/* Location */}
              <div className="relative w-full max-w-md">
                <Field
                  name="location"
                  type="text"
                  placeholder="Location"
                  className={`w-full px-4 py-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.location && touched.location ? 'border-red-500' : 'border-[#A1B0CC]'
                    }`}
                />
                <MapPin
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {/* Bio moved to top */}
              <Field
                as="textarea"
                name="bio"
                placeholder="Bio"
                className={`w-full px-4 py-3 h-32 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${errors.bio && touched.bio ? 'border-red-500' : 'border-[#A1B0CC]'
                  }`}
              />
              {/* Specializations */}
              <h6 className="text-sm text-gray-500 mb-4 ">Specialization</h6>
              <div className="flex flex-wrap gap-2 mt-2">
                {specializations.map((item) => {
                  const isSelected = selectedSpecializations.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleSpecialization(item, setFieldValue)}
                      className={`px-4 py-2 rounded-full text-sm font-medium mb-2 ${isSelected ? 'bg-teal-600 text-white' : 'bg-gray-300 text-gray-700'}`}

                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <ErrorMessage name="specializations" component="div" className="text-red-500 text-sm mt-1" />

              {/* Submit Button */}
              <div className="flex justify-end items-center mt-4">
                <PrimaryButton type="submit">NEXT</PrimaryButton>
              </div>
            </Form>
          )}
        </Formik>

      </AuthLayout>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>

          <TimeSlot onNext={handleSubmitProfile} isSubmitting={isSavingProfile} />

        </Modal>
      )}
    </div>
  );
};

export default ProfileCreation;
