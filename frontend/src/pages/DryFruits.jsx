import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartNotification from '../components/CartNotification';
import api from '../../utils/api';
import '../App.css';

export default function DryFruits() {
    const navigate = useNavigate();
    const {
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        cartItems,
        notification,
        hideNotification,
    } = useCart();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const scrollRef = useRef(null);

    useEffect(() => {
        console.log('Fetching tobacco products from API...');
        api.get('/products/dryfruits')
            .then((res) => {
                console.log('API Response:', res.data);
                if (res.data.success) {
                    const productsData = res.data.data || [];
                    console.log('Products received:', productsData);
                    setProducts(productsData);
                } else {
                    console.error('API returned error:', res.data.message);
                    setError(res.data.message || 'Failed to fetch products');
                }
            })
            .catch((err) => {
                console.error('Error fetching products:', err);
                console.error('Error details:', err.response?.data || err.message);
                setError(
                    err.response?.data?.message ||
                        err.message ||
                        'Failed to fetch products. Please check if the backend server is running.'
                );
            })
            .finally(() => {
                setLoading(false);
                setTimeout(checkScrollButtons, 100);
            });
    }, []);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = 300;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkScrollButtons, 400); // recheck after smooth scroll
        }
    };

    const checkScrollButtons = () => {
        const el = scrollRef.current;
        if (!el) return;

        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        setShowLeftArrow(!atStart);
        setShowRightArrow(!atEnd);
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons(); // run once initially
        }
        return () => el && el.removeEventListener('scroll', checkScrollButtons);
    }, [products]);

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-4 sm:px-4">
            <div className="flex justify-between items-center mb-6 px-1">
                <h5 className="text-xl font-bold text-gray-900 m-0 sm:text-lg">Dry Fruits</h5>
                <button
                    className="text-green-600 no-underline text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer"
                    onClick={() => navigate('/category/dryfruits')}
                >
                    See all
                </button>
            </div>

            <div className="relative mt-6">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-md cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white hover:border-green-600 sm:hidden -left-5"
                        onClick={() => scroll('left')}
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Product Cards */}
                <div
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    ref={scrollRef}
                    style={{
                        scrollBehavior: 'smooth',
                    }}
                >
                    {loading ? (
                        <p className="text-gray-500 italic py-4">Loading products...</p>
                    ) : error ? (
                        <p className="text-red-500 py-4">{error}</p>
                    ) : products.length > 0 ? (
                        products.map((item) => (
                            <div
                                className="min-w-[240px] max-w-[240px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-3 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                                key={item.id}
                                onClick={() => navigate(`/product/${item.id}`)}
                            >
                                <div className="w-full h-[150px] flex items-center justify-center bg-gray-50 rounded-lg mb-3 overflow-hidden group-hover:bg-white transition-colors">
                                    <img
                                        src={
                                            item.imageUrls && item.imageUrls[0]
                                                ? item.imageUrls[0]
                                                : '/placeholder.png'
                                        }
                                        alt={item.name}
                                        className="w-full h-full object-contain mb-1 transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            console.error(
                                                'Image failed to load:',
                                                item.imageUrls?.[0]
                                            );
                                            e.target.src = '/placeholder.png';
                                        }}
                                    />
                                </div>
                                <p className="text-sm font-semibold text-gray-800 m-0 line-clamp-2 min-h-[40px] leading-tight">
                                    {item.name}
                                </p>
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-[12px] text-gray-500 m-0">{item.quantity}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <Star size={14} fill="#22c55e" stroke="#22c55e" />
                                        <span className="ml-1 text-[13px] font-medium text-gray-700">
                                            {(Number(item.rating) || 0).toFixed(1)}
                                        </span>
                                        <span className="ml-1 text-[13px] text-gray-500">
                                            ({Number(item.rating_count) || 0})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                    <p className="text-sm font-bold text-gray-900 m-0">
                                        ₹{item.price}
                                    </p>
                                    {(() => {
                                        const cartItem = cartItems.find(
                                            (cartItem) => cartItem.id === item.id
                                        );
                                        const quantity = cartItem?.cartQuantity || 0;
                                        if (quantity > 0) {
                                            return (
                                                <div className="flex items-center gap-2 bg-green-50 rounded-md p-0.5">
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center border-none bg-none text-green-600 cursor-pointer rounded-sm hover:bg-green-100 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            decreaseQuantity(item.id);
                                                        }}
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-sm font-bold text-green-600 min-w-[14px] text-center">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        className="w-7 h-7 flex items-center justify-center border-none bg-none text-green-600 cursor-pointer rounded-sm hover:bg-green-100 transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            increaseQuantity(item.id);
                                                        }}
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <button
                                                    className="bg-white text-green-600 border border-green-600 py-1.5 px-4 rounded-md font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white sm:px-3 sm:py-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(item);
                                                    }}
                                                >
                                                    ADD
                                                </button>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 py-4">No products found.</p>
                    )}
                </div>

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-md cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white hover:border-green-600 sm:hidden -right-5"
                        onClick={() => scroll('right')}
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Cart Notification */}
            <CartNotification
                message={notification.message}
                show={notification.show}
                onClose={hideNotification}
            />
        </div>
    );
}
