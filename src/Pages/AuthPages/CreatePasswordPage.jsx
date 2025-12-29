import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react'; 
import AuthLayout from '../../layout/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
import { useAuthStore } from '../../store/authSlice';
const CreatePasswordPage = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const flow = location?.state?.flow;
  const token = useAuthStore((s) => s.token);
  const requiresOldPassword = flow !== 'forgot_password';

  const CreatePasswordSchema = Yup.object().shape({
    oldPassword: requiresOldPassword ? Yup.string().required('Old password is required') : Yup.string(),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Min 8 chars with upper, lower, number & symbol')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
        'Min 8 chars with upper, lower, number & symbol'
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  });

  return (
    <AuthLayout
      title="Create Password"
      description={
        flow === 'forgot_password'
          ? 'Create a new password for your account.'
          : 'Update your password by confirming your current password.'
      }
    >
      <Formik
        initialValues={{ oldPassword: '', password: '', confirmPassword: '' }}
        validationSchema={CreatePasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setApiError('');

          if (flow === 'forgot_password') {
            if (!email) {
              setApiError('Email is missing. Please restart the reset flow.');
              setSubmitting(false);
              return;
            }

            await callApi({
              method: Method.POST,
              endPoint: api.resetPassword,
              bodyParams: {
                email,
                newPassword: values.password,
              },
              onSuccess: () => {
                navigate('/');
              },
              onError: (error) => {
                setApiError(error?.message || 'Failed to reset password. Please try again.');
              },
            });

            setSubmitting(false);
            return;
          }

          if (!token) {
            setApiError('You are not signed in. Please sign in again.');
            setSubmitting(false);
            return;
          }

          await callApi({
            method: Method.POST,
            endPoint: api.updatePassword,
            bodyParams: {
              oldPassword: values.oldPassword,
              newPassword: values.password,
            },
            onSuccess: () => {
              navigate('/');
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
            {requiresOldPassword ? (
              <div>
                <div className="relative">
                  <Field
                    name="oldPassword"
                    type={showOldPassword ? 'text' : 'password'}
                    placeholder="Enter Your Old Password"
                    className="w-full px-4 py-3 border border-[#A1B0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
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
            ) : null}
            {/* Password Field */}
            <div>
            <div className="relative">
              <Field
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Your New Password"
                className="w-full px-4 py-3 border border-[#A1B0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#8E8E93]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Confirm Password Field */}
            <div>

            <div className="relative">
              <Field
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm Password"
                               className="w-full mb-4 px-4 py-3 border border-[#A1B0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"

              />
              <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#8E8E93] "
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {!showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
              </div>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1 " />
            </div>

            {apiError ? <div className="text-red-500 text-sm">{apiError}</div> : null}
            <PrimaryButton type="submit" className={isSubmitting ? 'opacity-70 pointer-events-none' : ''}>
              UPDATE PASSWORD
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};

export default CreatePasswordPage;
