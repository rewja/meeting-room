import React from 'react';
import { formatDate } from '../../utils/formatDate';
import { KEBUTUHAN_TAMBAHAN } from '../../utils/constants';
import FileUpload from '../../components/FileUpload';

const Step4Konfirmasi = ({ formData, setFormData, errors, setErrors }) => {
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file uploads
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Terms checkbox removed per request

  const validateStep = () => {
    const newErrors = {};
    if (!formData.spk_file) {
      newErrors.spk_file = 'File SPK wajib diupload untuk melanjutkan';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Konfirmasi Booking</h2>
        <p className="text-gray-600">Periksa kembali informasi booking Anda sebelum mengirim</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Booking</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Pemohon</label>
              <p className="mt-1 text-sm text-gray-900">{formData.organizer_name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe Booking</label>
              <p className="mt-1 text-sm text-gray-900">{formData.booking_type === 'internal' ? 'Internal' : formData.booking_type === 'external' ? 'Eksternal' : '-'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ruang Meeting</label>
              <p className="mt-1 text-sm text-gray-900">{formData.room_name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Agenda</label>
              <p className="mt-1 text-sm text-gray-900">{formData.agenda}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal & Waktu</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatDate(formData.tanggal)} 
              </p>
              <p className="text-sm text-gray-900">
                {formData.jamMulai} - {formData.jamSelesai}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Jumlah Peserta</label>
              <p className="mt-1 text-sm text-gray-900">{formData.jumlahPeserta} orang</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Prioritas</label>
              <p className="mt-1 text-sm text-gray-900">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.prioritas === 'vip' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {formData.prioritas === 'vip' ? 'VIP' : 'Reguler'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {formData.attendees && formData.attendees.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Daftar Peserta</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="space-y-2">
                {formData.attendees.map((attendee, index) => (
                  <li key={index} className="text-sm text-gray-900">
                    {attendee.name} ({attendee.email})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {formData.kebutuhan && formData.kebutuhan.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kebutuhan Tambahan</label>
            <div className="flex flex-wrap gap-2">
              {formData.kebutuhan.map((kebutuhanId) => {
                const kebutuhan = KEBUTUHAN_TAMBAHAN.find(k => k.id === kebutuhanId);
                return (
                  <span key={kebutuhanId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {kebutuhan?.label}
                  </span>
                );
              })}
            </div>
            
            {/* Detail Makanan dan Minuman */}
            {(formData.kebutuhan?.includes('makanan') || formData.kebutuhan?.includes('minuman')) && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Detail Tambahan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.kebutuhan?.includes('makanan') && formData.makanan_detail && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Detail Makanan</label>
                      <p className="text-sm text-gray-900 bg-white rounded p-2 border">{formData.makanan_detail}</p>
                    </div>
                  )}
                  {formData.kebutuhan?.includes('minuman') && formData.minuman_detail && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Detail Minuman</label>
                      <p className="text-sm text-gray-900 bg-white rounded p-2 border">{formData.minuman_detail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {formData.lainnya_detail && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Kebutuhan Lainnya</label>
            <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{formData.lainnya_detail}</p>
          </div>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Penting!</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Pastikan semua informasi sudah benar sebelum mengirim booking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload SPK */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Dokumen SPK</h3>
        <div className="space-y-4">
          <FileUpload
            label="File SPK (Surat Perintah Kerja)"
            name="spk_file"
            value={formData.spk_file}
            onChange={handleChange}
            error={errors.spk_file}
            required={true}
            accept=".pdf,.jpg,.jpeg,.png"
            maxSize={10 * 1024 * 1024} // 10MB
          />
          <div className="text-sm text-green-700">
            <p><strong>Format yang diizinkan:</strong> PDF, JPG, JPEG, PNG</p>
            <p><strong>Ukuran maksimal:</strong> 10MB</p>
            <p className="text-red-600 font-semibold">⚠️ File SPK wajib diupload untuk melanjutkan</p>
          </div>
        </div>
      </div>

      {/* Syarat & ketentuan checkbox dihapus sesuai permintaan */}
    </div>
  );
};

export default Step4Konfirmasi;
