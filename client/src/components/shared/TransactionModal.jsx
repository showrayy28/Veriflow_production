import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, ExternalLink, X, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TransactionModal({
  isOpen,
  onClose,
  title = 'Processing Blockchain Transaction',
  steps = [],
  currentStep = 0,
  txHash = null,
  isComplete = false,
  error = null,
  successMessage = 'Transaction Confirmed on Polygon Amoy!',
}) {
  React.useEffect(() => {
    if (isComplete) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#34d399', '#2dd4bf', '#f59e0b'],
        });
      } catch (e) {}
    }
  }, [isComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-card w-full max-w-lg rounded-2xl p-6 border border-emerald-500/40 relative shadow-2xl"
        >
          {/* Close button if finished or errored */}
          {(isComplete || error) && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-sm text-slate-400 mb-6">
            Multi-stage on-chain verification & state synchronization
          </p>

          {/* Stepper list */}
          <div className="space-y-4 mb-6">
            {steps.map((step, idx) => {
              const isPast = idx < currentStep || isComplete;
              const isCurrent = idx === currentStep && !isComplete && !error;
              const isPending = idx > currentStep && !isComplete;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                      : isPast
                      ? 'bg-slate-900/40 border-slate-700/50 text-slate-300'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                      isPast
                        ? 'bg-emerald-500 text-obsidian-950 font-bold'
                        : isCurrent
                        ? 'border-2 border-emerald-400 text-emerald-400'
                        : 'border border-slate-700 text-slate-600'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <div className="flex-1 text-sm font-medium">
                    {step}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold block mb-0.5">Transaction Encountered an Error:</span>
                {error}
              </div>
            </div>
          )}

          {/* Success State */}
          {isComplete && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm mb-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-semibold">
                <Check className="w-5 h-5 text-emerald-400" />
                {successMessage}
              </div>
              {txHash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 underline font-mono break-all mt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  View on PolygonScan: {txHash.slice(0, 18)}...{txHash.slice(-10)}
                </a>
              )}
            </div>
          )}

          {/* Action button */}
          {(isComplete || error) && (
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-semibold transition-all shadow-lg shadow-emerald-500/20"
            >
              Done
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
