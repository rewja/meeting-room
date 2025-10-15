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
    return 'Booking hanya tersedia untuk hari kerja (Senin-Jumat)';
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



