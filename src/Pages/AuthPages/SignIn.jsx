import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import PrimaryButton from '../../components/PrimaryButton';
import CustomInput from '../../components/CustomInput';
import AuthLayout from '../../layout/AuthLayout';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
import { useAuthStore } from '../../store/authSlice';

export default function SignIn() {
  const [apiError, setApiError] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setRefreshToken = useAuthStore((s) => s.setRefreshToken);
  const setUserData = useAuthStore((s) => s.setUserData);

  const loginValidationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('email is Required'),
  password: Yup.string()
  .min(8, 'Min 8 chars with upper, lower, number & symbol')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
    'Min 8 chars with upper, lower, number & symbol'
  )
  .required('Password is required'),
  });
  const navigate = useNavigate(); 

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
   <AuthLayout title="Welcome Back" description="Sign in to manage appointments, sessions, and your profile.">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setApiError('');

          await callApi({
            method: Method.POST,
            endPoint: api.signIn,
            bodyParams: {
              email: values.email,
              password: values.password,
            },
            onSuccess: (response) => {
              const accessToken = response?.accessToken;
              const refreshToken = response?.refreshToken;

              if (typeof accessToken === 'string' && accessToken.length > 0) {
                setToken(accessToken);
              }
              if (typeof refreshToken === 'string' && refreshToken.length > 0) {
                setRefreshToken(refreshToken);
              }
              if (response?.user) {
                setUserData(response.user);
              }

              if (response?.user?.isProfileCompleted) {
                navigate('/home/dashboard');
                return;
              }

              navigate('/create-profile');
            },
            onError: (error) => {
              setApiError(error?.message || 'Sign in failed. Please try again.');
            },
          });

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <CustomInput name="email" type="email" placeholder="Enter Your Mail" />
            <CustomInput name="password" type="password" placeholder="Enter Your Password" />
            {apiError ? <div className="text-red-500 text-sm">{apiError}</div> : null}
            <div className="flex justify-end">
              <button 
                onClick={handleForgotPassword}
              type="button" className="text-md text-[#8E8E93]  mb-4"  >
                Forgot Password?
              </button>
            </div>
            <PrimaryButton type="submit" className={isSubmitting ? 'opacity-70 pointer-events-none' : ''}>
              SIGN IN
            </PrimaryButton>
          </Form>
        )}
      </Formik>
      
        
    </AuthLayout>
  );
}
