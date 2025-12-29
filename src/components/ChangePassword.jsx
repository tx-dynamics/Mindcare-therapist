import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { Method, callApi } from '../netwrok/NetworkManager';
import { api } from '../netwrok/Environment';

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Min 8 chars with upper, lower, number & symbol')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
      'Min 8 chars with upper, lower, number & symbol'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm your password'),
});

const ChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold mb-2">Change Password</h1>
          <h3 className="text-sm mb-4">Password change here</h3>
        </div>

        <Formik
          initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={ChangePasswordSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setApiError('');
            setSuccessMessage('');

            await callApi({
              method: Method.POST,
              endPoint: api.updatePassword,
              bodyParams: {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
              },
              onSuccess: (response) => {
                setSuccessMessage(response?.message || 'Password updated successfully.');
                resetForm();
              },
              onError: (error) => {
                setApiError(error?.message || 'Failed to update password. Please try again.');
              },
            });

            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Old Password</label>
                <div className="relative">
                  <Field
                    name="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Enter your old password"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-600 pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#8E8E93]"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {!showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
                <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <div className="relative">
                  <Field
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-600 pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#8E8E93]"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {!showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
                <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter new password"
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-600 pr-10"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#8E8E93]"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {!showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {apiError ? <div className="text-red-500 text-sm">{apiError}</div> : null}
              {successMessage ? <div className="text-green-600 text-sm">{successMessage}</div> : null}

              <button
                type="submit"
                className={`bg-teal-700 text-white px-6 py-2 rounded-md hover:bg-teal-800 w-full ${isSubmitting ? 'opacity-70 pointer-events-none' : ''}`}
              >
                Update
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default ChangePassword;
