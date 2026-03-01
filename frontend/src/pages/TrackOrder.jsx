import React, { useEffect, useState } from 'react';
import {
    Package,
    CheckCircle,
    Truck,
    CookingPot,
    Clock,
    XCircle,
    Home,
    ChevronRight,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useOrderStore from '../store/useOrderStore';
import '../App.css';

/* Order step config */
const ORDER_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: CookingPot },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const { currentOrder: order, loading, error, getOrderDetails } = useOrderStore();

    /* Auth + Fetch order */
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/home');
            return;
        }

        if (orderId) {
            getOrderDetails(orderId);
        }
    }, [orderId, isAuthenticated, navigate, getOrderDetails]);

    /* UI States */
    if (loading) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium tracking-wide">
                            Loading order details...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans px-6">
                    <div className="bg-white p-10 rounded-3xl shadow-xl shadow-red-50 border border-red-50 flex flex-col items-center text-center gap-6 max-w-md w-full">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                            <XCircle size={48} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-black text-gray-900 m-0">
                                Oops! Something went wrong
                            </h2>
                            <p className="text-gray-500 leading-relaxed m-0">{error}</p>
                        </div>
                        <button
                            onClick={() => navigate('/orders')}
                            className="bg-gray-900 text-white border-none py-3.5 px-8 rounded-xl font-bold text-sm cursor-pointer transition-all hover:bg-black active:scale-95"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (!order) return null;

    const isCancelled = order.status === 'cancelled';
    const currentStepIndex = ORDER_STEPS.findIndex((step) => step.key === order.status);

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-20 pb-20 sm:pt-16 font-sans">
                <div className="max-w-[800px] mx-auto px-6 lg:px-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-6">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-1 hover:text-green-600 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
                        >
                            <Home size={14} />
                            Home
                        </button>
                        <ChevronRight size={14} className="text-gray-300" />
                        <button
                            onClick={() => navigate('/account')}
                            className="hover:text-green-600 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
                        >
                            Account
                        </button>
                        <ChevronRight size={14} className="text-gray-300" />
                        <button
                            onClick={() => navigate('/orders')}
                            className="hover:text-green-600 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
                        >
                            Orders
                        </button>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-900 font-bold">Track Order</span>
                    </nav>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8 sm:text-2xl sm:mb-6">
                        Track Your Order
                    </h1>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Order Info Card */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sm:p-6">
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        Order ID
                                    </span>
                                    <span className="text-lg font-black text-gray-900">
                                        #{order.order_id}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        Current Status
                                    </span>
                                    <span
                                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-sm
                    ${
                        order.status === 'delivered'
                            ? 'bg-emerald-600 shadow-emerald-100'
                            : order.status === 'cancelled'
                              ? 'bg-red-500 shadow-red-100'
                              : 'bg-blue-600 shadow-blue-100'
                    }`}
                                    >
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        Ordered On
                                    </span>
                                    <span className="text-sm font-bold text-gray-700">
                                        {new Date(order.created_at).toLocaleDateString(undefined, {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tracking Content */}
                        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm sm:p-6 min-h-[500px]">
                            {isCancelled ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6 text-center animate-in fade-in zoom-in duration-500">
                                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
                                        <XCircle size={56} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-3xl font-black text-gray-900 m-0">
                                            Order Cancelled
                                        </h3>
                                        <p className="text-gray-500 text-lg m-0 max-w-sm">
                                            This order was cancelled. If you have any questions,
                                            please contact support.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative pl-4 mt-4">
                                    {ORDER_STEPS.map((step, index) => {
                                        const Icon = step.icon;
                                        const isCompleted = index < currentStepIndex;
                                        const isActive = index === currentStepIndex;
                                        const isLast = index === ORDER_STEPS.length - 1;

                                        return (
                                            <div
                                                key={step.key}
                                                className="flex gap-8 relative pb-12 last:pb-0 group"
                                            >
                                                {/* Stepper Line */}
                                                {!isLast && (
                                                    <div
                                                        className={`absolute top-10 left-5 w-1 h-full rounded-full z-0 transition-colors duration-500
                            ${isCompleted ? 'bg-linear-to-b from-green-500 to-green-600' : 'bg-gray-100'}`}
                                                    />
                                                )}

                                                {/* Step Icon */}
                                                <div
                                                    className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 shrink-0
                          ${
                              isCompleted
                                  ? 'bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-100 scale-110'
                                  : isActive
                                    ? 'bg-linear-to-br from-green-600 to-emerald-800 text-white shadow-[0_0_0_8px_rgba(16,185,129,0.1),0_12px_24px_rgba(16,185,129,0.4)] scale-125 animate-pulse'
                                    : 'bg-gray-100 text-gray-400'
                          }`}
                                                >
                                                    <Icon
                                                        size={isCompleted || isActive ? 20 : 18}
                                                    />
                                                </div>

                                                {/* Step Label */}
                                                <div className="pt-2 flex flex-col gap-1 flex-1">
                                                    <p
                                                        className={`text-lg font-black tracking-tight leading-none transition-colors duration-300
                            ${isActive ? 'text-gray-900' : isCompleted ? 'text-green-700' : 'text-gray-400'}`}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {isActive && (
                                                        <p className="text-sm font-bold text-green-600 animate-in slide-in-from-left duration-700">
                                                            In progress...
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full bg-gray-50 text-gray-600 border border-gray-100 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-900 hover:border-gray-200"
                        >
                            Back to Order History
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
