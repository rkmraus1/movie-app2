import React from "react";

type Props = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({ message, onConfirm, onCancel }: Props) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 text-white p-6 rounded-lg w-80">
        <p className="text-sm mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-500"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
