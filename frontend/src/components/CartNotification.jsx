import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function CartNotification({ message, show, onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 2000); // Auto-hide after 2 seconds

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-2000 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 flex items-center gap-4 shadow-xl shadow-green-100/50 border border-green-50">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                    <CheckCircle size={20} />
                </div>
                <span className="text-sm font-black text-gray-800 tracking-tight">{message}</span>
            </div>
        </div>
    );
}
