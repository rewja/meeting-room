import React, { useState, useEffect } from 'react';
import FormInput from '../../components/FormInput';

const Step3Kebutuhan = ({ formData, setFormData, errors, setErrors }) => {
  const [showFoodFields, setShowFoodFields] = useState((formData.kebutuhan || []).includes('makanan'));
  const [showDrinkFields, setShowDrinkFields] = useState((formData.kebutuhan || []).includes('minuman'));
  const [showOtherFields, setShowOtherFields] = useState((formData.kebutuhan || []).includes('lainnya'));

  // Sync state with formData when component mounts or formData changes
  useEffect(() => {
    setShowFoodFields((formData.kebutuhan || []).includes('makanan'));
    setShowDrinkFields((formData.kebutuhan || []).includes('minuman'));
    setShowOtherFields((formData.kebutuhan || []).includes('lainnya'));
  }, [formData.kebutuhan]);

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

  const handleKebutuhanChange = (kebutuhanId, checked) => {
    setFormData(prev => {
      const currentKebutuhan = prev.kebutuhan || [];
      if (checked) {
        return {
          ...prev,
          kebutuhan: [...currentKebutuhan, kebutuhanId]
        };
      } else {
        return {
          ...prev,
          kebutuhan: currentKebutuhan.filter(id => id !== kebutuhanId)
        };
      }
    });

    // Show/hide text fields based on selection
    if (kebutuhanId === 'makanan') {
      setShowFoodFields(checked);
      if (!checked) {
        setFormData(prev => ({
          ...prev,
          makanan_detail: ''
        }));
      }
    }
    if (kebutuhanId === 'minuman') {
      setShowDrinkFields(checked);
      if (!checked) {
        setFormData(prev => ({
          ...prev,
          minuman_detail: ''
        }));
      }
    }
    if (kebutuhanId === 'lainnya') {
      setShowOtherFields(checked);
      if (!checked) {
        setFormData(prev => ({
          ...prev,
          lainnya_detail: ''
        }));
      }
    }
  };

  // Check if all required fields are filled
  const isStepValid = () => {
    // Require makanan_detail when 'makanan' is selected
    if ((formData.kebutuhan || []).includes('makanan')) {
      if (!(formData.makanan_detail && formData.makanan_detail.trim())) return false;
    }
    // Require minuman_detail when 'minuman' is selected
    if ((formData.kebutuhan || []).includes('minuman')) {
      if (!(formData.minuman_detail && formData.minuman_detail.trim())) return false;
    }
    // Require lainnya_detail when 'lainnya' is selected
    if ((formData.kebutuhan || []).includes('lainnya')) {
      if (!(formData.lainnya_detail && formData.lainnya_detail.trim())) return false;
    }
    return true;
  };

  const validateStep = () => {
    const newErrors = {};
    // If makanan selected, makanan_detail is required
    if ((formData.kebutuhan || []).includes('makanan')) {
      if (!formData.makanan_detail || !formData.makanan_detail.trim()) {
        newErrors.makanan_detail = 'Detail makanan wajib diisi saat memilih Makanan';
      }
    }
    // If minuman selected, minuman_detail is required
    if ((formData.kebutuhan || []).includes('minuman')) {
      if (!formData.minuman_detail || !formData.minuman_detail.trim()) {
        newErrors.minuman_detail = 'Detail minuman wajib diisi saat memilih Minuman';
      }
    }
    // If lainnya selected, lainnya_detail is required
    if ((formData.kebutuhan || []).includes('lainnya')) {
      if (!formData.lainnya_detail || !formData.lainnya_detail.trim()) {
        newErrors.lainnya_detail = 'Kebutuhan lainnya wajib diisi saat memilih Lainnya';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kebutuhan Tambahan</h2>
        <p className="text-gray-600">Pilih kebutuhan tambahan untuk meeting</p>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Kebutuhan Tambahan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kebutuhan?.includes('makanan') || false}
              onChange={(e) => handleKebutuhanChange('makanan', e.target.checked)}
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Makanan</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kebutuhan?.includes('minuman') || false}
              onChange={(e) => handleKebutuhanChange('minuman', e.target.checked)}
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Minuman</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kebutuhan?.includes('whiteboard') || false}
              onChange={(e) => handleKebutuhanChange('whiteboard', e.target.checked)}
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Whiteboard</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kebutuhan?.includes('mikrofon') || false}
              onChange={(e) => handleKebutuhanChange('mikrofon', e.target.checked)}
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Mikrofon</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.kebutuhan?.includes('monitor') || false}
              onChange={(e) => handleKebutuhanChange('monitor', e.target.checked)}
              className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Monitor</span>
          </label>
          
          <label className="flex items-center">
              <input
                type="checkbox"
              checked={formData.kebutuhan?.includes('lainnya') || false}
              onChange={(e) => handleKebutuhanChange('lainnya', e.target.checked)}
                className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded"
              />
            <span className="ml-2 text-sm text-gray-700">Lainnya</span>
            </label>
        </div>
      </div>

      {/* Food Details */}
      {showFoodFields && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">Detail Makanan</h4>
          <FormInput
            label="Jenis Makanan"
            name="makanan_detail"
            value={formData.makanan_detail || ''}
                onChange={handleChange}
            placeholder="Snack, dll"
            error={errors.makanan_detail}
          />
                </div>
      )}

      {/* Drink Details */}
      {showDrinkFields && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Detail Minuman</h4>
          <FormInput
            label="Jenis Minuman"
            name="minuman_detail"
            value={formData.minuman_detail || ''}
            onChange={handleChange}
            placeholder="Air Mineral, dll"
            error={errors.minuman_detail}
          />
        </div>
        )}

      {/* Other Details */}
      {showOtherFields && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-green-900 mb-2">Kebutuhan Lainnya</h4>
          <FormInput
            label="Deskripsi Kebutuhan Lainnya"
            name="lainnya_detail"
            value={formData.lainnya_detail || ''}
            onChange={handleChange}
            placeholder="Masukkan kebutuhan lainnya yang diperlukan..."
            error={errors.lainnya_detail}
          />
        </div>
        )}

      {/* Progress indicator */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress Step 2</span>
          <span className="text-sm text-gray-500">
            {isStepValid() ? '✓ Siap lanjut' : 'Opsional'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isStepValid() ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ 
              width: '100%' // Always 100% since this step is optional
            }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Kebutuhan tambahan (opsional) - {formData.kebutuhan?.length || 0} item dipilih
        </p>
      </div>
    </div>
  );
};

export default Step3Kebutuhan;

