import React, { useState, useEffect, useRef } from 'react';

const FileUpload = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  required = false,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null); // data URL for inline preview
  const objectUrlRef = useRef(null);
  const [objectUrl, setObjectUrl] = useState(null); // for display purposes

  // Sync preview and objectUrl with value when component mounts or value changes
  useEffect(() => {
    if (value && value instanceof File) {
      // Create preview for images
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(value);
      } else {
        setPreview(null);
      }

      // Create an object URL for viewing
      try {
        const url = URL.createObjectURL(value);
        objectUrlRef.current = url;
        setObjectUrl(url);
      } catch (_) {
        objectUrlRef.current = null;
        setObjectUrl(null);
      }
    } else {
      setPreview(null);
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch (_) {}
        objectUrlRef.current = null;
      }
      setObjectUrl(null);
    }
    
    // Cleanup function
    return () => {
      if (objectUrlRef.current) {
        try { URL.revokeObjectURL(objectUrlRef.current); } catch (_) {}
        objectUrlRef.current = null;
      }
    };
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    // Validate file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      alert(`File type ${fileExtension} is not allowed. Allowed types: ${accept}`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
      return;
    }

    // Update form data - useEffect will handle preview and objectUrl
    onChange({
      target: {
        name: name,
        value: file
      }
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    onChange({
      target: {
        name: name,
        value: null
      }
    });
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileInput}
          multiple={multiple}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-0"
        />
        
        {value ? (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4">
              {preview ? (
                <a href={objectUrl || '#'} target="_blank" rel="noopener noreferrer" title="Lihat gambar" className="relative z-10"
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (objectUrl) window.open(objectUrl, '_blank'); }}>
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border hover:opacity-90 cursor-zoom-in"
                  />
                </a>
              ) : (
                <div className="h-20 w-20 bg-gray-100 rounded border flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{value.name}</p>
                <p className="text-xs text-gray-500">
                  {(value.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <div className="mt-1 flex items-center space-x-3 relative z-10">
                  {objectUrl ? (
                    <a
                      href={objectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                      title="Lihat file"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(objectUrl, '_blank'); }}
                    >
                      Lihat
                    </a>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                  Click to upload
                </span>
                {' '}or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept} (max {maxSize / (1024 * 1024)}MB)
              </p>
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;


