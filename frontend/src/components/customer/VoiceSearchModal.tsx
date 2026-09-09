import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Search 
} from 'lucide-react';

interface VoiceSearchModalProps {
  onClose: () => void;
  onTranscript: (query: string) => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  onClose,
  onTranscript
}) => {
  const [isListening, setIsListening] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');

  const quickPrompts = [
    'Crocin 650',
    'Augmentin 625 Duo',
    'Telma 40',
    'Paracetamol 650',
    'Glycomet 500 SR'
  ];

  useEffect(() => {
    // Simulate speech detection
    const timeout = setTimeout(() => {
      setTranscript('Crocin 650');
      setIsListening(false);
    }, 1600);

    return () => clearTimeout(timeout);
  }, []);

  const handleSelectPrompt = (prompt: string) => {
    setTranscript(prompt);
    setIsListening(false);
  };

  const handleConfirm = () => {
    if (transcript) {
      onTranscript(transcript);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pulsing Mic Circle */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-teal-200 animate-ping opacity-75" />
          )}
          <div className="relative w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/30">
            <Mic className="w-8 h-8" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">
            {isListening ? 'Listening for medicine or salt name...' : 'Voice Query Detected'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Speak English or generic molecule names
          </p>
        </div>

        {/* Live Detected Text Box */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 min-h-[48px] flex items-center justify-center">
          <p className="text-sm font-bold text-teal-900 font-mono">
            {transcript || (isListening ? '“Listening...”' : '')}
          </p>
        </div>

        {/* Suggested Quick Speech Tags */}
        <div className="space-y-1 text-left">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Or tap to simulate:
          </span>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSelectPrompt(p)}
                className="text-[11px] bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition-colors border border-slate-200"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          disabled={!transcript}
          className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search &apos;{transcript || '...'}&apos;</span>
        </button>

      </div>
    </div>
  );
};
