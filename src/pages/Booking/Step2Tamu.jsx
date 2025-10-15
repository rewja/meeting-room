import React, { useState } from 'react';
import FormInput from '../../components/FormInput';

const Step2Tamu = ({ formData, setFormData, errors, setErrors }) => {
  const [attendees, setAttendees] = useState(formData.attendees || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const addAttendee = () => {
    const newAttendee = { name: '', email: '' };
    const updatedAttendees = [...attendees, newAttendee];
    setAttendees(updatedAttendees);
    setFormData(prev => ({
      ...prev,
      attendees: updatedAttendees
    }));
  };

  const removeAttendee = (index) => {
    const updatedAttendees = attendees.filter((_, i) => i !== index);
    setAttendees(updatedAttendees);
    setFormData(prev => ({
      ...prev,
      attendees: updatedAttendees
    }));
  };

  const updateAttendee = (index, field, value) => {
    const updatedAttendees = attendees.map((attendee, i) => 
      i === index ? { ...attendee, [field]: value } : attendee
    );
    setAttendees(updatedAttendees);
    setFormData(prev => ({
      ...prev,
      attendees: updatedAttendees
    }));
  };

  // Check if all required fields are filled
  const isStepValid = () => {
    if (!formData.organizer_email || !formData.organizer_phone) {
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.organizer_email)) {
      return false;
    }
    // Check attendees if any
    if (formData.attendees && formData.attendees.length > 0) {
      for (let attendee of formData.attendees) {
        if (!attendee.name || !attendee.email || !/\S+@\S+\.\S+/.test(attendee.email)) {
          return false;
        }
      }
    }
    return true;
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.organizer_email) {
      newErrors.organizer_email = 'Email organizer wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.organizer_email)) {
      newErrors.organizer_email = 'Format email tidak valid';
    }
    
    if (!formData.organizer_phone) {
      newErrors.organizer_phone = 'Nomor telepon wajib diisi';
    }

    // Validate attendees
    attendees.forEach((attendee, index) => {
      if (!attendee.name) {
        newErrors[`attendee_${index}_name`] = 'Nama peserta wajib diisi';
      }
      if (!attendee.email) {
        newErrors[`attendee_${index}_email`] = 'Email peserta wajib diisi';
      } else if (!/\S+@\S+\.\S+/.test(attendee.email)) {
        newErrors[`attendee_${index}_email`] = 'Format email tidak valid';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Informasi Kontak & Peserta</h2>
        <p className="text-gray-600">Isi informasi kontak organizer dan daftar peserta meeting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Email Organizer"
          type="email"
          name="organizer_email"
          value={formData.organizer_email}
          onChange={handleChange}
          placeholder="organizer@company.com"
          required
          error={errors.organizer_email}
        />

        <FormInput
          label="Nomor Telepon Organizer"
          name="organizer_phone"
          value={formData.organizer_phone}
          onChange={handleChange}
          placeholder="+62 812 3456 7890"
          required
          error={errors.organizer_phone}
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Daftar Peserta</h3>
          <button
            type="button"
            onClick={addAttendee}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#800000] hover:bg-[#a00000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000] transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Peserta
          </button>
        </div>

        {attendees.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">Belum ada peserta yang ditambahkan</p>
            <p className="text-sm text-gray-400">Klik tombol "Tambah Peserta" untuk menambahkan peserta meeting</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendees.map((attendee, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">Peserta {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeAttendee(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Peserta
                    </label>
                    <input
                      type="text"
                      value={attendee.name}
                      onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                      placeholder="Nama lengkap peserta"
                    />
                    {errors[`attendee_${index}_name`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`attendee_${index}_name`]}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Peserta
                    </label>
                    <input
                      type="email"
                      value={attendee.email}
                      onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000]"
                      placeholder="email@company.com"
                    />
                    {errors[`attendee_${index}_email`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`attendee_${index}_email`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress Step 2</span>
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
                formData.organizer_email,
                formData.organizer_phone
              ].filter(Boolean).length / 2) * 100)}%` 
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {[
            formData.organizer_email,
            formData.organizer_phone
          ].filter(Boolean).length} dari 2 field terisi
          {attendees.length > 0 && ` + ${attendees.length} peserta`}
        </p>
      </div>
    </div>
  );
};

export default Step2Tamu;

