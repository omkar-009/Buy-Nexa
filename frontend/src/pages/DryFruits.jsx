import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Star } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import CartNotification from '../components/CartNotification';
import api from '../../utils/api';
import ProductCard from '../components/ProductCard';
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
    } = useCartStore();
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
                        products.map((item) => {
                            const cartItem = cartItems.find((ci) => ci.id === item.id);
                            return (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    onAddToCart={addToCart}
                                    onIncrease={increaseQuantity}
                                    onDecrease={decreaseQuantity}
                                    cartQuantity={cartItem?.cartQuantity || 0}
                                    onClick={() => navigate(`/product/${item.id}`)}
                                />
                            );
                        })
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
