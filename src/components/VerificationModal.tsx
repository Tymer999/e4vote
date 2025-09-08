import { type FC } from 'react'
import type { Voter } from '../../types/types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: Voter;
  onVerify?: () => void;
  onDecline?: () => void;
  electionName: string;
}

const VerificationModal: FC<VerificationModalProps> = ({ isOpen, onClose, voter, onVerify, onDecline }) => {
  if (!isOpen) return null;  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60">
      <div className="md:bg-white/5 rounded-lg shadow-lg p-6 w-full max-w-md md:relative">
        <button
          type='button'
          className="absolute cursor-pointer top-4 right-3 md:top-2 md:right-2 text-gray-500 hover:text-gray-400 text-3xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Voter Verification</h2>
         {voter.verificationPhoto && (
          <div className="mb-4">
            <span className="font-semibold text-gray-500">Verification Photo:</span>
            <img
              src={voter.verificationPhoto}
              alt="Verification"
              className="mt-2 rounded w-full h-60 object-contain bg-white/5"
            />
          </div>
        )}
        <div className="mb-4">
          <p><span className="font-semibold text-gray-400">Name:</span> {voter.name}</p>
          <p><span className="font-semibold text-gray-400">Email:</span> {voter.email}</p>
          <p><span className="font-semibold text-gray-400">Phone:</span> {voter.phone}</p>
          <p><span className="font-semibold text-gray-400">Unique Field:</span> {voter.uniqueField}</p>
        </div>
       
        <div className="flex justify-end gap-2">
          <button
            type='button'
            className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={onVerify}
          >
            Approve
          </button>
          <button
            type='button'
            className="bg-red-400 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-500"
            onClick={onDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationModal
