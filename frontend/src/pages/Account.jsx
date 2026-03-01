import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Edit2,
    Save,
    X,
    Package,
    Clock,
    LogOut,
    History,
    ChevronRight,
    Home,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../../utils/api';

export default function Account() {
    const navigate = useNavigate();
    const { user: authUser, isAuthenticated, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        contact_number: '',
        address: '',
    });
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/home');
            return;
        }
        fetchUserProfile();
        fetchOrderHistory();
    }, [isAuthenticated, navigate]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/profile');
            if (response.data.success) {
                setUserData(response.data.data);
                setFormData({
                    username: response.data.data.username || '',
                    email: response.data.data.email || '',
                    contact_number: response.data.data.contact_number || '',
                    address: response.data.data.address || '',
                });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderHistory = async () => {
        try {
            setLoadingOrders(true);
            const response = await api.get('/orders/history');
            if (response.data.success) {
                setOrders(response.data.data || []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        try {
            setError('');
            const response = await api.put('/user/profile', formData);
            if (response.data.success) {
                setUserData(response.data.data);
                setEditing(false);
                // Update auth context
                if (window.location.reload) {
                    // Optionally reload to refresh auth context
                }
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    const handleCancel = () => {
        setFormData({
            username: userData?.username || '',
            email: userData?.email || '',
            contact_number: userData?.contact_number || '',
            address: userData?.address || '',
        });
        setEditing(false);
        setError('');
    };

    const handleLogout = () => {
        logout();
        navigate('/home');
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

    if (loading) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium">Loading account information...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-20 pb-16 sm:pt-16 font-sans">
                <div className="max-w-[800px] mx-auto px-6 lg:px-4 flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center gap-1 hover:text-green-600 transition-colors bg-transparent border-0 cursor-pointer p-0 font-medium"
                        >
                            <Home size={14} />
                            Home
                        </button>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-gray-900 font-bold">My Account</span>
                    </nav>

                    <h1 className="text-3xl font-extrabold text-gray-900 m-0 sm:text-2xl">
                        Account Settings
                    </h1>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Profile Section */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 m-0">
                                Profile Information
                            </h2>
                            {!editing ? (
                                <button
                                    className="flex items-center gap-2 bg-green-50 text-green-600 border border-green-100 py-2 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all hover:bg-green-100 active:scale-95"
                                    onClick={() => setEditing(true)}
                                >
                                    <Edit2 size={16} />
                                    <span>Edit</span>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        className="flex items-center gap-2 bg-green-600 text-white border-none py-2 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all hover:bg-green-700 active:scale-95 shadow-md shadow-green-100"
                                        onClick={handleSave}
                                    >
                                        <Save size={16} />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        className="flex items-center gap-2 bg-gray-50 text-gray-600 border border-gray-100 py-2 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all hover:bg-gray-100 active:scale-95"
                                        onClick={handleCancel}
                                    >
                                        <X size={16} />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                {
                                    label: 'Username',
                                    name: 'username',
                                    icon: <User size={18} />,
                                    value: userData?.username,
                                },
                                {
                                    label: 'Email',
                                    name: 'email',
                                    icon: <Mail size={18} />,
                                    value: userData?.email,
                                    type: 'email',
                                },
                                {
                                    label: 'Contact Number',
                                    name: 'contact_number',
                                    icon: <Phone size={18} />,
                                    value: userData?.contact_number,
                                    type: 'tel',
                                },
                            ].map((field) => (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                        <span className="text-gray-400">{field.icon}</span>
                                        {field.label}
                                    </label>
                                    {editing ? (
                                        <input
                                            type={field.type || 'text'}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                                        />
                                    ) : (
                                        <p className="text-base text-gray-900 font-bold m-0 pl-1">
                                            {field.value || 'N/A'}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                    <span className="text-gray-400">
                                        <MapPin size={18} />
                                    </span>
                                    Delivery Address
                                </label>
                                {editing ? (
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium min-h-[100px] resize-none"
                                        placeholder="Enter your delivery address"
                                    />
                                ) : (
                                    <p className="text-base text-gray-900 font-bold m-0 pl-1 leading-relaxed">
                                        {userData?.address || 'No address set'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order History Section */}
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-gray-900 m-0">Order History</h2>
                            <button
                                className="flex items-center gap-2 text-green-600 bg-green-50 py-2 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all hover:bg-green-100"
                                onClick={() => navigate('/orders')}
                            >
                                <History size={16} />
                                <span>View All</span>
                            </button>
                        </div>

                        {loadingOrders ? (
                            <div className="flex flex-col items-center py-12 gap-3 text-gray-400">
                                <div className="w-8 h-8 border-3 border-gray-100 border-t-green-500 rounded-full animate-spin"></div>
                                <p className="text-sm font-medium">Loading orders...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center py-12 gap-4 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <Package size={32} />
                                </div>
                                <p className="text-gray-500 font-medium m-0">No orders yet</p>
                                <button
                                    className="bg-green-600 text-white border-none py-2.5 px-6 rounded-lg font-bold text-sm cursor-pointer shadow-md shadow-green-100 transition-all hover:bg-green-700"
                                    onClick={() => navigate('/home')}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div
                                        key={order.order_id}
                                        className="p-5 rounded-xl border border-gray-50 bg-gray-50/30 flex flex-col gap-4 transition-all hover:border-green-100 hover:bg-white group"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-base font-bold text-gray-900 m-0 mb-1 group-hover:text-green-700 transition-colors">
                                                    Order #{order.order_number}
                                                </h4>
                                                <p className="text-xs font-bold text-gray-400 m-0 uppercase tracking-wider">
                                                    {formatDate(order.created_at)}
                                                </p>
                                            </div>
                                            <div
                                                className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-sm
                        ${
                            order.status === 'pending'
                                ? 'bg-amber-400 shadow-amber-100'
                                : order.status === 'delivered'
                                  ? 'bg-green-500 shadow-green-100'
                                  : 'bg-blue-500 shadow-blue-100'
                        }`}
                                            >
                                                {order.status}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100/50">
                                            <span className="text-sm font-bold text-gray-500">
                                                {order.item_count || 0} items
                                            </span>
                                            <span className="text-lg font-black text-gray-900">
                                                ₹{parseFloat(order.total_amount).toFixed(2)}
                                            </span>
                                        </div>
                                        <button
                                            className="w-full bg-white text-gray-700 border border-gray-100 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest cursor-pointer transition-all hover:bg-green-600 hover:text-white hover:border-green-600"
                                            onClick={() => navigate('/orders')}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))}
                                {orders.length > 5 && (
                                    <button
                                        className="w-full bg-gray-50 text-gray-600 border border-gray-100 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all hover:bg-gray-100"
                                        onClick={() => navigate('/orders')}
                                    >
                                        View All {orders.length} Orders
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Logout Section */}
                    <button
                        className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-600 border border-red-100 py-4 rounded-2xl font-black text-base uppercase tracking-widest cursor-pointer transition-all hover:bg-red-600 hover:text-white hover:border-red-600 shadow-sm shadow-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut size={20} />
                        <span>Logout Account</span>
                    </button>
                </div>
            </div>
        </>
    );
}
