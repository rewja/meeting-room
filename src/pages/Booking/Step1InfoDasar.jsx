import React, { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';
import meetingRoomAPI from '../../services/api';
import { getCurrentDate, getMinTime, validateBookingDate, getMinBookingDate, compareTime, validateBookingTime, getMinBookingTime, getMaxBookingTime, checkBookingConflict } from '../../utils/formatDate';

const Step1InfoDasar = ({ formData, setFormData, errors, setErrors }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cluster, setCluster] = useState('');
  const [existingBookings, setExistingBookings] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsData = await meetingRoomAPI.getRooms();
        setRooms(roomsData);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Fetch existing bookings saat room_name atau tanggal berubah
  useEffect(() => {
    const fetchBookings = async () => {
      if (!formData.room_name || !formData.tanggal) {
        setExistingBookings([]);
        return;
      }

      try {
        // Fetch bookings untuk tanggal tertentu
        const bookings = await meetingRoomAPI.getBookings({
          date: formData.tanggal
        });
        
        // Filter bookings untuk ruangan yang sama dan status yang relevan
        const filteredBookings = (bookings || []).filter(booking => {
          // Hanya cek booking di ruangan yang sama
          if (booking.room_name !== formData.room_name) return false;
          
          // Skip canceled meetings
          if (booking.status === 'canceled') return false;
          
          // Pastikan booking di tanggal yang sama
          if (booking.start_time) {
            const bookingDate = new Date(booking.start_time);
            const bookingDateStr = bookingDate.toISOString().split('T')[0];
            return bookingDateStr === formData.tanggal;
          }
          
          return false;
        });
        
        setExistingBookings(filteredBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setExistingBookings([]);
      }
    };

    fetchBookings();
  }, [formData.room_name, formData.tanggal]);

  // Clear conflict errors saat room_name atau tanggal berubah
  useEffect(() => {
    setErrors(prev => {
      const newErrors = { ...prev };
      // Clear conflict-related errors
      if (newErrors.jamMulai && newErrors.jamMulai.includes('bentrok')) {
        delete newErrors.jamMulai;
      }
      if (newErrors.jamSelesai && newErrors.jamSelesai.includes('bentrok')) {
        delete newErrors.jamSelesai;
      }
      return newErrors;
    });
  }, [formData.room_name, formData.tanggal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    // Handle file uploads
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      // Real-time validation for date field to show weekend error immediately
      if (name === 'tanggal' && value) {
        const dateValidationError = validateBookingDate(value, formData.jamMulai);
        if (dateValidationError) {
          setErrors(prev => ({
            ...prev,
            tanggal: dateValidationError
          }));
        } else {
          // Clear tanggal error if valid
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.tanggal;
            return newErrors;
          });
        }
        
        // Validasi ulang jamMulai saat tanggal berubah (untuk aturan 45 menit)
        if (formData.jamMulai) {
          const timeError = validateBookingTime(value, formData.jamMulai);
          if (timeError) {
            setErrors(prev => ({
              ...prev,
              jamMulai: timeError
            }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.jamMulai;
              return newErrors;
            });
          }
        }
      }
      
      // Real-time validation for time fields
      if ((name === 'jamMulai' || name === 'jamSelesai') && value) {
        const jamMulai = name === 'jamMulai' ? value : formData.jamMulai;
        const jamSelesai = name === 'jamSelesai' ? value : formData.jamSelesai;
        
        // Validate jamMulai with 45 minutes buffer rule
        if (name === 'jamMulai' && formData.tanggal && jamMulai) {
          const timeError = validateBookingTime(formData.tanggal, jamMulai);
          if (timeError) {
            setErrors(prev => ({
              ...prev,
              jamMulai: timeError
            }));
          } else {
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.jamMulai;
              return newErrors;
            });
          }
        }
        
        // Validate jam selesai > jam mulai dan dalam range 08:30 - 17:30
        if (jamMulai && jamSelesai) {
          // Validasi range jam selesai
          const endTimeError = validateBookingTime(formData.tanggal, jamSelesai);
          if (endTimeError) {
            setErrors(prev => ({
              ...prev,
              jamSelesai: endTimeError
            }));
          } else if (compareTime(jamSelesai, jamMulai) <= 0) {
            setErrors(prev => ({
              ...prev,
              jamSelesai: 'Jam selesai harus lebih dari jam mulai'
            }));
          } else {
            // Clear jamSelesai error if valid
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.jamSelesai;
              return newErrors;
            });
          }
        }

        // Check booking conflict dengan buffer 45 menit
        if (formData.room_name && formData.tanggal && jamMulai && jamSelesai) {
          const conflictCheck = checkBookingConflict(
            existingBookings,
            formData.room_name,
            formData.tanggal,
            jamMulai,
            jamSelesai
          );

          if (conflictCheck.hasConflict) {
            // Set error untuk jamMulai atau jamSelesai tergantung field yang diubah
            setErrors(prev => ({
              ...prev,
              [name === 'jamMulai' ? 'jamMulai' : 'jamSelesai']: conflictCheck.message
            }));
          } else {
            // Clear conflict error jika tidak ada konflik
            setErrors(prev => {
              const newErrors = { ...prev };
              // Hanya clear jika error tersebut adalah conflict message
              if (newErrors.jamMulai === conflictCheck.message || 
                  (newErrors.jamMulai && newErrors.jamMulai.includes('bentrok'))) {
                delete newErrors.jamMulai;
              }
              if (newErrors.jamSelesai === conflictCheck.message || 
                  (newErrors.jamSelesai && newErrors.jamSelesai.includes('bentrok'))) {
                delete newErrors.jamSelesai;
              }
              return newErrors;
            });
          }
        }
      }
      // Map UI fields to backend fields
      const fieldMapping = {
        'organizer_name': 'organizer_name',
        'agenda': 'agenda', 
        'room_name': 'room_name',
        'tanggal': 'tanggal',
        'jamMulai': 'jamMulai',
        'jamSelesai': 'jamSelesai',
        'jumlahPeserta': 'jumlahPeserta',
        'prioritas': 'prioritas',
        'booking_type': 'booking_type',
        'kode_project': 'kode_project',
        'nama_project': 'nama_project',
        'main_contractor': 'main_contractor',
        'project_manager': 'project_manager',
        'no_spk': 'no_spk',
        'waktu_penyelesaian': 'waktu_penyelesaian',
        'jenis_pekerjaan': 'jenis_pekerjaan',
        'uraian_pekerjaan': 'uraian_pekerjaan',
        'catatan_pekerjaan': 'catatan_pekerjaan'
      };

      const backendField = fieldMapping[name] || name;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Also update backend fields
        [backendField]: value
      }));
    }
    
    // Clear error when user starts typing (except for tanggal, jamMulai, jamSelesai which have real-time validation)
    if (errors[name] && name !== 'tanggal' && name !== 'jamMulai' && name !== 'jamSelesai') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    // Basic meeting info validation - hanya yang penting untuk admin GA
    if (!formData.organizer_name) newErrors.organizer_name = 'Nama pemohon wajib diisi';
    if (!formData.agenda) newErrors.agenda = 'Agenda wajib diisi';
    if (!cluster) newErrors.cluster = 'Pilih lokasi terlebih dahulu';
    if (!formData.room_name) newErrors.room_name = 'Pilih ruang meeting';
    if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
    if (!formData.jamMulai) newErrors.jamMulai = 'Jam mulai wajib diisi';
    if (!formData.jamSelesai) newErrors.jamSelesai = 'Jam selesai wajib diisi';
    if (!formData.jumlahPeserta) newErrors.jumlahPeserta = 'Jumlah peserta wajib diisi';
    if (!formData.prioritas) newErrors.prioritas = 'Prioritas meeting wajib diisi';
    if (!formData.booking_type) newErrors.booking_type = 'Tipe booking wajib dipilih';
    
    
    // Validate date logic
    if (formData.tanggal) {
      const dateValidationError = validateBookingDate(formData.tanggal, formData.jamMulai);
      if (dateValidationError) {
        newErrors.tanggal = dateValidationError;
      }
    }
    
    // Validate time logic - jam mulai dengan aturan 45 menit buffer
    if (formData.tanggal && formData.jamMulai) {
      const timeError = validateBookingTime(formData.tanggal, formData.jamMulai);
      if (timeError) {
        newErrors.jamMulai = timeError;
      }
    }
    
    // Validate time logic - jam selesai harus lebih besar dari jam mulai dan dalam range 08:30 - 17:30
    if (formData.jamSelesai) {
      const endTimeError = validateBookingTime(formData.tanggal, formData.jamSelesai);
      if (endTimeError) {
        newErrors.jamSelesai = endTimeError;
      }
    }
    if (formData.jamMulai && formData.jamSelesai) {
      if (compareTime(formData.jamSelesai, formData.jamMulai) <= 0) {
        newErrors.jamSelesai = 'Jam selesai harus lebih dari jam mulai';
      }
    }

    // Check booking conflict dengan buffer 45 menit
    if (formData.room_name && formData.tanggal && formData.jamMulai && formData.jamSelesai) {
      const conflictCheck = checkBookingConflict(
        existingBookings,
        formData.room_name,
        formData.tanggal,
        formData.jamMulai,
        formData.jamSelesai
      );

      if (conflictCheck.hasConflict) {
        newErrors.jamMulai = conflictCheck.message;
      }
    }
    
    // Validate participant count
    if (formData.jumlahPeserta && formData.room_name) {
      const selectedRoom = rooms.find(room => room.name === formData.room_name);
      if (selectedRoom && parseInt(formData.jumlahPeserta) > selectedRoom.capacity) {
        newErrors.jumlahPeserta = `Jumlah peserta melebihi kapasitas ruang (maksimal ${selectedRoom.capacity} orang)`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if all required fields are filled
  const isStepValid = () => {
    const allFieldsFilled = formData.organizer_name && formData.agenda && cluster && formData.room_name && 
           formData.tanggal && formData.jamMulai && formData.jamSelesai && 
           formData.jumlahPeserta && formData.prioritas && formData.booking_type;
    
    // Validate time logic - jam mulai dengan aturan 45 menit buffer
    const timeStartValid = !formData.tanggal || !formData.jamMulai || !validateBookingTime(formData.tanggal, formData.jamMulai);
    
    // Validate time logic - jam selesai harus lebih besar dari jam mulai
    const timeEndValid = !formData.jamMulai || !formData.jamSelesai || compareTime(formData.jamSelesai, formData.jamMulai) > 0;
    
    return allFieldsFilled && timeStartValid && timeEndValid;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Booking Ruang Meeting</h2>
        <p className="text-gray-600">Isi informasi dasar untuk booking ruang meeting</p>
      </div>

      {/* Informasi Dasar Meeting */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 md:p-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-6">Informasi Dasar Meeting</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nama Pemohon"
            name="organizer_name"
            value={formData.organizer_name}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap pemohon"
            required
            error={errors.organizer_name}
          />
          <FormInput
            label="Agenda Meeting"
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            placeholder="Masukkan agenda meeting"
            required
            error={errors.agenda}
          />
          {/* Lokasi/Cluster */}
          <FormInput
            label="Lokasi"
            type="select"
            name="cluster"
            value={cluster}
            onChange={(e) => {
              const value = e.target.value;
              setCluster(value);
              // Reset room_name sesuai cluster
              if (value === '689') {
                setFormData(prev => ({ ...prev, room_name: 'R. Meeting 689' }));
              } else if (value === '04') {
                setFormData(prev => ({ ...prev, room_name: 'R. Meeting 04' }));
              } else if (value === '08') {
                setFormData(prev => ({ ...prev, room_name: '' }));
              } else {
                setFormData(prev => ({ ...prev, room_name: '' }));
              }
            }}
            options={[
              { value: '', label: 'Pilih Lokasi' },
              { value: '08', label: '08' },
              { value: '689', label: '689' },
              { value: '04', label: '04' }
            ]}
            required
            error={errors.cluster}
            disabled={loading}
          />
          {/* Pilih Ruang sesuai cluster */}
          {cluster === '08' && (
            <FormInput
              label="Pilih Ruang Meeting"
              type="select"
              name="room_name"
              value={formData.room_name}
              onChange={handleChange}
              options={[
                { value: '', label: 'Pilih Ruang Meeting' },
                { value: 'R. Meeting 1', label: 'R. Meeting 1' },
                { value: 'R. Meeting 2', label: 'R. Meeting 2' },
                { value: 'R. Meeting Command Centre', label: 'R. Meeting Command Centre' },
                { value: 'Kantin VIP', label: 'Kantin VIP' }
              ]}
              required
              error={errors.room_name}
              disabled={loading}
            />
          )}
          {(cluster === '689' || cluster === '04') && (
            <div className="mb-6">
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Ruang Terpilih
              </label>
              <div className="w-full px-4 py-3 border-2 rounded-lg bg-gray-50 text-gray-700 border-gray-300">
                {cluster === '689' ? 'R. Meeting 689' : 'R. Meeting 04'}
              </div>
            </div>
          )}
          <div className="md:col-span-2">
            <FormInput
              label="Tanggal"
              type="date"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              required
              error={errors.tanggal}
              min={getMinBookingDate()}
              max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            />
            {!errors.tanggal && !formData.tanggal && (
              <p className="text-sm text-gray-500 mt-1 mb-2">
                ⓘ Booking hanya tersedia untuk hari kerja (Senin-Jumat). Weekend tidak dapat dibooking. Waktu booking tersedia dari 08:30 - 17:30. Untuk booking hari ini, waktu mulai minimal 45 menit dari sekarang.
              </p>
            )}
          </div>
          <FormInput
            label="Jam Mulai"
            type="time"
            name="jamMulai"
            value={formData.jamMulai}
            onChange={handleChange}
            required
            error={errors.jamMulai}
            min={formData.tanggal ? getMinBookingTime(formData.tanggal) : "08:30"}
            max={getMaxBookingTime()}
          />
          <FormInput
            label="Jam Selesai"
            type="time"
            name="jamSelesai"
            value={formData.jamSelesai}
            onChange={handleChange}
            required
            error={errors.jamSelesai}
            min={formData.jamMulai || "08:30"}
            max={getMaxBookingTime()}
          />
          <FormInput
            label="Jumlah Peserta"
            type="number"
            name="jumlahPeserta"
            value={formData.jumlahPeserta}
            onChange={handleChange}
            placeholder="Masukkan jumlah peserta"
            required
            error={errors.jumlahPeserta}
          />
          <FormInput
            label="Prioritas Meeting"
            type="select"
            name="prioritas"
            value={formData.prioritas}
            onChange={handleChange}
            options={[
              { value: '', label: 'Pilih Prioritas Meeting' },
              { value: 'reguler', label: 'Reguler' },
              { value: 'vip', label: 'VIP' }
            ]}
            required
            error={errors.prioritas}
          />
          <FormInput
            label="Tipe Booking"
            type="select"
            name="booking_type"
            value={formData.booking_type || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Pilih Tipe Booking' },
              { value: 'internal', label: 'Internal' },
              { value: 'external', label: 'Eksternal' }
            ]}
            required
            error={errors.booking_type}
          />
          {/* Email & Nomor Telepon dihapus sesuai permintaan */}
        </div>
      </div>


      {(() => {
        const selectedRoom = formData.room_name ? rooms.find(room => room.name === formData.room_name) : null;
        return selectedRoom ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-4">Informasi Ruang Terpilih</h4>
            <div className="text-sm text-blue-800">
              <p><strong>Kapasitas:</strong> {selectedRoom.capacity} orang</p>
              <p><strong>Lokasi:</strong> {selectedRoom.location}</p>
              <p><strong>Fasilitas:</strong> {selectedRoom.amenities?.join(', ') || 'Tidak ada'}</p>
            </div>
          </div>
        ) : null;
      })()}

      {/* Progress indicator */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress Step 1</span>
          <span className="text-sm text-gray-500">
            {isStepValid() ? '✓ Siap lanjut' : 'Lengkapi semua field'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isStepValid() ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ 
              width: `${Math.round(([
                formData.organizer_name,
                formData.agenda,
                cluster,
                formData.room_name,
                formData.tanggal,
                formData.jamMulai,
                formData.jamSelesai,
                formData.jumlahPeserta,
                formData.prioritas,
                formData.booking_type
              ].filter(Boolean).length / 10) * 100)}%` 
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {[
            formData.organizer_name,
            formData.agenda,
            cluster,
            formData.room_name,
            formData.tanggal,
            formData.jamMulai,
            formData.jamSelesai,
            formData.jumlahPeserta,
            formData.prioritas,
            formData.booking_type
          ].filter(Boolean).length} dari 10 field terisi
        </p>
      </div>
    </div>
  );
};

export default Step1InfoDasar;

