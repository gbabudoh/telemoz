"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    setError("");
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden"
          >
            {/* Danger indicator */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-rose-600" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-50 rounded-2xl mb-6">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Account?</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                This action is permanent and cannot be undone. All your projects, proposals, invoices, and profile data will be permanently deleted.
              </p>

              {error && (
                <div className="w-full p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold mb-6">
                  {error}
                </div>
              )}

              <div className="flex flex-col w-full gap-3">
                <Button
                  variant="danger"
                  className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-red-500/20"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="mr-2 h-5 w-5" /> Delete My Account</>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full h-12 rounded-xl text-gray-500 font-bold hover:bg-gray-50"
                  onClick={onClose}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
