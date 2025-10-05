import React, { useState, useEffect } from 'react';
import { Phone, X, Delete } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useLocalization } from '../hooks/useLocalization';

interface DialerProps {
  isOpen: boolean;
  onClose: () => void;
  initialNumber?: string;
}

type CallStatus = 'idle' | 'calling' | 'connected' | 'ended';

const KEYPAD_BUTTONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

export const Dialer: React.FC<DialerProps> = ({ isOpen, onClose, initialNumber = '' }) => {
  const { t } = useLocalization();
  const [number, setNumber] = useState(initialNumber);
  const [status, setStatus] = useState<CallStatus>('idle');

  useEffect(() => {
    if (isOpen) {
      setNumber(initialNumber.replace(/\s+/g, ''));
      setStatus('idle');
    }
  }, [isOpen, initialNumber]);

  const handleKeyPress = (key: string) => {
    if (status !== 'idle') return;
    setNumber(prev => prev + key);
  };
  
  const handleDelete = () => {
    if (status !== 'idle') return;
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number.length === 0) return;
    setStatus('calling');
    setTimeout(() => setStatus('connected'), 2000);
  };
  
  const handleEndCall = () => {
    setStatus('ended');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getStatusText = () => {
    switch (status) {
        case 'calling': return t('calling');
        case 'connected': return t('connected');
        case 'ended': return t('call_ended');
        default: return number || ' ';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={status === 'idle' ? onClose : handleEndCall} title={t('call_center')}>
      <div className="flex flex-col items-center">
        <div className="h-12 w-full text-center mb-4">
          <p className={`text-3xl font-light tracking-wider ${status !== 'idle' ? 'text-maryon-text-secondary' : 'text-maryon-text-primary'}`}>
            {getStatusText()}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
          {KEYPAD_BUTTONS.map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={status !== 'idle'}
              className="flex items-center justify-center h-16 w-full rounded-full bg-maryon-hover text-maryon-text-primary text-2xl font-light transition-colors hover:bg-maryon-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {key}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-4">
            <div />
            <Button
                onClick={status === 'idle' ? handleCall : handleEndCall}
                className={`h-16 w-16 rounded-full flex items-center justify-center text-white ${status === 'idle' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                aria-label={status === 'idle' ? 'Call' : 'End Call'}
            >
                <Phone className="w-7 h-7" />
            </Button>
            <button
                onClick={handleDelete}
                disabled={status !== 'idle' || number.length === 0}
                className="flex items-center justify-center text-maryon-text-secondary hover:text-maryon-text-primary disabled:opacity-50"
            >
                <Delete className="w-7 h-7" />
            </button>
        </div>
      </div>
    </Modal>
  );
};