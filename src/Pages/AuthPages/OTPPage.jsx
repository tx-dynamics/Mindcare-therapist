import AuthLayout from '../../layout/AuthLayout';
import PrimaryButton from '../../components/PrimaryButton';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Method, callApi } from '../../netwrok/NetworkManager';
import { api } from '../../netwrok/Environment';
  const OTPPage = () => {
     const [otp, setOtp] = useState(['', '', '', '','','']);
     const [isWide, setIsWide] = useState(typeof window !== 'undefined' ? window.innerWidth > 380 : false);
     const location = useLocation();
     const email = location?.state?.email;
     const otpCooldown = location?.state?.otpCooldown;
     const flow = location?.state?.flow;
     const [seconds, setSeconds] = useState(
      typeof otpCooldown === 'number' ? otpCooldown : 60
     );
     const [isSubmitting, setIsSubmitting] = useState(false);
     const navigate =useNavigate();
      useEffect(() => {
   
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
   }, [seconds]);
  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth > 380);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
//   useFocusEffect(
//   useCallback(() => {
//     setOtp(""); // Clea return () => {}; // No cleanup needed
//   setSeconds(60); 
//   }, [])
//);
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };
  const handleChange = (value , index) => {
    if (!/^\d?$/.test(value)) return
    const updated = [...otp]
    updated[index] = value
    setOtp(updated)
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleVerify = async () => {
    const otpValue = otp.join('');

    if (!email) {
      // Show toaster error
      return;
    }

    if (otpValue.length !== 6) {
      // Show toaster error
      return;
    }

    if (flow === 'forgot_password') {
      setIsSubmitting(true);
      await callApi({
        method: Method.POST,
        endPoint: api.verifyOtpForgotPassword,
        bodyParams: { email, otp: otpValue },
        onSuccess: () => {
          navigate('/create-password', { state: { email, flow } });
        },
        onError: () => {
          // Handled by global toaster
        },
      });
      setIsSubmitting(false);
      return;
    }

    navigate('/create-password', { state: { email, flow } });
  };

  return (
    <AuthLayout
      title="OTP"
      description={email ? `Enter the 6-digit code sent to ${email}.` : 'Enter the 6-digit code to continue.'}
    >
     <div className="w-full max-w-[420px] mx-auto px-2 sm:px-0">
      <div className={`grid ${isWide ? 'grid-cols-6' : 'grid-cols-4'} gap-2 sm:gap-3 md:gap-4 justify-items-center mb-3`}>
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className={`mb-2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-center text-xl sm:text-2xl font-medium border border-[#A1B0CC] border-[1px] rounded-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${!isWide && index === 4 ? 'col-start-2' : ''} ${!isWide && index === 5 ? 'col-start-3' : ''}`}
          />
        ))}
      </div>
     </div>
<div className=" mb-6 mt-6">
 <p className="text-center text-lg text-teal-700 mb-2 mt=12">
            {formatTime(seconds)}
      </p>
    <button
  onClick={() => setSeconds(60)}
  disabled={seconds > 0}
  className={`
     w-full flex justify-center mb-6
    ${seconds > 0 ? 'text-gray-400 font-normal cursor-not-allowed' : 'text-black font-semibold'}
  `}
>
  <p className="text-center text-sm ">
    Send Again
  </p>
</button>
</div>
            <PrimaryButton onClick={handleVerify} className={isSubmitting ? 'opacity-70 pointer-events-none' : ''}>
              VERIFY
            </PrimaryButton>
      
    </AuthLayout>
  );
};

export default OTPPage;









