// Design Tokens untuk Roomify
export const designTokens = {
  colors: {
    primary: '#800000',
    primaryHover: '#a00000',
    primaryLight: '#800000',
    primaryOpacity: 'rgba(128, 0, 0, 0.1)',
    
    secondary: '#001f3f',
    secondaryHover: '#003a66',
    secondaryLight: '#004d7a',
    
    success: '#28a745',
    successHover: '#218838',
    successLight: 'rgba(40, 167, 69, 0.1)',
    
    warning: '#ffc107',
    warningHover: '#e0a800',
    warningLight: 'rgba(255, 193, 7, 0.1)',
    
    error: '#dc3545',
    errorHover: '#c82333',
    errorLight: 'rgba(220, 53, 69, 0.1)',
    
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem'    // 64px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px'
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem'   // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  }
};

// Utility functions untuk styling
export const getColor = (colorPath) => {
  const paths = colorPath.split('.');
  let result = designTokens.colors;
  for (const path of paths) {
    result = result[path];
  }
  return result;
};

export const getSpacing = (size) => designTokens.spacing[size];
export const getBorderRadius = (size) => designTokens.borderRadius[size];
export const getShadow = (size) => designTokens.shadows[size];
export const getFontSize = (size) => designTokens.typography.fontSize[size];
export const getFontWeight = (weight) => designTokens.typography.fontWeight[weight];
