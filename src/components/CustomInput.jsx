import React from 'react'
import { ErrorMessage, useField } from 'formik';


function CustomInput({ label, suffix, ...props }) {
     const [field, meta] = useField(props);
  return (
     <div className="mb-4 w-full">
       <div className="relative">
        <input
          {...field}
          {...props}
          className={`w-full px-4 py-2 border ${
            meta.touched && meta.error ? 'border-red-500' : 'border-[#A1B0CC]'
          } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder-gray-400`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>
      {meta.touched && meta.error && (
        <p className="text-red-500 text-sm mt-1">{meta.error}</p>
      )}
    </div>
  )
}

export default CustomInput