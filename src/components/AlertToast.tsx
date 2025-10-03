import React from 'react';

interface ToastAlertProps {
  title: string;
  description: string | React.ReactNode;
}

export const toastAlert = ({ title, description }: ToastAlertProps) => {
  // Simple alert for now - you can replace with your preferred toast library
  alert(`${title}: ${description}`);
};
