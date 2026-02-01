import { useState, useCallback, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { VoiceAgent } from './VoiceAgent';
import { Role } from '@/data/disciplines';

interface VoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  agentId?: string;
}

export function VoiceAgentModal({
  isOpen,
  onClose,
  role,
  agentId,
}: VoiceAgentModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsConnected(false);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const handleDisconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const handleCloseAttempt = useCallback(() => {
    if (isConnected) {
      // Show confirmation if call is active
      setShowConfirmation(true);
    } else {
      // Close directly if not connected
      onClose();
    }
  }, [isConnected, onClose]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirmation(false);
    setIsConnected(false);
    onClose();
  }, [onClose]);

  const handleCancelClose = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const modalTitle = `Preview: ${role?.title || 'Interview'} at ${role?.company || 'Company'}`;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={modalTitle}
      >
        {/* Problem Statement Card */}
        {role && (
          <div className="bg-white/5 border border-white/20 p-4 mb-6">
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
              {role.description}
            </p>
          </div>
        )}

        <VoiceAgent
          agentId={agentId}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </Modal>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCancelClose}
        >
          <div
            className="bg-black border-2 border-white/40 p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              End Interview?
            </h3>
            <p className="text-white/70 mb-6">
              You are currently in an active interview. Are you sure you want to end it?
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={handleCancelClose}
                className="min-h-[44px] px-4 py-2 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
              >
                No
              </button>
              <button
                onClick={handleConfirmClose}
                className="min-h-[44px] px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
