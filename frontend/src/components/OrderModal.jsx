import React from 'react';
import { X, CheckCircle, Package, Clock, MapPin, User, Mail, Phone } from 'lucide-react';

export default function OrderModal({ isOpen, onClose, orderSummary, userData, loadingUser }) {
    if (!isOpen) return null;

    // Default values if user data is not available
    const displayAddress = userData?.address || 'Maharashtra, India';
    const displayName = userData?.username || 'Guest';
    const displayEmail = userData?.email || '';
    const displayContact = userData?.contact_number || '';

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-6 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden relative shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-700 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="absolute right-6 top-6 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all border-none cursor-pointer z-10"
                    onClick={onClose}
                >
                    <X size={24} />
                </button>

                <div className="p-12 sm:p-8 overflow-y-auto custom-scrollbar">
                    {/* Success Header */}
                    <div className="flex flex-col items-center text-center gap-6 mb-12">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner animate-bounce">
                            <CheckCircle size={64} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-4xl font-black text-gray-900 m-0 leading-tight sm:text-3xl">
                                Order Placed!
                            </h2>
                            <p className="text-gray-500 font-medium text-lg m-0">
                                Thank you for shopping with Buy Nexa.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-1">
                        {/* Order Summary */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col gap-4 border border-gray-100/50">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] m-0 border-b border-gray-100 pb-3">
                                    Payment Summary
                                </h3>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-500 tracking-tight">
                                        Item Total
                                    </span>
                                    <span className="text-sm font-black text-gray-900 tracking-tight">
                                        ₹{orderSummary.itemTotal?.toFixed(2) || '0.00'}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-500 tracking-tight">
                                        Delivery Fee
                                    </span>
                                    <span className="text-sm font-black text-green-600 tracking-tight">
                                        {orderSummary.deliveryFee > 0
                                            ? `₹${orderSummary.deliveryFee.toFixed(2)}`
                                            : 'FREE'}
                                    </span>
                                </div>

                                <div className="h-px bg-gray-200/50 my-1"></div>

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900 uppercase tracking-wider">
                                        Total
                                    </span>
                                    <span className="text-2xl font-black text-green-600 underline decoration-green-100 underline-offset-4">
                                        ₹{orderSummary.total?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">
                                        Estimated Delivery
                                    </p>
                                    <p className="text-lg font-black text-blue-900 leading-none m-0">
                                        15 Minutes
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] m-0 ml-1">
                                    Delivery Details
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                            <MapPin size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                Address
                                            </span>
                                            <p className="text-sm font-bold text-gray-800 leading-snug m-0">
                                                {displayAddress}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                            <User size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                Customer
                                            </span>
                                            <p className="text-sm font-bold text-gray-800 leading-snug m-0">
                                                {displayName}
                                            </p>
                                        </div>
                                    </div>

                                    {displayContact && (
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                                <Phone size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                    Contact
                                                </span>
                                                <p className="text-sm font-bold text-gray-800 leading-snug m-0">
                                                    {displayContact}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 items-start">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
                                            <Package size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                Total Items
                                            </span>
                                            <p className="text-sm font-bold text-gray-800 leading-snug m-0">
                                                {orderSummary.itemCount || 0}{' '}
                                                {orderSummary.itemCount === 1 ? 'item' : 'items'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-12">
                        <button
                            className="w-full bg-gray-900 text-white border-none py-5 rounded-[20px] font-black text-sm uppercase tracking-[0.3em] cursor-pointer transition-all hover:bg-black hover:shadow-xl hover:shadow-gray-200 active:scale-95"
                            onClick={onClose}
                        >
                            Back to Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
