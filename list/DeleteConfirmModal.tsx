import React from 'react';
import { TEXTS } from '../constants/strings';

interface DeleteConfirmModalProps {
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ onClose, onConfirm, message }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className="bg-background-light rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-xl font-bold text-text-primary mb-4">{TEXTS.LIST.DELETE_CONFIRM_TITLE}</h2>
        <p className="text-text-secondary mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-md text-text-secondary hover:bg-background-lighter focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-gray-500"
          >
            {TEXTS.COMMON.CANCEL}
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-6 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-red-500"
          >
            {TEXTS.COMMON.DELETE}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
