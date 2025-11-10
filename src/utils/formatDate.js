export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString) => {
  return timeString;
};

export const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getMinTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const validateBookingDate = (dateString, timeString = null) => {
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is in the past
  if (selectedDate < today) {
    return 'Tanggal tidak boleh di masa lalu';
  }
  
  // Check if date is today
  const isToday = selectedDate.getTime() === today.getTime();
  if (isToday && timeString) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (timeString < currentTime) {
      return 'Waktu booking tidak boleh di masa lalu';
    }
  }
  
  // Check if date is weekend (Saturday = 6, Sunday = 0)
  if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) {
    return 'Booking hanya tersedia untuk hari kerja (Senin-Jumat). Weekend tidak dapat dibooking.';
  }
  
  // Check if date is too far in the future (30 days limit)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  if (selectedDate > maxDate) {
    return 'Booking maksimal 30 hari ke depan';
  }
  
  return '';
};

export const getMinBookingDate = () => {
  const today = new Date();
  if (today.getDay() === 0) { // If Sunday, jump to Monday
    today.setDate(today.getDate() + 1);
  } else if (today.getDay() === 6) { // If Saturday, jump to Monday
    today.setDate(today.getDate() + 2);
  }
  return today.toISOString().split('T')[0];
};

/**
 * Membandingkan dua waktu dalam format HH:mm
 * @param {string} time1 - Waktu pertama (format HH:mm)
 * @param {string} time2 - Waktu kedua (format HH:mm)
 * @returns {number} - Negatif jika time1 < time2, 0 jika sama, positif jika time1 > time2
 */
export const compareTime = (time1, time2) => {
  if (!time1 || !time2 || typeof time1 !== 'string' || typeof time2 !== 'string') {
    throw new Error('Invalid time format: time1 and time2 must be strings');
  }
  
  const parts1 = time1.split(':');
  const parts2 = time2.split(':');
  
  if (parts1.length < 2 || parts2.length < 2) {
    throw new Error('Invalid time format: expected HH:mm');
  }
  
  const [h1, m1] = parts1.map(Number);
  const [h2, m2] = parts2.map(Number);
  
  if (isNaN(h1) || isNaN(m1) || isNaN(h2) || isNaN(m2)) {
    throw new Error('Invalid time format: time values must be numbers');
  }
  
  const minutes1 = (h1 || 0) * 60 + (m1 || 0);
  const minutes2 = (h2 || 0) * 60 + (m2 || 0);
  return minutes1 - minutes2;
};

/**
 * Mendapatkan waktu minimal yang bisa dipilih untuk booking
 * Jika tanggal adalah hari ini, return waktu sekarang + 45 menit (minimal 08:30)
 * Jika tanggal adalah hari lain, return "08:30"
 * @param {string} dateString - Tanggal dalam format YYYY-MM-DD
 * @returns {string} - Waktu minimal dalam format HH:mm
 */
export const getMinBookingTime = (dateString) => {
  if (!dateString) return "08:30";
  
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Jika tanggal adalah hari ini, return waktu sekarang + 45 menit (minimal 08:30)
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const minTime = new Date(now.getTime() + 45 * 60 * 1000); // Tambah 45 menit
    const hours = minTime.getHours();
    const minutes = minTime.getMinutes();
    
    // Pastikan minimal 08:30
    if (hours < 8 || (hours === 8 && minutes < 30)) {
      return "08:30";
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  // Jika tanggal di masa depan, return waktu default 08:30
  return "08:30";
};

/**
 * Mendapatkan waktu maksimal yang bisa dipilih untuk booking
 * @returns {string} - Waktu maksimal dalam format HH:mm (17:30)
 */
export const getMaxBookingTime = () => {
  return "17:30";
};

/**
 * Validasi waktu booking dengan aturan:
 * 1. Waktu tidak boleh di masa lalu
 * 2. Jika tanggal adalah hari ini, waktu harus minimal 45 menit dari sekarang
 * 3. Waktu harus dalam range 08:30 - 17:30
 * @param {string} dateString - Tanggal dalam format YYYY-MM-DD
 * @param {string} timeString - Waktu dalam format HH:mm
 * @returns {string} - Pesan error jika tidak valid, string kosong jika valid
 */
export const validateBookingTime = (dateString, timeString) => {
  if (!dateString || !timeString) {
    return '';
  }
  
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Cek jika tanggal di masa lalu
  if (selectedDate < today) {
    return 'Waktu booking tidak boleh di masa lalu';
  }
  
  // Validasi range jam 08:30 - 17:30
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeInMinutes = (hours || 0) * 60 + (minutes || 0);
  const minTimeInMinutes = 8 * 60 + 30; // 08:30
  const maxTimeInMinutes = 17 * 60 + 30; // 17:30
  
  if (timeInMinutes < minTimeInMinutes) {
    return 'Waktu booking minimal 08:30';
  }
  
  if (timeInMinutes > maxTimeInMinutes) {
    return 'Waktu booking maksimal 17:30';
  }
  
  // Jika tanggal adalah hari ini, validasi dengan aturan 45 menit
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const selectedDateTime = new Date(dateString);
    selectedDateTime.setHours(hours || 0, minutes || 0, 0, 0);
    
    // Hitung selisih waktu dalam milidetik
    const diffInMs = selectedDateTime.getTime() - now.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    
    // Jika waktu di masa lalu
    if (diffInMinutes < 0) {
      return 'Waktu booking tidak boleh di masa lalu';
    }
    
    // Jika waktu kurang dari 45 menit ke depan
    if (diffInMinutes < 45) {
      return 'Waktu booking harus minimal 45 menit dari waktu saat ini';
    }
  }
  
  return '';
};

