import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import OrderModal from '../components/OrderModal';
import Login from '../components/Login';
import api from '../../utils/api';

export default function Cart() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        clearCart,
    } = useCart();
    const [showLogin, setShowLogin] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    const handleIncrease = (productId) => {
        increaseQuantity(productId);
    };

    const handleDecrease = (productId, currentQuantity) => {
        if (currentQuantity <= 1) {
            removeFromCart(productId);
        } else {
            decreaseQuantity(productId);
        }
    };

    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoadingUser(true);
                const response = await api.get('/user/profile');
                if (response.data.success) {
                    setUserData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserData({
                    username: 'Guest',
                    email: '',
                    contact_number: '',
                    address: 'India',
                });
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserData();
    }, []);

    const handlePlaceOrder = async () => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            // Save cart to localStorage before redirecting
            try {
                localStorage.setItem('vcoop_cart', JSON.stringify(cartItems));
                localStorage.setItem('vcoop_redirect_to', 'cart');
                console.log('Cart saved before login redirect');
            } catch (error) {
                console.error('Error saving cart:', error);
            }
            // Show login modal
            setShowLogin(true);
            return;
        }

        // User is authenticated, proceed with order
        try {
            setLoadingUser(true);
            const response = await api.get('/user/profile');
            let currentUserData = userData;

            if (response.data.success) {
                currentUserData = response.data.data;
                setUserData(currentUserData);
            } else if (!currentUserData) {
                currentUserData = {
                    username: 'Guest',
                    email: '',
                    contact_number: '',
                    address: 'Nashik',
                };
            }

            const normalizedCartItems = cartItems.map((item) => ({
                ...item,
                images: Array.isArray(item.images) ? item.images : item.images ? [item.images] : [],
            }));

            // Create order in database
            const orderData = {
                items: normalizedCartItems,
                itemTotal: totalPrice,
                deliveryFee: deliveryFee,
                totalAmount: finalTotal,
                userData: currentUserData,
            };

            const orderResponse = await api.post('/orders/place', orderData);

            if (orderResponse.data.success) {
                setShowOrderModal(true);
                // Order saved successfully
            } else {
                throw new Error(orderResponse.data.message || 'Failed to create order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            if (error.response?.status === 401) {
                // Token expired, redirect to login
                localStorage.setItem('vcoop_cart', JSON.stringify(cartItems));
                localStorage.setItem('vcoop_redirect_to', 'cart');
                setShowLogin(true);
            } else {
                alert(
                    error.response?.data?.message ||
                        error.message ||
                        'Failed to place order. Please try again.'
                );
            }
        } finally {
            setLoadingUser(false);
        }
    };

    // Handle login success - restore cart if needed
    useEffect(() => {
        if (isAuthenticated() && localStorage.getItem('vcoop_redirect_to') === 'cart') {
            // User logged in, cart is already in localStorage from CartContext
            localStorage.removeItem('vcoop_redirect_to');
            setShowLogin(false);
        }
    }, [isAuthenticated]);

    const handleCloseOrderModal = () => {
        setShowOrderModal(false);
        clearCart(); // Clear cart when modal is closed
        navigate('/home');
    };

    const getImageUrl = (item) => {
        if (item.imageUrls && item.imageUrls[0]) {
            return item.imageUrls[0];
        }
        if (item.images && item.images[0]) {
            return `http://localhost:5000/uploads/home_page_products/${item.images[0]}`;
        }
        return null;
    };

    const totalItems = getTotalItems();
    const totalPrice = getTotalPrice();
    const deliveryFee = totalPrice > 0 ? 20 : 0;
    const finalTotal = totalPrice + deliveryFee;

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-16 pb-12 sm:pt-14 font-sans">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-4">
                    {/* Cart Header */}
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-900 m-0 sm:text-xl">
                            My Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                        </h1>
                        {cartItems.length > 0 && (
                            <button
                                className="bg-red-50 text-red-600 border border-red-100 py-2 px-4 rounded-lg font-semibold text-sm cursor-pointer transition-all hover:bg-red-100 active:scale-95 sm:px-3 sm:py-1.5"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        /* Empty Cart */
                        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <ShoppingBag size={80} className="text-gray-200 mb-6" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-xs text-center">
                                Looks like you haven't added anything to your cart yet.
                            </p>
                            <Link
                                to="/home"
                                className="bg-green-600 text-white no-underline py-3.5 px-10 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:-translate-y-0.5"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {cartItems.map((item) => {
                                    const imageUrl = getImageUrl(item);
                                    const cartQty = item.cartQuantity || 1;
                                    const productQty = item.quantity || 'N/A';
                                    const itemTotal = (parseFloat(item.price) || 0) * cartQty;

                                    return (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-5 sm:flex-col sm:items-start sm:gap-4"
                                        >
                                            {/* Product Image */}
                                            <div
                                                className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center cursor-pointer sm:w-20 sm:h-20"
                                                onClick={() => navigate(`/product/${item.id}`)}
                                            >
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                ) : (
                                                    <div className="text-gray-400 text-[10px] italic">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3
                                                    className="text-base font-bold text-gray-900 m-0 mb-1 truncate cursor-pointer hover:text-green-600 transition-colors"
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                >
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 m-0 mb-2">
                                                    {productQty}
                                                </p>
                                                <p className="text-lg font-bold text-gray-900 m-0">
                                                    ₹{parseFloat(item.price) || 0}
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-100 sm:w-full sm:justify-center">
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 border border-gray-100 rounded-lg cursor-pointer hover:text-red-500 hover:border-red-100 transition-colors"
                                                    onClick={() => handleDecrease(item.id, cartQty)}
                                                >
                                                    {cartQty <= 1 ? (
                                                        <Trash2 size={16} />
                                                    ) : (
                                                        <Minus size={16} />
                                                    )}
                                                </button>
                                                <span className="text-base font-bold text-gray-900 min-w-[24px] text-center">
                                                    {cartQty}
                                                </span>
                                                <button
                                                    className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 border border-gray-100 rounded-lg cursor-pointer hover:text-green-600 hover:border-green-100 transition-colors"
                                                    onClick={() => handleIncrease(item.id)}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right flex flex-col gap-2 shrink-0 sm:w-full sm:flex-row sm:justify-between sm:items-center sm:pt-3 sm:border-t sm:border-gray-50">
                                                <p className="text-lg font-extrabold text-gray-900 m-0">
                                                    ₹{itemTotal.toFixed(2)}
                                                </p>
                                                <button
                                                    className="text-gray-400 border-none bg-none cursor-pointer hover:text-red-500 transition-colors p-1"
                                                    onClick={() => handleRemove(item.id)}
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:sticky lg:top-24">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-6">
                                    <h3 className="text-xl font-bold text-gray-900 m-0">
                                        Order Summary
                                    </h3>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Item Total</span>
                                            <span className="font-semibold text-gray-900">
                                                ₹{totalPrice.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Delivery Fee</span>
                                            <span
                                                className={`font-semibold ${deliveryFee > 0 ? 'text-gray-900' : 'text-green-600'}`}
                                            >
                                                {deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}
                                            </span>
                                        </div>

                                        <div className="h-px bg-gray-100 my-1"></div>

                                        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span className="text-green-600">
                                                ₹{finalTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-green-600 text-white border-none py-4 rounded-xl font-bold text-lg cursor-pointer shadow-lg shadow-green-100 transition-all hover:bg-green-700 hover:shadow-green-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={handlePlaceOrder}
                                        disabled={loadingUser}
                                    >
                                        {loadingUser ? 'Processing...' : 'Place Order'}
                                    </button>

                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col gap-2">
                                        <p className="text-sm font-bold text-blue-900 m-0 flex items-center gap-2">
                                            <Clock size={16} /> Delivery in 16 minutes
                                        </p>
                                        <p className="text-[13px] text-blue-700 leading-tight m-0">
                                            {loadingUser
                                                ? 'Loading address...'
                                                : userData?.address || 'No address found'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Modal */}
            <OrderModal
                isOpen={showOrderModal}
                onClose={handleCloseOrderModal}
                orderSummary={{
                    itemTotal: totalPrice,
                    deliveryFee: deliveryFee,
                    total: finalTotal,
                    itemCount: totalItems,
                }}
                userData={userData}
                loadingUser={loadingUser}
            />

            {/* Login Modal */}
            <Login
                showLogin={showLogin}
                setShowLogin={setShowLogin}
                onLoginSuccess={() => {
                    setShowLogin(false);
                }}
            />
        </>
    );
}
