import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Stepper from '../../components/Stepper';
import Step1InfoDasar from './Step1InfoDasar';
import Step3Kebutuhan from './Step3Kebutuhan';
import Step4Konfirmasi from './Step4Konfirmasi';
import meetingRoomAPI from '../../services/api';
import { checkBookingConflict, validateBookingTime } from '../../utils/formatDate';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Get preset data from TimeSlotBooking
  const presetData = location.state?.presetData || {};
  const [formData, setFormData] = useState({
    // Backend fields
    room_name: presetData.room_name || '',
    agenda: '',
    start_time: presetData.start_time || '',
    end_time: presetData.end_time || '',
    organizer_name: '',
    organizer_email: '',
    organizer_phone: '',
    attendees: [],
    lainnya_detail: '',
    booking_type: '',
    
    // Additional UI fields
    tanggal: presetData.tanggal || '',
    jamMulai: presetData.jamMulai || '',
    jamSelesai: presetData.jamSelesai || '',
    jumlahPeserta: '',
    jenisTamu: '',
    priorityRole: '',
    kontakTamu: '',
    kebutuhan: [],
    partition: '',
    catatan: '',
    spkFile: null,
    persetujuan: false,
    
    // SPK file only
    spk_file: null,
    prioritas: '',
    makanan_detail: '',
    minuman_detail: ''
  });
  const [errors, setErrors] = useState({});
  const [existingBookings, setExistingBookings] = useState([]);

  const steps = [
    'Informasi Dasar',
    'Kebutuhan & Tata Ruang',
    'Konfirmasi'
  ];

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Check if current step is valid (for button styling)
  const isCurrentStepValid = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.organizer_name || !formData.agenda || !formData.room_name || 
            !formData.tanggal || !formData.jamMulai || !formData.jamSelesai || !formData.jumlahPeserta ||
            !formData.prioritas || !formData.booking_type) {
          return false;
        }
        if (formData.jamMulai && formData.jamSelesai && formData.jamMulai >= formData.jamSelesai) {
          return false;
        }
        return true;
        
      case 2:
        // Require makanan_detail when 'makanan' selected
        if ((formData.kebutuhan || []).includes('makanan')) {
          if (!(formData.makanan_detail && formData.makanan_detail.trim())) return false;
        }
        // Require minuman_detail when 'minuman' selected
        if ((formData.kebutuhan || []).includes('minuman')) {
          if (!(formData.minuman_detail && formData.minuman_detail.trim())) return false;
        }
        // Require lainnya_detail when 'lainnya' selected
        if ((formData.kebutuhan || []).includes('lainnya')) {
          if (!(formData.lainnya_detail && formData.lainnya_detail.trim())) return false;
        }
        return true;
        
      case 3:
        return !!formData.spk_file;
        
      case 4:
        // Terms checkbox removed
        return true;
        
      default:
        return false;
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        // Step 1: Informasi Dasar
        if (!formData.organizer_name) newErrors.organizer_name = 'Nama organizer wajib diisi';
        if (!formData.agenda) newErrors.agenda = 'Agenda wajib diisi';
        if (!formData.room_name) newErrors.room_name = 'Pilih ruang meeting';
        if (!formData.tanggal) newErrors.tanggal = 'Tanggal wajib diisi';
        if (!formData.jamMulai) newErrors.jamMulai = 'Jam mulai wajib diisi';
        if (!formData.jamSelesai) newErrors.jamSelesai = 'Jam selesai wajib diisi';
        if (!formData.jumlahPeserta) newErrors.jumlahPeserta = 'Jumlah peserta wajib diisi';
        
        // Validate time logic
        if (formData.jamMulai && formData.jamSelesai) {
          if (formData.jamMulai >= formData.jamSelesai) {
            newErrors.jamSelesai = 'Jam selesai harus lebih dari jam mulai';
          }
        }
        break;
        
      case 2:
        // Step 2: Kebutuhan & Tata Ruang
        // Require makanan_detail when 'makanan' selected
        if ((formData.kebutuhan || []).includes('makanan')) {
          if (!formData.makanan_detail || !formData.makanan_detail.trim()) {
            newErrors.makanan_detail = 'Detail makanan wajib diisi saat memilih Makanan';
          }
        }
        // Require minuman_detail when 'minuman' selected
        if ((formData.kebutuhan || []).includes('minuman')) {
          if (!formData.minuman_detail || !formData.minuman_detail.trim()) {
            newErrors.minuman_detail = 'Detail minuman wajib diisi saat memilih Minuman';
          }
        }
        // Require lainnya_detail when 'lainnya' selected
        if ((formData.kebutuhan || []).includes('lainnya')) {
          if (!formData.lainnya_detail || !formData.lainnya_detail.trim()) {
            newErrors.lainnya_detail = 'Kebutuhan lainnya wajib diisi saat memilih Lainnya';
          }
        }
        break;
        
      case 3:
        // Step 3: Konfirmasi - SPK file required
        if (!formData.spk_file) {
          newErrors.spk_file = 'File SPK wajib diupload untuk melanjutkan';
        }
        break;
        
      case 4:
        // Step 4: Konfirmasi (no terms checkbox)
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch existing bookings untuk validasi konflik
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

  const handleSubmit = async () => {
    // Ensure SPK file is provided
    if (!formData.spk_file) {
      setErrors({ spk_file: 'File SPK wajib diupload untuk melanjutkan' });
      return;
    }
    try {
        // Build start_time and end_time from tanggal + jam in 'YYYY-MM-DD HH:mm:ss' (local time)
        const formatDateTime = (dateStr, timeStr) => {
          if (!dateStr || !timeStr) return '';
          const [y, m, d] = dateStr.split('-').map(Number);
          const [hh, mm] = timeStr.split(':').map(Number);
          const dt = new Date(y, (m || 1) - 1, d, hh || 0, mm || 0, 0, 0);
          const pad = (n) => String(n).padStart(2, '0');
          return `${y}-${pad(m)}-${pad(d)} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`;
        };

        const startTime = formData.start_time || formatDateTime(formData.tanggal, formData.jamMulai);
        const endTime = formData.end_time || formatDateTime(formData.tanggal, formData.jamSelesai);

        // Client-side guard: start must be >= now and end > start
        const now = new Date();
        const toDateObj = (s) => {
          // s like 'YYYY-MM-DD HH:mm:ss' local
          const [datePart, timePart] = s.split(' ');
          const [yy, mm, dd] = datePart.split('-').map(Number);
          const [HH, MM, SS] = timePart.split(':').map(Number);
          return new Date(yy, (mm || 1) - 1, dd, HH || 0, MM || 0, SS || 0, 0);
        };
        const startDate = toDateObj(startTime);
        const endDate = toDateObj(endTime);
        if (startDate < now) {
          setErrors({ submit: 'Waktu mulai harus setelah waktu sekarang' });
          return;
        }
        if (!(endDate > startDate)) {
          setErrors({ submit: 'Waktu selesai harus lebih besar dari waktu mulai' });
          return;
        }

        // Validasi range jam 08:30 - 17:30
        if (formData.tanggal && formData.jamMulai) {
          const startTimeError = validateBookingTime(formData.tanggal, formData.jamMulai);
          if (startTimeError) {
            setErrors({ submit: startTimeError });
            return;
          }
        }
        
        if (formData.tanggal && formData.jamSelesai) {
          const endTimeError = validateBookingTime(formData.tanggal, formData.jamSelesai);
          if (endTimeError) {
            setErrors({ submit: endTimeError });
            return;
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
            setErrors({ submit: conflictCheck.message });
            return;
          }
        }

        // Prepare data for backend
        const bookingData = {
          room_name: formData.room_name,
          agenda: formData.agenda,
          start_time: startTime,
          end_time: endTime,
          organizer_name: formData.organizer_name,
          organizer_email: formData.organizer_email,
          organizer_phone: formData.organizer_phone,
          attendees: formData.attendees,
          jumlah_peserta: parseInt(formData.jumlahPeserta),
          booking_type: formData.booking_type,
          
          // SPK file and priority
          spk_file: formData.spk_file,
          prioritas: formData.prioritas,
          
          // Additional needs
          kebutuhan: Array.isArray(formData.kebutuhan) ? formData.kebutuhan : [],
          makanan_detail: formData.makanan_detail || '',
          minuman_detail: formData.minuman_detail || '',
          lainnya_detail: formData.lainnya_detail || ''
        };

        // Submit to backend
        const result = await meetingRoomAPI.bookRoom(bookingData);
        
        // Navigate to success page with booking data
        navigate('/summary', { 
          state: { 
            bookingData: {
              // Merge original submitted fields with backend response
              ...bookingData,
              ...result.meeting,
              booking_id: result.booking_id,
              message: result.message
            }
          } 
        });
      } catch (error) {
        console.error('Booking error:', error);
        setErrors({ 
          submit: error.message || 'Terjadi kesalahan saat memproses booking' 
        });
      }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1InfoDasar
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 2:
        return (
          <Step3Kebutuhan
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <Step4Konfirmasi
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      default:
        return null;
    }
  };

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

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
            Form Booking Ruang Meeting
          </h1>
          <p className="text-lg md:text-xl text-gray-300">Isi form berikut untuk memesan ruang meeting</p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-6 md:p-8 lg:p-12 border border-white/20">
          <Stepper currentStep={currentStep} steps={steps} />
          
          <div className="mt-8">
            {renderStep()}
            
            {errors.submit && (
              <div className="mt-4 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 md:px-8 py-3 border rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400'
                  : 'border-slate-400 text-slate-700 hover:bg-slate-700 hover:text-white hover:shadow-md'
              }`}
            >
              Sebelumnya
            </button>

            <div className="flex space-x-4">
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                  className={`w-full sm:w-auto px-6 md:px-8 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
                    isCurrentStepValid()
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={false}
                  className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:shadow-lg"
                >
                  Kirim Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

