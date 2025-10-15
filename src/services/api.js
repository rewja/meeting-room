// API service for meeting room
const API_BASE_URL = 'http://localhost:8000/api'; // Adjust this to your backend URL

// Fallback data for development/testing
const FALLBACK_ROOMS = [
  {
    id: 'room-a-08',
    name: 'Meeting Room A (08)',
    capacity: 8,
    location: 'Floor 1',
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning']
  },
  {
    id: 'room-b-08',
    name: 'Meeting Room B (08)',
    capacity: 8,
    location: 'Floor 1',
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning']
  },
  {
    id: 'room-a-689',
    name: 'Meeting Room A (689)',
    capacity: 12,
    location: 'Floor 2',
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning', 'Video Conference']
  },
  {
    id: 'room-b-689',
    name: 'Meeting Room B (689)',
    capacity: 12,
    location: 'Floor 2',
    amenities: ['Projector', 'Whiteboard', 'Air Conditioning', 'Video Conference']
  }
];

export const meetingRoomAPI = {
  // Get available rooms
  async getRooms() {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting-room/rooms`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching rooms:', error);
      console.log('Using fallback data for rooms');
      return FALLBACK_ROOMS;
    }
  },

  // Get bookings
  async getBookings(params = {}) {
    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`${API_BASE_URL}/meeting-room/bookings?${queryParams}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching bookings:', error);
      console.log('Using fallback data for bookings');
      return []; // Return empty array as fallback
    }
  },

  // Check room availability
  async checkAvailability(roomName, startTime, endTime) {
    try {
      const response = await fetch(`${API_BASE_URL}/meeting-room/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          room_name: roomName,
          start_time: startTime,
          end_time: endTime,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to check availability');
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  },

  // Book a room
  async bookRoom(bookingData) {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all booking data to FormData
      Object.keys(bookingData).forEach(key => {
        const value = bookingData[key];
        if (value === null || value === undefined) return;
        if (key === 'spk_file' && value) {
          formData.append('spk_file', value);
        } else if (key === 'kebutuhan') {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append('kebutuhan[]', v));
          }
        } else {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/meeting-room/book`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData, // Use FormData instead of JSON
      });
      
      if (!response.ok) {
        let message = 'Failed to book room';
        try {
          const errorData = await response.json();
          message = errorData.message || message;
        } catch (_) {
          // response might not be JSON on certain errors
        }
        throw new Error(message);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error booking room:', error);
      throw error;
    }
  },
};

export default meetingRoomAPI;
