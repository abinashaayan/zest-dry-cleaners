import toast from 'react-hot-toast';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#336B3F',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#d32f2f',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
    },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#1976d2',
      color: '#fff',
      borderRadius: '8px',
      padding: '12px 16px',
    },
  });
};

