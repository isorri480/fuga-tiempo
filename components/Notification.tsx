
import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from './Icons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
  const Icon = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor}`}>
        <Icon className="w-6 h-6 mr-3" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