/**
 * Menambahkan buffer time 45 menit ke waktu akhir booking
 * @param {Date} endTime - Waktu akhir booking
 * @returns {Date} - Waktu akhir dengan buffer 45 menit
 */
export const addBufferTime = (endTime) => {
  return new Date(endTime.getTime() + 45 * 60 * 1000);
};

/**
 * Mengecek konflik booking dengan meeting lain
 * Mempertimbangkan buffer 45 menit setelah setiap meeting
 * @param {Array} existingBookings - Array booking yang sudah ada
 * @param {string} roomName - Nama ruangan yang akan dibooking
 * @param {string} dateString - Tanggal booking (YYYY-MM-DD)
 * @param {string} startTimeString - Waktu mulai (HH:mm)
 * @param {string} endTimeString - Waktu selesai (HH:mm)
 * @param {number} excludeId - ID booking yang akan di-exclude (untuk edit)
 * @returns {Object} - { hasConflict: boolean, message: string }
 */
export const checkBookingConflict = (
  existingBookings,
  roomName,
  dateString,
  startTimeString,
  endTimeString,
  excludeId = null
) => {
  if (!existingBookings || !Array.isArray(existingBookings)) {
    return { hasConflict: false, message: '' };
  }

  if (!roomName || !dateString || !startTimeString || !endTimeString) {
    return { hasConflict: false, message: '' };
  }

  // Buat Date object untuk waktu booking baru
  const [year, month, day] = dateString.split('-').map(Number);
  const [startHour, startMinute] = startTimeString.split(':').map(Number);
  const [endHour, endMinute] = endTimeString.split(':').map(Number);

  const newStart = new Date(year, month - 1, day, startHour, startMinute, 0, 0);
  const newEnd = new Date(year, month - 1, day, endHour, endMinute, 0, 0);

  // Validasi waktu
  if (newStart >= newEnd) {
    return {
      hasConflict: true,
      message: 'Jam selesai harus lebih dari jam mulai'
    };
  }

  // Filter bookings yang relevan (same room, same date, not canceled, not excluded)
  const relevantBookings = existingBookings.filter((booking) => {
    // Exclude booking yang sedang diedit
    if (excludeId && booking.id === excludeId) return false;
    
    // Hanya cek booking di ruangan yang sama
    if (booking.room_name !== roomName) return false;
    
    // Skip canceled meetings
    if (booking.status === 'canceled') return false;
    
    // Cek apakah booking di tanggal yang sama
    const bookingDate = new Date(booking.start_time);
    const bookingDateStr = bookingDate.toISOString().split('T')[0];
    return bookingDateStr === dateString;
  });

  // Cek konflik dengan setiap booking yang relevan
  for (const booking of relevantBookings) {
    const existingStart = new Date(booking.start_time);
    const existingEnd = new Date(booking.end_time);
    
    // Tambahkan buffer 45 menit setelah meeting selesai
    const existingEndWithBuffer = new Date(existingEnd.getTime() + 45 * 60 * 1000);
    
    // Cek apakah ada overlap
    // Konflik terjadi jika:
    // 1. newStart < existingEndWithBuffer (waktu mulai baru sebelum waktu selesai existing + buffer)
    // 2. newEnd > existingStart (waktu selesai baru setelah waktu mulai existing)
    if (newStart < existingEndWithBuffer && newEnd > existingStart) {
      const conflictStartTime = existingStart.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const conflictEndTime = existingEnd.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return {
        hasConflict: true,
        message: `Waktu booking bentrok dengan meeting "${booking.agenda || 'Meeting'}" (${conflictStartTime} - ${conflictEndTime}). Ruangan baru bisa dibooking lagi mulai ${existingEndWithBuffer.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} (45 menit setelah meeting selesai).`
      };
    }
  }

  return { hasConflict: false, message: '' };
};

