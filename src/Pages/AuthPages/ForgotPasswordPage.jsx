
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthLayout from '../../layout/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});
export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout
      title="Forgot Password"
      description="Enter your email to receive a 6-digit OTP to reset your password."
    >
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async (values, { setSubmitting }) => {
          await callApi({
            method: Method.POST,
            endPoint: api.forgotPassword,
            bodyParams: { email: values.email },
            onSuccess: (response) => {
              if (response?.screen === 'OTP' || response?.status === 'otp_sent') {
                navigate('/OTPPage', {
                  state: {
                    email: values.email,
                    otpCooldown: response?.otpCooldown,
                    flow: 'forgot_password',
                  },
                });
                return;
              }

              navigate('/OTPPage', { state: { email: values.email, flow: 'forgot_password' } });
            },
            onError: (error) => {
              // Handled by global toaster
            },
          });

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Enter Your Mail"
                className="w-full px-4 py-3 border border-[#A1B0CC] rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 "
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-0 " />
            </div>
            <PrimaryButton
              type="submit"
              className={`${isSubmitting ? 'opacity-70 pointer-events-none' : ''} mt-6`}
            >
              SEND OTP
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </AuthLayout>
  );
};
