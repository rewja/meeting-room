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
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  const minutes1 = (h1 || 0) * 60 + (m1 || 0);
  const minutes2 = (h2 || 0) * 60 + (m2 || 0);
  return minutes1 - minutes2;
};

/**
 * Mendapatkan waktu minimal yang bisa dipilih untuk booking
 * Jika tanggal adalah hari ini, return waktu sekarang + 45 menit
 * Jika tanggal adalah hari lain, return "08:00"
 * @param {string} dateString - Tanggal dalam format YYYY-MM-DD
 * @returns {string} - Waktu minimal dalam format HH:mm
 */
export const getMinBookingTime = (dateString) => {
  if (!dateString) return "08:00";
  
  const selectedDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Jika tanggal adalah hari ini, return waktu sekarang + 45 menit
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const minTime = new Date(now.getTime() + 45 * 60 * 1000); // Tambah 45 menit
    const hours = minTime.getHours().toString().padStart(2, '0');
    const minutes = minTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // Jika tanggal di masa depan, return waktu default 08:00
  return "08:00";
};

/**
 * Validasi waktu booking dengan aturan:
 * 1. Waktu tidak boleh di masa lalu
 * 2. Jika tanggal adalah hari ini, waktu harus minimal 45 menit dari sekarang
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
  
  // Jika tanggal adalah hari ini, validasi dengan aturan 45 menit
  if (selectedDate.getTime() === today.getTime()) {
    const now = new Date();
    const selectedDateTime = new Date(dateString);
    const [hours, minutes] = timeString.split(':').map(Number);
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

