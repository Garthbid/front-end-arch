import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Phone, Lock, Loader2 } from 'lucide-react';
import { COLORS } from '../constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('PHONE');
      setPhone('');
      setOtp('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) return;

    setIsLoading(true);
    // Mock Verification
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex justify-between items-center">
            <h2 className="text-2xl font-display text-slate-900 tracking-tight">
                {step === 'PHONE' ? 'GET STARTED' : 'VERIFY CODE'}
            </h2>
            <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
            >
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
            {step === 'PHONE' ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <p className="text-gray-500 font-medium">
                        Enter your mobile number to bid, buy, and sell. No passwords to remember.
                    </p>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="tel" 
                                autoFocus
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(555) 555-0123"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-xl font-bold text-slate-900 focus:outline-none focus:border-[#224cff] focus:bg-white transition-colors placeholder:text-gray-300"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={phone.length < 3 || isLoading}
                        className="w-full py-4 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <>SEND CODE <ArrowRight size={20} /></>}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <p className="text-gray-500 font-medium">
                        We sent a code to <span className="text-slate-900 font-bold">{phone}</span>.
                    </p>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                autoFocus
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="0000"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-2xl font-black text-slate-900 tracking-[0.5em] focus:outline-none focus:border-[#224cff] focus:bg-white transition-colors placeholder:tracking-normal placeholder:text-gray-300 text-center"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={otp.length < 3 || isLoading}
                        className="w-full py-4 rounded-xl font-black text-white text-lg shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'VERIFY & ENTER'}
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => setStep('PHONE')}
                        className="w-full text-center text-sm font-bold text-gray-400 hover:text-slate-700"
                    >
                        Wrong number?
                    </button>
                </form>
            )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center">
            <p className="text-[10px] text-gray-400 font-medium">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;