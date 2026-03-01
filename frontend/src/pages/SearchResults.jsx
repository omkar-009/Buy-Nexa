import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartNotification from '../components/CartNotification';
import api from '../../utils/api';
import ProductCard from '../components/ProductCard';
import '../App.css';

export default function SearchResults() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const {
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        cartItems,
        notification,
        hideNotification,
    } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (query.trim().length >= 2) {
            fetchSearchResults(query);
        } else {
            setProducts([]);
            setError('');
        }
    }, [query]);

    const fetchSearchResults = async (searchQuery) => {
        if (!searchQuery || searchQuery.trim().length < 2) {
            setProducts([]);
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await api.get(
                `/products/search?query=${encodeURIComponent(searchQuery.trim())}`
            );
            if (response.data.success) {
                setProducts(response.data.data || []);
                if (response.data.data.length === 0) {
                    setError('No products found');
                }
            } else {
                setError(response.data.message || 'Failed to search products');
                setProducts([]);
            }
        } catch (err) {
            console.error('Error searching products:', err);
            setError(
                err.response?.data?.message ||
                    err.message ||
                    'Failed to search products. Please try again.'
            );
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-24 pb-20 sm:pt-20 font-sans">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-4">
                    {/* Results Header */}
                    <div className="mb-10">
                        {query && (
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black text-gray-900 m-0 sm:text-2xl">
                                    {loading
                                        ? 'Searching...'
                                        : products.length > 0
                                          ? `Results for "${query}"`
                                          : `No results for "${query}"`}
                                </h1>
                                {!loading && products.length > 0 && (
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                                        Found {products.length} product
                                        {products.length !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-medium tracking-wide">
                                    Searching products...
                                </p>
                            </div>
                        ) : error && products.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-6 max-w-md mx-auto">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                                    <XCircle size={40} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black text-gray-900 m-0">
                                        No Products Found
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed m-0">{error}</p>
                                </div>
                                <button
                                    className="bg-green-600 text-white border-none py-3.5 px-8 rounded-xl font-bold text-sm cursor-pointer transition-all hover:bg-green-700 active:scale-95 shadow-lg shadow-green-100"
                                    onClick={() => navigate('/home')}
                                >
                                    Back to Home
                                </button>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-4">
                                {products.map((item) => {
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
                                })}
                            </div>
                        ) : query ? (
                            <div className="bg-white rounded-3xl p-16 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-6 max-w-md mx-auto">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                    <Search size={48} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-2xl font-black text-gray-800 m-0">
                                        No matching products
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed m-0">
                                        We couldn't find anything for "{query}". Try searching with
                                        different keywords.
                                    </p>
                                </div>
                                <button
                                    className="bg-gray-900 text-white border-none py-3.5 px-8 rounded-xl font-bold text-sm cursor-pointer transition-all hover:bg-black active:scale-95"
                                    onClick={() => navigate('/home')}
                                >
                                    Back to Home
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center gap-4 opacity-40">
                                <Search size={80} className="text-gray-300" />
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest m-0">
                                        Start searching
                                    </h3>
                                    <p className="text-sm font-medium text-gray-400 m-0">
                                        Enter a product name above to search
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cart Notification */}
            <CartNotification
                message={notification.message}
                show={notification.show}
                onClose={hideNotification}
            />
        </>
    );
}
