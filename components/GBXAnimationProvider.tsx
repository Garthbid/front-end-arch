import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';

// ============================================
// TYPES
// ============================================

interface GBXContextType {
    gbxBalance: number;
    hasEarnedFirstGBX: boolean;
    walletRef: React.RefObject<HTMLDivElement>;
    triggerEarnGBX: (fromEl: HTMLElement | null, epic: boolean) => void;
    walletFlashState: 'idle' | 'flashing';
    spendGBX: (amount: number) => boolean;
    addGBX: (amount: number) => void;
}

const GBXContext = createContext<GBXContextType | null>(null);

// ============================================
// HOOK
// ============================================

export const useEarnGBX = () => {
    const context = useContext(GBXContext);
    if (!context) {
        throw new Error('useEarnGBX must be used within GBXAnimationProvider');
    }
    return context;
};

// ============================================
// PROVIDER COMPONENT
// ============================================

export const GBXAnimationProvider: React.FC<{
    children: React.ReactNode;
    onViewWallet?: () => void;
}> = ({ children, onViewWallet }) => {
    // State
    const [gbxBalance, setGbxBalance] = useState(() => {
        const stored = localStorage.getItem('gbxBalance');
        return stored ? parseInt(stored, 10) : 0;
    });

    const [hasEarnedFirstGBX, setHasEarnedFirstGBX] = useState(() => {
        return localStorage.getItem('hasEarnedFirstGBX') === 'true';
    });

    const [showFirstModal, setShowFirstModal] = useState(false);
    const [walletFlashState, setWalletFlashState] = useState<'idle' | 'flashing'>('idle');

    // Refs
    const walletRef = useRef<HTMLDivElement>(null);
    const lastFlashTime = useRef(0);
    const isEpicRunning = useRef(false);
    const balanceRef = useRef(gbxBalance);
    balanceRef.current = gbxBalance;

    // Reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Wallet flash animation (blue/orange for subsequent bids)
    const walletFlash = useCallback(() => {
        const now = Date.now();
        if (now - lastFlashTime.current < 800) return; // Rate limit
        lastFlashTime.current = now;

        setWalletFlashState('flashing');
        setTimeout(() => setWalletFlashState('idle'), 600);

        // Increment balance
        setGbxBalance(prev => {
            const newBalance = prev + 1;
            localStorage.setItem('gbxBalance', String(newBalance));
            return newBalance;
        });
    }, []);

    // Trigger GBX earn (epic = first time, shows modal)
    const triggerEarnGBX = useCallback((fromEl: HTMLElement | null, epic: boolean) => {
        // Haptic feedback (mobile)
        if (navigator.vibrate) {
            try { navigator.vibrate(10); } catch { }
        }

        // Reduced motion: skip animations
        if (prefersReducedMotion) {
            setGbxBalance(prev => {
                const newBalance = prev + 1;
                localStorage.setItem('gbxBalance', String(newBalance));
                return newBalance;
            });
            if (epic && !hasEarnedFirstGBX) {
                setHasEarnedFirstGBX(true);
                localStorage.setItem('hasEarnedFirstGBX', 'true');
                setShowFirstModal(true);
            }
            return;
        }

        if (!epic) {
            // Subsequent bids: just flash the wallet
            walletFlash();
            return;
        }

        // First bid epic animation
        if (isEpicRunning.current) return;
        isEpicRunning.current = true;

        // Flash wallet immediately
        setWalletFlashState('flashing');
        setTimeout(() => setWalletFlashState('idle'), 600);

        // Increment balance
        setGbxBalance(prev => {
            const newBalance = prev + 1;
            localStorage.setItem('gbxBalance', String(newBalance));
            return newBalance;
        });

        // Show first-time modal after brief delay
        setTimeout(() => {
            if (!hasEarnedFirstGBX) {
                setHasEarnedFirstGBX(true);
                localStorage.setItem('hasEarnedFirstGBX', 'true');
                setShowFirstModal(true);
            }
            isEpicRunning.current = false;
        }, 400);
    }, [hasEarnedFirstGBX, prefersReducedMotion, walletFlash]);

    // Spend GBX (for prediction market wagers, etc.)
    const spendGBX = useCallback((amount: number): boolean => {
        if (amount <= 0 || amount > balanceRef.current) return false;
        balanceRef.current -= amount;
        setGbxBalance(prev => {
            const newBalance = prev - amount;
            localStorage.setItem('gbxBalance', String(newBalance));
            return newBalance;
        });
        return true;
    }, []);

    // Add GBX (for prediction market winnings, etc.)
    const addGBX = useCallback((amount: number) => {
        if (amount <= 0) return;
        setGbxBalance(prev => {
            const newBalance = prev + amount;
            localStorage.setItem('gbxBalance', String(newBalance));
            return newBalance;
        });
    }, []);

    const contextValue: GBXContextType = {
        gbxBalance,
        hasEarnedFirstGBX,
        walletRef,
        triggerEarnGBX,
        walletFlashState,
        spendGBX,
        addGBX,
    };

    return (
        <GBXContext.Provider value={contextValue}>
            {children}

            {/* First GBX Modal */}
            <Dialog open={showFirstModal} onOpenChange={setShowFirstModal}>
                <DialogContent className="sm:max-w-md rounded-2xl p-6">
                    <DialogHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                            style={{
                                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
                                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)',
                            }}
                        >
                            🪙
                        </div>
                        <DialogTitle className="text-xl font-bold text-center">
                            You earned your first Garthbuck!
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-600 mt-2">
                            Every time you place a bid, +1 GBX goes into your wallet.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3 mt-6">
                        <Button
                            onClick={() => setShowFirstModal(false)}
                            className="w-full h-12 rounded-xl bg-[#2238ff] hover:bg-[#1a2dbb] text-white font-bold"
                        >
                            Got it
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowFirstModal(false);
                                onViewWallet?.();
                            }}
                            className="w-full h-12 rounded-xl font-semibold"
                        >
                            View Wallet
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </GBXContext.Provider>
    );
};

export default GBXAnimationProvider;
