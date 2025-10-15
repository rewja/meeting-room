export const COLORS = {
  maroon: '#800000',
  navy: '#001f3f',
  lightMaroon: '#a00000',
  lightNavy: '#003366'
};

// Constants for meeting room booking
export const BOOKING_STATUS = {
  SCHEDULED: 'scheduled',
  ONGOING: 'ongoing', 
  ENDED: 'ended',
  CANCELED: 'canceled'
};

export const BOOKING_TYPE = {
  INTERNAL: 'internal',
  PUBLIC: 'public'
};

// Additional UI constants (can be used for form options)
export const JENIS_TAMU = [
  { value: 'Internal', label: 'Internal' },
  { value: 'Eksternal', label: 'Eksternal' }
];

export const PRIORITY_ROLE = [
  { value: 'Reguler', label: 'Reguler' },
  { value: 'VIP', label: 'VIP' },
  { value: 'Staff', label: 'Staff' }
];

export const KEBUTUHAN_TAMBAHAN = [
  { id: 'makanan', label: 'Makanan' },
  { id: 'minuman', label: 'Minuman' },
  { id: 'proyektor', label: 'Proyektor' },
  { id: 'whiteboard', label: 'Whiteboard' },
  { id: 'mikrofon', label: 'Mikrofon' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'kabel-hdmi', label: 'Kabel HDMI' },
  { id: 'lainnya', label: 'Lainnya' }
];

export const PARTITION_OPTIONS = [
  { value: 'Theater', label: 'Theater' },
  { value: 'Classroom', label: 'Classroom' },
  { value: 'U-Shape', label: 'U-Shape' },
  { value: 'Boardroom', label: 'Boardroom' }
];