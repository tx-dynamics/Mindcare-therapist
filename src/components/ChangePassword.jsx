import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const ChangePassword = () => (
<div className="flex items-center justify-center ">
  <div className="space-y-4 items-center justify-center text-center">
    <div>
      <h1 className="text-3xl font-semibold mb-2">Change Password</h1>
      <h3 className="text-sm mb-4">Password change here</h3>
    </div>
    <div>
      <label className="block text-sm font-medium mb-1 text-left">Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-600"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1 text-left">Confirm Password</label>
      <input
        type="password"
        placeholder="Re-enter password"
        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-teal-600"
      />
    </div>
    <button className="bg-teal-700 text-white px-6 py-2 rounded-md hover:bg-teal-800 w-full">
      Update
    </button>
  </div>
</div>

);
export default ChangePassword;