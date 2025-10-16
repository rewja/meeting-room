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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Summary</h1>
          <p className="text-gray-600 mb-6">Tidak ada data booking yang ditemukan.</p>
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#800000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors"
          >
            Buat Booking Baru
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Booking Berhasil!</h1>
        <p className="text-gray-600 text-sm">Booking ruang meeting Anda telah berhasil dibuat</p>
      </div>

      {/* Container Utama */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-sm p-6 max-w-3xl mx-auto">
        {/* Header Section */}
        <h2 className="text-lg font-semibold text-gray-900 pb-2 mb-4 border-b border-gray-300">Detail Booking</h2>
        
        {/* Informasi Umum - Grid 2 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kolom kiri */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Booking ID</span>
              <span className="text-gray-900 font-mono">#{bookingData.booking_id || bookingData.id}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Ruang Meeting</span>
              <span className="text-gray-900">{bookingData.room_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Agenda</span>
              <span className="text-gray-900">{bookingData.agenda}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Tanggal</span>
              <span className="text-gray-900">{new Date(bookingData.start_time).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Kolom kanan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Waktu</span>
              <span className="text-gray-900">{new Date(bookingData.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - {new Date(bookingData.end_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Nama Pemohon</span>
              <span className="text-gray-900">{bookingData.organizer_name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Status</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{bookingData.status === 'scheduled' ? 'Terjadwal' : bookingData.status}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
              <span className="text-gray-600 font-medium">Tipe Booking</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">{bookingData.booking_type === 'internal' ? 'Internal' : 'Eksternal'}</span>
            </div>
            {bookingData.prioritas && (
              <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm">
                <span className="text-gray-600 font-medium">Prioritas</span>
                <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">{bookingData.prioritas === 'vip' ? 'VIP' : 'Reguler'}</span>
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
                    className="inline-flex items-center px-3 py-2 rounded text-white text-sm bg-[#b71c1c] hover:bg-[#a31616]"
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

        {/* Footer Tombol Aksi */}
        <div className="mt-6 pt-3 border-t border-gray-300">
          <div className="flex justify-center gap-4">
            <Link
              to="/"
              className="inline-flex justify-center items-center px-6 py-3 rounded text-white bg-[#b71c1c] hover:bg-[#a31616]"
            >
              Kembali ke Beranda
            </Link>
            <Link
              to="/schedule"
              className="inline-flex justify-center items-center px-6 py-3 rounded text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Lihat Jadwal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;






