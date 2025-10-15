import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import meetingRoomAPI from '../services/api';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const roomsData = await meetingRoomAPI.getRooms();
        setRooms(roomsData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);
  
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistem sederhana untuk memesan ruang meeting.
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Kelola dan pesan ruang meeting dengan mudah dan efisien
        </p>
        <Link
          to="/booking"
          className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-[#800000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors"
        >
          Pesan Ruang Meeting
        </Link>
      </div>

      {/* Rooms Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Daftar Ruang Meeting
        </h2>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#800000]"></div>
            <p className="mt-2 text-gray-600">Memuat data ruangan...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {error}</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Mengapa Memilih Roomify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[#800000] bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Mudah</h3>
            <p className="text-gray-600">Proses booking yang sederhana dan cepat dalam beberapa langkah</p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#001f3f] bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#001f3f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manajemen Terpusat</h3>
            <p className="text-gray-600">Kelola semua booking dan jadwal dalam satu tempat</p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#800000] bg-opacity-10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Update</h3>
            <p className="text-gray-600">Status ruang dan booking selalu ter-update</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Home;

