import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Search, UserCircle, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import useUserStore from '../store/useUserStore';
import useProductStore from '../store/useProductStore';
import '../App.css';

import logo from '../assets/bnLogo.png';

export default function Navbar() {
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const searchRef = useRef(null);
    const resultsRef = useRef(null);
    const { getTotalItems, getTotalPrice } = useCartStore();
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

    // Scroll listener for sticky header effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`sticky top-0 z-[80] w-full transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-2'
                        : 'bg-white py-4'
                }`}
            >
                <nav className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to="/home" className="shrink-0 flex items-center">
                        <img
                            src={logo}
                            alt="Buy Nexa"
                            className="w-[140px] object-contain transition-transform duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {['HOME', 'ABOUT US', 'BECOME A SELLER'].map((item) => (
                            <Link
                                key={item}
                                to={
                                    item === 'HOME'
                                        ? '/home'
                                        : item === 'ABOUT US'
                                          ? '/about'
                                          : '/become-seller'
                                }
                                className="text-[12px] font-black tracking-[0.1em] text-gray-400 hover:text-black transition-colors no-underline"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div
                        className="flex-1 hidden md:flex justify-center max-w-xl relative"
                        ref={searchRef}
                    >
                        <form className="relative w-full group" onSubmit={handleSearchSubmit}>
                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors"
                            />
                            <input
                                type="text"
                                placeholder="What are you looking for?"
                                className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-full outline-none text-sm transition-all focus:bg-white focus:border-black focus:ring-0"
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
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    onClick={clearSearch}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </form>

                        {/* Search Results Dropdown */}
                        <AnimatePresence>
                            {showResults && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl mt-4 overflow-hidden z-[90]"
                                    ref={resultsRef}
                                >
                                    {loadingSearch ? (
                                        <div className="p-12 text-center text-gray-400 text-sm font-medium animate-pulse uppercase tracking-widest">
                                            Searching...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="max-h-[500px] overflow-y-auto">
                                            <div className="p-4 bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Results ({searchResults.length})
                                            </div>
                                            {searchResults.slice(0, 6).map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-6 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                                                    onClick={() =>
                                                        handleSearchResultClick(product.id)
                                                    }
                                                >
                                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 flex items-center justify-center border border-transparent group-hover:border-black/5 p-2 transition-all">
                                                        <img
                                                            src={
                                                                product.imageUrls?.[0] ||
                                                                '/placeholder.png'
                                                            }
                                                            alt={product.name}
                                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-black uppercase tracking-tight mb-1">
                                                            {product.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-400 font-medium">
                                                            {product.quantity} • ₹{product.price}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                className="w-full p-4 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all"
                                                onClick={() =>
                                                    navigate(
                                                        `/search?q=${encodeURIComponent(searchQuery.trim())}`
                                                    )
                                                }
                                            >
                                                View all results
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-gray-400 text-sm font-medium uppercase tracking-widest">
                                            No products found
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        {isAuthenticated() ? (
                            <button
                                className="group flex items-center gap-2"
                                onClick={() => navigate('/account')}
                            >
                                <UserCircle
                                    size={22}
                                    className="text-gray-400 group-hover:text-black transition-colors"
                                />
                                <span className="hidden sm:block text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                                    ACCOUNT
                                </span>
                            </button>
                        ) : (
                            <button
                                className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                LOGIN
                            </button>
                        )}

                        <button className="relative group p-2" onClick={() => navigate('/cart')}>
                            <ShoppingCart
                                size={22}
                                className="text-black transition-transform group-hover:-translate-y-0.5"
                            />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="lg:hidden p-2 text-gray-400 hover:text-black transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu size={22} />
                        </button>
                    </div>
                </nav>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-white z-[110] p-8 flex flex-col shadow-2xl"
                        >
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="self-end p-2 text-gray-400 hover:text-black transition-colors mb-12"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex flex-col gap-8">
                                {['HOME', 'ABOUT US', 'BECOME A SELLER', 'ACCOUNT'].map((item) => {
                                    if (item === 'ACCOUNT' && !isAuthenticated()) return null;
                                    const path =
                                        item === 'HOME'
                                            ? '/home'
                                            : item === 'ABOUT US'
                                              ? '/about'
                                              : item === 'ACCOUNT'
                                                ? '/account'
                                                : '/become-seller';
                                    return (
                                        <Link
                                            key={item}
                                            to={path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-2xl font-black uppercase tracking-tighter text-gray-300 hover:text-black transition-colors no-underline"
                                        >
                                            {item}
                                        </Link>
                                    );
                                })}
                                {!isAuthenticated() && (
                                    <button
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                            setIsAuthModalOpen(true);
                                        }}
                                        className="text-2xl font-black uppercase tracking-tighter text-left text-gray-300 hover:text-black transition-colors border-none bg-transparent p-0 cursor-pointer"
                                    >
                                        LOGIN / JOIN
                                    </button>
                                )}
                            </div>

                            <div className="mt-auto border-t border-gray-100 pt-8">
                                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                                    <span>BUY NEXA</span>
                                    <span className="w-4 h-px bg-gray-200" />
                                    <span>2026</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
}
