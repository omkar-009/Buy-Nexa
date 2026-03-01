import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartNotification from '../components/CartNotification';
import api from '../../utils/api';
import '../App.css';

export default function SearchResults() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { addToCart, notification, hideNotification } = useCart();
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
                                {products.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.id}`)}
                                        className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-50/50 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                                    >
                                        <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center relative group-hover:bg-white transition-colors">
                                            <img
                                                src={
                                                    item.imageUrls && item.imageUrls[0]
                                                        ? item.imageUrls[0]
                                                        : '/placeholder.png'
                                                }
                                                alt={item.name}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder.png';
                                                }}
                                            />
                                            {item.discount > 0 && (
                                                <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                                                    {item.discount}% OFF
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 gap-2">
                                            <h3 className="text-sm font-bold text-gray-800 m-0 line-clamp-2 leading-snug h-10 group-hover:text-green-600 transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest m-0">
                                                {item.quantity}
                                            </p>

                                            <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-gray-900">
                                                        ₹{item.price}
                                                    </span>
                                                    {item.mrp > item.price && (
                                                        <span className="text-[10px] text-gray-400 line-through">
                                                            ₹{item.mrp}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center transition-all hover:bg-green-600 hover:text-white active:scale-90"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addToCart(item);
                                                    }}
                                                >
                                                    <span className="text-xs font-black">ADD</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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
