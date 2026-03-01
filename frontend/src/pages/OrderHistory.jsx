import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Package, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CancelOrderModal from '../components/CancelOrderModal';
import api from '../../utils/api';

export default function OrderHistory() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelOrderId, setCancelOrderId] = useState(null);
    const [cancelOrderData, setCancelOrderData] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/home');
            return;
        }
        fetchOrderHistory();
    }, [isAuthenticated, navigate]);

    const fetchOrderHistory = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/orders/history');
            if (response.data.success) {
                setOrders(response.data.data || []);
            } else {
                setError(response.data.message || 'Failed to fetch order history');
            }
        } catch (err) {
            console.error('Error fetching order history:', err);
            setError(err.response?.data?.message || 'Failed to fetch order history');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (order) => {
        setCancelOrderId(order.order_id);
        setCancelOrderData(order);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = async () => {
        if (!cancelOrderId) return;

        try {
            const response = await api.put(`/orders/${cancelOrderId}/cancel`);
            if (response.data.success) {
                // Refresh order history
                await fetchOrderHistory();
                setShowCancelModal(false);
                setCancelOrderId(null);
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            alert(err.response?.data?.message || 'Failed to cancel order');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle size={20} />;
            case 'cancelled':
                return <X size={20} />;
            default:
                return <Clock size={20} />;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getImageUrl = (item) => {
        if (item.product_images) {
            try {
                const images = JSON.parse(item.product_images);
                if (images && images.length > 0) {
                    return `http://localhost:5000/uploads/home_page_products/${images[0]}`;
                }
            } catch (e) {
                // If not JSON, treat as single filename
                return `http://localhost:5000/uploads/home_page_products/${item.product_images}`;
            }
        }
        return null;
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-20 pb-16 sm:pt-16 font-sans">
                <div className="max-w-[800px] mx-auto px-6 lg:px-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8 sm:text-2xl sm:mb-6">
                        Order History
                    </h1>

                    {loading ? (
                        <div className="flex flex-col items-center py-24 gap-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium font-sans">
                                Loading your orders...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center py-20 gap-4 bg-red-50 rounded-2xl border border-red-100 text-center px-6">
                            <AlertCircle size={56} className="text-red-400" />
                            <p className="text-red-600 font-bold text-lg m-0">{error}</p>
                            <button
                                onClick={fetchOrderHistory}
                                className="bg-red-600 text-white border-none py-2.5 px-6 rounded-lg font-bold text-sm cursor-pointer shadow-md shadow-red-100 mt-2"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="flex flex-col items-center py-24 gap-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center px-6">
                            <Package size={80} className="text-gray-200" />
                            <div className="flex flex-col gap-2">
                                <h2 className="text-2xl font-bold text-gray-800 m-0">
                                    No orders yet
                                </h2>
                                <p className="text-gray-500 max-w-xs m-0">
                                    You haven't placed any orders yet. Start shopping to see your
                                    orders here!
                                </p>
                            </div>
                            <button
                                className="bg-green-600 text-white border-none py-3.5 px-10 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:-translate-y-0.5"
                                onClick={() => navigate('/home')}
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {orders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gray-50/50 p-6 flex justify-between items-start border-b border-gray-100 sm:p-4 sm:flex-col sm:gap-3">
                                        <div className="flex flex-col gap-1">
                                            <h3 className="text-lg font-black text-gray-900 m-0">
                                                Order #{order.order_number}
                                            </h3>
                                            <p className="text-xs font-bold text-gray-400 m-0 uppercase tracking-widest">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div
                                            className={`flex items-center gap-2 font-black text-[11px] uppercase tracking-widest px-4 py-2 rounded-full shadow-sm text-white
                        ${
                            order.status === 'confirmed'
                                ? 'bg-green-500'
                                : order.status === 'preparing'
                                  ? 'bg-blue-500'
                                  : order.status === 'out_for_delivery'
                                    ? 'bg-purple-500'
                                    : order.status === 'delivered'
                                      ? 'bg-emerald-600'
                                      : order.status === 'cancelled'
                                        ? 'bg-red-500'
                                        : 'bg-gray-500'
                        }`}
                                        >
                                            {getStatusIcon(order.status)}
                                            <span>{order.status.replace(/_/g, ' ')}</span>
                                        </div>
                                    </div>

                                    {/* Items list */}
                                    <div className="p-6 sm:p-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-50 pb-2">
                                            Items ({order.items?.length || 0})
                                        </h4>
                                        <div className="flex flex-col gap-4">
                                            {order.items?.map((item) => (
                                                <div
                                                    key={item.item_id}
                                                    className="flex gap-4 items-center"
                                                >
                                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-50 p-1 shrink-0 flex items-center justify-center">
                                                        {getImageUrl(item) ? (
                                                            <img
                                                                src={getImageUrl(item)}
                                                                alt={item.product_name}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        ) : (
                                                            <div className="text-[10px] text-gray-400 italic">
                                                                No Image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-gray-900 m-0 mb-1 truncate">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs font-bold text-gray-400 m-0 uppercase tracking-wider">
                                                            {item.product_quantity}{' '}
                                                            <span className="text-gray-300 mx-1">
                                                                ×
                                                            </span>{' '}
                                                            {item.cart_quantity}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm font-black text-gray-900">
                                                        ₹{parseFloat(item.item_total).toFixed(2)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="p-6 bg-gray-50/30 border-t border-gray-50 sm:p-4">
                                        <div className="flex flex-col gap-2 max-w-[300px] ml-auto sm:max-w-full">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-bold text-gray-500">
                                                    Item Total
                                                </span>
                                                <span className="font-bold text-gray-900">
                                                    ₹{parseFloat(order.item_total).toFixed(2)}
                                                </span>
                                            </div>
                                            {order.delivery_fee > 0 && (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold text-gray-500">
                                                        Delivery Fee
                                                    </span>
                                                    <span className="font-bold text-gray-900">
                                                        ₹{parseFloat(order.delivery_fee).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                            {order.cancellation_fee > 0 && (
                                                <div className="flex justify-between items-center text-sm text-red-500">
                                                    <span className="font-bold">
                                                        Cancellation Fee
                                                    </span>
                                                    <span className="font-bold">
                                                        -₹
                                                        {parseFloat(order.cancellation_fee).toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="text-base font-black text-gray-900 uppercase tracking-wider">
                                                    Total amount
                                                </span>
                                                <span className="text-xl font-black text-green-600">
                                                    ₹
                                                    {parseFloat(
                                                        order.total_amount -
                                                            (order.cancellation_fee || 0)
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.delivery_address && (
                                        <div className="px-6 pb-6 sm:px-4 sm:pb-4">
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex gap-3 items-start">
                                                <MapPin
                                                    size={18}
                                                    className="text-blue-500 shrink-0 mt-0.5"
                                                />
                                                <span className="text-sm font-bold text-blue-900 leading-snug">
                                                    {order.delivery_address}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="px-6 pb-6 flex gap-4 sm:flex-col sm:px-4 sm:pb-4 sm:gap-3">
                                        <button
                                            className="flex-1 bg-green-600 text-white border-none py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:shadow-green-200 active:scale-95"
                                            onClick={() => navigate(`/order/${order.order_id}`)}
                                        >
                                            Track Order
                                        </button>

                                        {order.status !== 'cancelled' &&
                                            order.status !== 'delivered' && (
                                                <button
                                                    className="flex-1 bg-white text-red-500 border border-red-100 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] cursor-pointer transition-all hover:bg-red-50 active:scale-95"
                                                    onClick={() => handleCancelClick(order)}
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={() => {
                    setShowCancelModal(false);
                    setCancelOrderId(null);
                    setCancelOrderData(null);
                }}
                onConfirm={handleCancelConfirm}
                orderId={cancelOrderId}
                orderData={cancelOrderData}
            />
        </>
    );
}
