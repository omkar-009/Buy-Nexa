import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ChevronDown,
    ChevronUp,
    Clock,
    ShoppingCart,
    Package,
    ChevronRight,
    ChevronLeft,
    Plus,
    Minus,
    Star,
    Shield,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import useCartStore from '../store/useCartStore';
import useProductStore from '../store/useProductStore';
import ProductCard from './ProductCard';
import CartNotification from './CartNotification';

export default function ProductDescription() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        cartItems,
        notification,
        hideNotification,
    } = useCartStore();
    const {
        currentProduct: product,
        loading,
        error,
        similarProducts,
        loadingSimilar,
        fetchProductById,
        fetchSimilarProducts,
        submitRating: storeSubmitRating,
    } = useProductStore();

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const similarProductsScrollRef = useRef(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductById(id).then((res) => {
                if (res.success && res.product.category) {
                    fetchSimilarProducts(res.product.category, id);
                }
            });
            setSelectedImageIndex(0);
            setImageError(false);
            window.scrollTo(0, 0);
        }
    }, [id, fetchProductById, fetchSimilarProducts]);

    useEffect(() => {
        if (similarProducts.length > 0) {
            setTimeout(checkSimilarScrollButtons, 100);
        }
    }, [similarProducts]);

    const submitRating = async (value) => {
        setSubmittingRating(true);
        try {
            const res = await storeSubmitRating(id, value);
            if (res.success) {
                setUserRating(value);
                toast.success('Thank you for your rating!');
            } else {
                toast.error(res.message || 'Failed to submit rating');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Please login to rate this product');
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        } finally {
            setSubmittingRating(false);
        }
    };

    const scrollSimilarProducts = (direction) => {
        const { current } = similarProductsScrollRef;
        if (current) {
            const scrollAmount = 300;
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
            setTimeout(checkSimilarScrollButtons, 400);
        }
    };

    const checkSimilarScrollButtons = () => {
        const el = similarProductsScrollRef.current;
        if (!el) return;

        const atStart = el.scrollLeft <= 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

        setShowLeftArrow(!atStart);
        setShowRightArrow(!atEnd);
    };

    useEffect(() => {
        const el = similarProductsScrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkSimilarScrollButtons);
            checkSimilarScrollButtons();
        }
        return () => el && el.removeEventListener('scroll', checkSimilarScrollButtons);
    }, [similarProducts]);

    const handleAddToCart = () => {
        if (product) {
            addToCart(product);
        }
    };

    const calculateDiscount = (price) => {
        const mrp = price * 1.1;
        const discount = ((mrp - price) / mrp) * 100;
        return { mrp: Math.round(mrp), discount: Math.round(discount) };
    };

    const getCategoryDisplayName = (category) => {
        const categoryMap = {
            processed: 'Processed Products',
            fruits: 'Fruits',
            DryFruits: 'Dry Fruits',
        };
        return categoryMap[category] || category;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full"
                />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
                    {error || 'Product not found'}
                </h2>
                <button
                    onClick={() => navigate('/home')}
                    className="bg-black text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all"
                >
                    Go Back Home
                </button>
            </div>
        );
    }

    const { mrp, discount } = calculateDiscount(product.price);
    const imageUrl = product.imageUrls?.[selectedImageIndex] || '/placeholder.png';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[1440px] mx-auto px-6 py-12 lg:px-8"
        >
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <Link to="/home" className="hover:text-black transition-colors">
                    Home
                </Link>
                <ChevronRight size={12} />
                <span className="hover:text-black transition-colors">
                    {getCategoryDisplayName(product.category)}
                </span>
                <ChevronRight size={12} />
                <span className="text-black">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                {/* Left Column - Images */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full aspect-square bg-gray-50 rounded-3xl overflow-hidden relative group p-8 flex items-center justify-center"
                    >
                        <motion.img
                            key={imageUrl}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                        {product.discount > 0 && (
                            <div className="absolute top-8 left-8 bg-black text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                {discount}% OFF
                            </div>
                        )}
                    </motion.div>

                    {/* Thumbnails */}
                    {product.imageUrls?.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {product.imageUrls.map((url, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden cursor-pointer bg-gray-50 border-2 transition-all p-2 ${
                                        selectedImageIndex === index
                                            ? 'border-black'
                                            : 'border-transparent'
                                    }`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img
                                        src={url}
                                        alt=""
                                        className="w-full h-full object-contain mix-blend-multiply"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Info */}
                <div className="lg:col-span-5 flex flex-col">
                    <div className="mb-10">
                        <span className="inline-block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">
                            Premium Essentials
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight uppercase">
                            {product.name}
                        </h1>
                        <div className="flex items-center gap-4 text-xl font-bold">
                            <span className="text-black">₹{product.price}</span>
                            <span className="text-gray-300 line-through font-medium">₹{mrp}</span>
                        </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={16}
                                    fill={product.rating >= star ? 'black' : 'none'}
                                    stroke={product.rating >= star ? 'black' : '#e5e7eb'}
                                    className="cursor-pointer"
                                    onClick={() => submitRating(star)}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-black tracking-tight">
                            {product.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                            ({product.rating_count || 0} Reviews)
                        </span>
                    </div>

                    <div className="space-y-8 mb-10">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 font-sans">
                                Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {product.details ||
                                    'Luxury product designed for the modern lifestyle. Crafted with attention to detail and premium quality materials.'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 font-sans">
                                Availability
                            </h3>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>In Stock • Ready to ship</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-4">
                        {(() => {
                            const cartItem = cartItems.find((c) => c.id === product.id);
                            const qty = cartItem?.cartQuantity || 0;
                            if (qty > 0) {
                                return (
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 flex items-center justify-between bg-black text-white p-4 rounded-full">
                                            <button
                                                onClick={() => decreaseQuantity(product.id)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="text-lg font-black">{qty}</span>
                                            <button
                                                onClick={() => increaseQuantity(product.id)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => navigate('/cart')}
                                            className="bg-gray-100 p-5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
                                        >
                                            <ShoppingCart size={24} />
                                        </button>
                                    </div>
                                );
                            }
                            return (
                                <button
                                    className="w-full bg-black text-white py-5 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-900 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                                    onClick={handleAddToCart}
                                >
                                    <ShoppingCart size={20} /> Add to Bag
                                </button>
                            );
                        })()}
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mt-12">
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                            <Shield size={20} className="text-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Secure Checkout
                            </span>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                            <Package size={20} className="text-black" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                Fast Delivery
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Products */}
            <div className="border-t border-gray-100 pt-24">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">
                            You Might Also Like
                        </h2>
                        <p className="text-gray-400 font-medium tracking-tight">
                            Handpicked alternatives based on your choice.
                        </p>
                    </div>
                </div>

                <div className="relative group">
                    <AnimatePresence>
                        {showLeftArrow && (
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 transition-all hover:scale-110"
                                onClick={() => scrollSimilarProducts('left')}
                            >
                                <ChevronLeft size={24} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div
                        className="flex gap-8 overflow-x-auto pb-12 scrollbar-hide px-2"
                        ref={similarProductsScrollRef}
                    >
                        {similarProducts.map((item) => (
                            <div key={item.id} className="min-w-[280px]">
                                <ProductCard
                                    product={item}
                                    onAddToCart={addToCart}
                                    onIncrease={increaseQuantity}
                                    onDecrease={decreaseQuantity}
                                    cartQuantity={
                                        cartItems.find((c) => c.id === item.id)?.cartQuantity || 0
                                    }
                                    onClick={() => navigate(`/product/${item.id}`)}
                                />
                            </div>
                        ))}
                    </div>

                    <AnimatePresence>
                        {showRightArrow && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-gray-100 transition-all hover:scale-110"
                                onClick={() => scrollSimilarProducts('right')}
                            >
                                <ChevronRight size={24} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <CartNotification
                message={notification.message}
                show={notification.show}
                onClose={hideNotification}
            />
        </motion.div>
    );
}
