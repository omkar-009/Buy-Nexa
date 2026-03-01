import React from 'react';
import { X, AlertTriangle, Info } from 'lucide-react';

export default function CancelOrderModal({ isOpen, onClose, onConfirm, orderId, orderData }) {
    if (!isOpen) return null;

    const cancellationFee = 50;
    const orderAmount = orderData ? parseFloat(orderData.total_amount) : 0;
    const refundAmount = Math.max(0, orderAmount - cancellationFee);

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-6 top-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all border-none cursor-pointer z-10"
                    onClick={onClose}
                >
                    <X size={20} />
                </button>

                <div className="p-10 sm:p-8">
                    {/* Warning Header */}
                    <div className="flex flex-col items-center text-center gap-6 mb-10">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                            <AlertTriangle size={48} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-3xl font-black text-gray-900 m-0 leading-tight">
                                Cancel Order?
                            </h2>
                            <p className="text-gray-500 font-medium leading-relaxed m-0">
                                This action will stop the delivery process and cannot be undone.
                            </p>
                        </div>
                    </div>

                    {/* Important Info Box */}
                    <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 flex gap-4 items-start mb-8">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                            <Info size={20} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest m-0">
                                Important Information
                            </h3>
                            <ul className="text-sm text-amber-800/80 m-0 pl-4 space-y-1 font-medium">
                                <li>
                                    A cancellation fee of{' '}
                                    <strong className="text-amber-900">₹{cancellationFee}</strong>{' '}
                                    will be applied.
                                </li>
                                <li>
                                    The remaining balance will be refunded to your source account.
                                </li>
                                <li>Refunds are typically processed within 24 hours.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="bg-gray-50 rounded-2xl p-6 flex flex-col gap-4 mb-10">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-500">Order Amount</span>
                            <span className="text-sm font-black text-gray-900">
                                ₹{orderAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-red-500">
                            <span className="text-sm font-bold">Cancellation Fee</span>
                            <span className="text-sm font-black">
                                -₹{cancellationFee.toFixed(2)}
                            </span>
                        </div>
                        <div className="h-px bg-gray-200 my-1"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-base font-black text-gray-900 uppercase tracking-wider">
                                Refund Amount
                            </span>
                            <span className="text-xl font-black text-green-600 underline decoration-green-100 underline-offset-4">
                                ₹{refundAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            className="flex-1 bg-gray-100 text-gray-600 border-none py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900 active:scale-95"
                            onClick={onClose}
                        >
                            Keep Order
                        </button>
                        <button
                            className="flex-1 bg-red-500 text-white border-none py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-red-600 shadow-lg shadow-red-100 active:scale-95"
                            onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
