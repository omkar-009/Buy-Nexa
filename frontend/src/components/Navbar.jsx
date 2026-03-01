import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, UserCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Login from '../components/Login';
import useUserStore from '../store/useUserStore';
import useProductStore from '../store/useProductStore';
import '../App.css';

import logo from '../assets/bnLogo.png';

export default function Navbar() {
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);
    const { getTotalItems, getTotalPrice } = useCart();
    const { user, isAuthenticated } = useAuth();
    const cartItemCount = getTotalItems();
    const cartTotalPrice = getTotalPrice();
    const { userProfile: userData, getProfile } = useUserStore();
    const {
        searchResults,
        searchLoading: loadingSearch,
        searchProducts,
        clearSearch: clearStoreSearch,
    } = useProductStore();

    // fetch user profile
    useEffect(() => {
        if (isAuthenticated()) {
            getProfile();
        }
    }, [isAuthenticated, getProfile]);

    // Real-time search as user types
    useEffect(() => {
        if (searchQuery.trim().length < 2) {
            clearStoreSearch();
            setShowResults(false);
            return;
        }

        const debounceTimer = setTimeout(() => {
            searchProducts(searchQuery.trim());
            setShowResults(true);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, searchProducts, clearStoreSearch]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                resultsRef.current &&
                !resultsRef.current.contains(event.target)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowResults(false);
        }
    };

    const handleSearchResultClick = (productId) => {
        setSearchQuery('');
        setShowResults(false);
        navigate(`/product/${productId}`);
    };

    const clearSearch = () => {
        setSearchQuery('');
        clearStoreSearch();
        setShowResults(false);
    };

    return (
        <>
            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <nav className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start overflow-hidden">
                        <img
                            src={logo}
                            alt="Buy Nexa"
                            className="w-[160px] md:w-[180px] mr-5 transition-transform duration-500 hover:scale-135 scale-125 origin-left"
                        />
                    </div>

                    {/* Search Bar */}
                    <div
                        className="flex-1 flex justify-center w-full max-w-xl relative"
                        ref={searchRef}
                    >
                        <form
                            className="relative w-full max-w-md group"
                            onSubmit={handleSearchSubmit}
                        >
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="Search here"
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm transition-all focus:bg-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => {
                                    if (searchResults.length > 0) {
                                        setShowResults(true);
                                    }
                                }}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {/* Search Results Dropdown */}
                        {showResults && (
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2 w-full max-w-md bg-white border border-gray-100 rounded-xl shadow-xl mt-2 overflow-hidden z-50"
                                ref={resultsRef}
                            >
                                {loadingSearch ? (
                                    <div className="p-10 text-center text-gray-500 text-sm italic">
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            <span>
                                                {searchResults.length} result
                                                {searchResults.length !== 1 ? 's' : ''} found
                                            </span>
                                            <button
                                                className="text-green-600 hover:text-green-700 font-bold hover:underline"
                                                onClick={() => {
                                                    navigate(
                                                        `/search?q=${encodeURIComponent(
                                                            searchQuery.trim()
                                                        )}`
                                                    );
                                                    setShowResults(false);
                                                }}
                                            >
                                                View All
                                            </button>
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {searchResults.slice(0, 5).map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-4 p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() =>
                                                        handleSearchResultClick(product.id)
                                                    }
                                                >
                                                    <div className="w-12 h-12 rounded-lg border border-gray-100 overflow-hidden bg-white shrink-0 flex items-center justify-center p-1">
                                                        <img
                                                            src={
                                                                product.imageUrls &&
                                                                product.imageUrls[0]
                                                                    ? product.imageUrls[0]
                                                                    : '/placeholder.png'
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder.png';
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mb-0.5">
                                                            {product.quantity}
                                                        </p>
                                                        <p className="text-sm font-bold text-green-600">
                                                            ₹{product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            {searchResults.length > 5 && (
                                                <div
                                                    className="flex items-center gap-4 p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer justify-center"
                                                    onClick={() => {
                                                        navigate(
                                                            `/search?q=${encodeURIComponent(
                                                                searchQuery.trim()
                                                            )}`
                                                        );
                                                        setShowResults(false);
                                                    }}
                                                >
                                                    <span className="text-sm font-medium text-green-600">
                                                        View all {searchResults.length} results →
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : searchQuery.trim().length >= 2 ? (
                                    <div className="p-10 text-center text-gray-500 text-sm font-medium">
                                        No products found
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Login & Cart */}
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        {isAuthenticated() ? (
                            <button
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium text-sm transition-all active:scale-95"
                                onClick={() => navigate('/account')}
                                title="My Account"
                            >
                                <UserCircle size={20} className="text-green-500" />
                                <span>Account</span>
                            </button>
                        ) : (
                            <button
                                className="px-6 py-2 text-sm font-semibold text-gray-700 hover:text-green-600 transition-all rounded-lg hover:bg-green-50"
                                onClick={() => setShowLogin(true)}
                            >
                                Login
                            </button>
                        )}

                        <button
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold transition-all min-w-[120px] active:scale-95 shadow-sm hover:shadow-md ${
                                cartItemCount > 0
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => navigate('/cart')}
                        >
                            <ShoppingCart
                                size={24}
                                className={`shrink-0 transition-all duration-200 stroke-[2.5] ${cartItemCount > 0 ? 'text-white stroke-white animate-bounce' : 'text-gray-700'}`}
                                strokeWidth={2}
                            />
                            {cartItemCount > 0 ? (
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[11px] font-medium opacity-90">
                                        {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                                    </span>
                                    <span className="text-base font-bold">
                                        ₹{Math.round(cartTotalPrice)}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-sm font-bold">My Cart</span>
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Login Modal */}
            <Login showLogin={showLogin} setShowLogin={setShowLogin} />
        </>
    );
}
