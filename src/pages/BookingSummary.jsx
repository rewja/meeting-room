import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const BookingSummary = () => {
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const [objectUrl, setObjectUrl] = useState('');

  // Build preview URL for SPK when it's a File/Blob
  const spkUrl = useMemo(() => {
    if (!bookingData?.spk_file) return '';
    if (typeof bookingData.spk_file === 'string') return bookingData.spk_file;
    try {
      return objectUrl;
    } catch (_) {
      return '';
    }
  }, [bookingData, objectUrl]);

  useEffect(() => {
    if (!bookingData?.spk_file) return;
    if (typeof bookingData.spk_file === 'string') return;
    try {
      const url = URL.createObjectURL(bookingData.spk_file);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (_) {}
  }, [bookingData]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-900 relative overflow-hidden py-8 md:py-12">
        {/* Professional Meeting Room Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
            alt="Professional Meeting Room"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-10 border border-white/20">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Summary</h1>
            <p className="text-gray-600 mb-6">Tidak ada data booking yang ditemukan.</p>
            <Link
              to="/booking"
              className="inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Buat Booking Baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden py-8 md:py-12">
      {/* Professional Meeting Room Background Image - Same as Hero */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80"
          alt="Professional Meeting Room"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay untuk readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/80 to-slate-900/85"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mb-6 shadow-lg">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Booking Berhasil!</h1>
          <p className="text-xl text-gray-300">Booking ruang meeting Anda telah berhasil dibuat</p>
        </div>

        {/* Container Utama */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 lg:p-10 border border-white/20">
        {/* Header Section */}
        <h2 className="text-xl font-bold text-gray-900 pb-3 mb-6 border-b border-gray-200">Detail Booking</h2>
        
        {/* Informasi Umum - Grid 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom kiri */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Booking ID</span>
              <span className="text-gray-900 font-mono font-bold">#{bookingData.booking_id || bookingData.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Ruang Meeting</span>
              <span className="text-gray-900 font-medium">{bookingData.room_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Agenda</span>
              <span className="text-gray-900 font-medium">{bookingData.agenda}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Tanggal</span>
              <span className="text-gray-900 font-medium">{new Date(bookingData.start_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Kolom kanan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Waktu</span>
              <span className="text-gray-900 font-medium">{new Date(bookingData.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(bookingData.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Nama Pemohon</span>
              <span className="text-gray-900 font-medium">{bookingData.organizer_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Status</span>
              <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700">{bookingData.status === 'scheduled' ? 'Terjadwal' : bookingData.status}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="text-gray-600 font-semibold">Tipe Booking</span>
              <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">{bookingData.booking_type === 'internal' ? 'Internal' : 'Eksternal'}</span>
            </div>
            {bookingData.prioritas && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-gray-600 font-semibold">Prioritas</span>
                <span className="inline-flex px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">{bookingData.prioritas === 'vip' ? 'VIP' : 'Reguler'}</span>
              </div>
            )}
          </div>
        </div>


        {/* Tampilkan detail kebutuhan tambahan jika ada */}
        {(bookingData.kebutuhan?.length > 0 || bookingData.makanan_detail || bookingData.minuman_detail || bookingData.lainnya_detail) && (
          <div className="mt-6">
            <div className="bg-gray-50 border border-gray-300 rounded-md">
              <div className="px-4 py-2 border-b border-gray-300 text-sm font-semibold text-gray-900">Detail Tambahan</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">Kebutuhan Tambahan</label>
                  <p className="mt-1 text-sm text-gray-900">{(bookingData.kebutuhan || []).join(', ') || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">Detail Makanan</label>
                  <p className="mt-1 text-sm text-gray-900">{bookingData.makanan_detail || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">Detail Minuman</label>
                  <p className="mt-1 text-sm text-gray-900">{bookingData.minuman_detail || '-'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">Kebutuhan Lainnya</label>
                  <p className="mt-1 text-sm text-gray-900">{bookingData.lainnya_detail || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dokumen SPK */}
        {(bookingData.spk_file || bookingData.spk_file_path) && (spkUrl || bookingData.spk_file_path) && (
          <div className="mt-6 border-t border-gray-300 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Dokumen SPK</span>
              {(() => {
                const url = spkUrl || (bookingData.spk_file_path ? `/storage/${bookingData.spk_file_path}` : '');
                return url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Lihat SPK
                  </a>
                ) : null;
              })()}
              </div>
          </div>
        )}

        {bookingData.attendees && bookingData.attendees.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">Peserta</label>
            <div className="mt-1">
              <ul className="text-sm text-gray-900">
                {bookingData.attendees.map((attendee, index) => (
                  <li key={index} className="py-1">
                    {attendee.name} ({attendee.email})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
};

export default BookingSummary;






