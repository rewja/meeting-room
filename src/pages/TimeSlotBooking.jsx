import React from 'react';
import { Link } from 'react-router-dom';

const TimeSlotBooking = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Time Slot Booking</h1>
        <p className="text-gray-600">Pilih waktu yang tersedia untuk booking ruang meeting</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fitur Time Slot Booking</h2>
          <p className="text-gray-600 mb-6">
            Fitur ini akan memungkinkan Anda untuk melihat dan memilih slot waktu yang tersedia 
            untuk booking ruang meeting.
          </p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Coming Soon</h3>
              <p className="text-blue-800 text-sm">
                Fitur time slot booking sedang dalam pengembangan dan akan segera tersedia.
              </p>
            </div>
            
            <Link
              to="/booking"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#800000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors"
            >
              Lanjutkan ke Form Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotBooking;














