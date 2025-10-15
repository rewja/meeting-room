import React from 'react';

const RoomCard = ({ room, onSelect, isSelected = false }) => {
  // Since backend doesn't provide status, we'll show it as available
  const status = 'Tersedia';
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tersedia':
        return 'bg-green-100 text-green-800';
      case 'Terisi':
        return 'bg-red-100 text-red-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected ? 'border-[#800000] ring-2 ring-[#800000] ring-opacity-50' : 'border-gray-200 hover:border-[#001f3f]'
      }`}
      onClick={() => onSelect && onSelect(room)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      
      <div className="space-y-2">
        {/* Kapasitas dihilangkan sesuai permintaan */}
        
        <div className="flex items-center text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Lokasi: {room.location}</span>
        </div>
        
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex items-start text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <span className="text-sm">Fasilitas: </span>
              <span className="text-sm">{room.amenities.join(', ')}</span>
            </div>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="mt-4 p-2 bg-[#800000] bg-opacity-10 rounded-md">
          <p className="text-sm text-[#800000] font-medium">✓ Dipilih</p>
        </div>
      )}
    </div>
  );
};

export default RoomCard;

