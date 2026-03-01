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
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../../utils/api';
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
    } = useCart();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [loadingSimilar, setLoadingSimilar] = useState(false);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);
    const similarProductsScrollRef = useRef(null);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError('');

                const res = await api.get(`/products/getproduct/${id}`);

                if (res.data.success) {
                    const productData = res.data.data;

                    // Handle images - could be string (JSON) or array
                    let imageFilenames = [];
                    if (productData.images) {
                        if (typeof productData.images === 'string') {
                            try {
                                imageFilenames = JSON.parse(productData.images);
                            } catch (e) {
                                console.error('Failed to parse images string:', e);
                                imageFilenames = [];
                            }
                        } else if (Array.isArray(productData.images)) {
                            imageFilenames = productData.images;
                        }
                    }

                    // Handle imageUrls - should be array of full URLs
                    let imageUrls = [];
                    if (productData.imageUrls) {
                        if (Array.isArray(productData.imageUrls)) {
                            imageUrls = productData.imageUrls;
                        } else if (typeof productData.imageUrls === 'string') {
                            try {
                                imageUrls = JSON.parse(productData.imageUrls);
                            } catch (e) {
                                imageUrls = [];
                            }
                        }
                    }

                    // If imageUrls is empty but we have filenames, construct URLs
                    if (imageUrls.length === 0 && imageFilenames.length > 0) {
                        imageUrls = imageFilenames.map(
                            (filename) =>
                                `http://localhost:5000/uploads/home_page_products/${filename}`
                        );
                    }

                    // Try to infer category from product name if missing
                    let inferredCategory = productData.category;
                    if (!inferredCategory || inferredCategory === null || inferredCategory === '') {
                        const productName = (productData.name || '').toLowerCase();
                        if (
                            productName.includes('mango') ||
                            productName.includes('grapes') ||
                            productName.includes('custard Apple')
                        ) {
                            inferredCategory = 'fruits';
                        } else if (
                            productName.includes('honey') ||
                            productName.includes('turmeric') ||
                            productName.includes('clarrified butter')
                        ) {
                            inferredCategory = 'ProcessedProducts';
                        } else if (
                            productName.includes('almonds') ||
                            productName.includes('cashew') ||
                            productName.includes('peanuts') ||
                            productName.includes('pista')
                        ) {
                            inferredCategory = 'dryfruits';
                        } else {
                            inferredCategory = 'dryfruits';
                        }
                        console.log(
                            'Category inferred from product name:',
                            productName,
                            '->',
                            inferredCategory
                        );
                    }

                    // Update product data with processed arrays - preserve category
                    const updatedProductData = {
                        ...productData,
                        category: inferredCategory,
                        images: imageFilenames,
                        imageUrls: imageUrls,
                    };

                    setProduct(updatedProductData);
                    setImageError(false);
                    setSelectedImageIndex(0); // Reset to first image

                    // Fetch similar products from same category
                    if (updatedProductData.category) {
                        console.log(
                            'Fetching similar products for category:',
                            updatedProductData.category,
                            'excluding:',
                            id
                        );
                        fetchSimilarProducts(updatedProductData.category, id);
                    } else {
                        console.warn(
                            'No category found for product, cannot fetch similar products'
                        );
                        console.warn('Product data keys:', Object.keys(updatedProductData));
                    }
                } else {
                    setError(res.data.message || 'Failed to fetch product');
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.message || 'Failed to fetch product details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchSimilarProducts = async (category, excludeId) => {
        try {
            setLoadingSimilar(true);
            console.log('Fetching similar products - Category:', category, 'ExcludeId:', excludeId);

            // Use the new similar products API endpoint
            const res = await api.get('/products/similar', {
                params: {
                    category: category,
                    excludeId: excludeId,
                },
            });

            console.log('Similar products API response:', res.data);

            if (res.data.success && res.data.data) {
                console.log('Similar products fetched:', res.data.data.length, 'products');
                setSimilarProducts(res.data.data);
                // Check scroll buttons after products are set
                setTimeout(() => {
                    checkSimilarScrollButtons();
                }, 100);
            } else {
                console.log('No similar products in response');
                setSimilarProducts([]);
            }
        } catch (err) {
            console.error('Error fetching similar products from API:', err);
            console.error('Error details:', err.response?.data);

            // Fallback to category-based fetch if similar API fails
            try {
                let endpoint = '';
                switch (category) {
                    case 'processed':
                        endpoint = '/products/processed';
                        break;
                    case 'fruits':
                        endpoint = '/products/fruits';
                        break;
                    case 'dryfruits':
                        endpoint = '/products/dryfruits';
                        break;
                    default:
                        endpoint = '/products/dryfruits';
                        break;
                }

                console.log('Trying fallback endpoint:', endpoint);
                const fallbackRes = await api.get(endpoint);
                console.log('Fallback response:', fallbackRes.data);

                if (fallbackRes.data.success) {
                    const filtered = fallbackRes.data.data.filter(
                        (p) => p.id !== parseInt(excludeId)
                    );
                    // Remove slice(0, 4) to get all products
                    console.log('Filtered similar products:', filtered.length, 'products');
                    setSimilarProducts(filtered);
                    // Check scroll buttons after products are set
                    setTimeout(() => {
                        checkSimilarScrollButtons();
                    }, 100);
                } else {
                    setSimilarProducts([]);
                }
            } catch (fallbackErr) {
                console.error('Error in fallback similar products fetch:', fallbackErr);
                setSimilarProducts([]);
            }
        } finally {
            setLoadingSimilar(false);
            console.log('Finished fetching similar products. Loading:', false);
        }
    };

    const submitRating = async (value) => {
        try {
            setSubmittingRating(true);

            const res = await api.post(`/products/rate/${id}`, {
                rating: value,
            });

            if (res.data.success) {
                setProduct((prev) => ({
                    ...prev,
                    rating: res.data.avg_rating,
                    rating_count: res.data.rating_count,
                }));

                setUserRating(value);
            }
        } catch (err) {
            console.error('Rating failed:', err);
            alert(err.response?.data?.message || 'Please login to rate');
        } finally {
            setSubmittingRating(false);
        }
    };

    // Scroll functions for similar products
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
        // Assuming 10% discount
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
            <>
                <div className="product-page-loading">
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="product-page-error">
                    <p className="text-red-500">{error}</p>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <div className="product-page-error">
                    <p>No product found</p>
                </div>
            </>
        );
    }

    const { mrp, discount } = calculateDiscount(product.price);

    // Use imageUrls if available (from API), otherwise construct from images array
    const getImageUrl = (imageIndex) => {
        console.log(`Getting image URL for index ${imageIndex}`);
        console.log('product.imageUrls:', product.imageUrls);
        console.log('product.images:', product.images);

        // First try imageUrls array (full URLs from API)
        if (
            product.imageUrls &&
            Array.isArray(product.imageUrls) &&
            product.imageUrls.length > imageIndex
        ) {
            const url = product.imageUrls[imageIndex];
            console.log(`Using imageUrls[${imageIndex}]:`, url);
            return url;
        }

        // Fallback to constructing URL from images array (filenames)
        if (product.images && Array.isArray(product.images) && product.images.length > imageIndex) {
            const filename = product.images[imageIndex];
            const url = `http://localhost:5000/uploads/home_page_products/${filename}`;
            console.log(`Constructing URL from images[${imageIndex}]:`, url);
            return url;
        }

        console.log(`No image found for index ${imageIndex}`);
        return null;
    };

    // Get images count - use the length of whichever array exists and has items
    const imagesCount =
        product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0
            ? product.imageUrls.length
            : product.images && Array.isArray(product.images) && product.images.length > 0
              ? product.images.length
              : 0;

    console.log('Total images count:', imagesCount);

    // Create array for mapping thumbnails
    const imagesArray = Array.from({ length: imagesCount }, (_, i) => i);

    return (
        <>
            <div className="max-w-[1280px] mx-auto px-6 py-5 pb-10 sm:px-4">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link to="/home" className="text-green-600 no-underline hover:underline">
                        Home
                    </Link>
                    <ChevronRight size={16} className="text-gray-400" />
                    <span className="text-gray-600">
                        {getCategoryDisplayName(product.category)}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                    <span className="text-gray-600 truncate max-w-[200px]">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    {/* Left Column - Product Images */}
                    <div className="flex flex-col gap-5">
                        {/* Main Product Image */}
                        <div className="w-full max-w-[400px] aspect-square border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center mx-auto transition-all duration-300">
                            {imagesCount > 0 && !imageError ? (
                                (() => {
                                    const imageUrl = getImageUrl(selectedImageIndex);
                                    return imageUrl ? (
                                        <img
                                            key={`main-${selectedImageIndex}-${imageUrl}`}
                                            src={imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-contain p-4"
                                            onLoad={() => setImageError(false)}
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-base italic">
                                            No image URL available
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="text-gray-400 text-base italic">
                                    {imageError ? 'Failed to load image' : 'No images found'}
                                </div>
                            )}
                        </div>

                        {/* Product Thumbnails */}
                        {imagesCount > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                {imagesArray.map((_, index) => {
                                    const thumbUrl = getImageUrl(index);
                                    return (
                                        <div
                                            key={index}
                                            className={`shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
                                                selectedImageIndex === index
                                                    ? 'border-green-600 shadow-sm'
                                                    : 'border-transparent hover:border-green-500'
                                            }`}
                                            onClick={() => {
                                                setSelectedImageIndex(index);
                                                setImageError(false);
                                            }}
                                        >
                                            {thumbUrl ? (
                                                <img
                                                    src={thumbUrl}
                                                    alt={`${product.name} ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px]">
                                                    No img
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Product Details Dropdown */}
                        <div className="product-details-dropdown">
                            <button
                                className="w-full flex flex-col items-start gap-2 bg-transparent border-none cursor-pointer py-3 text-left group relative"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Product Details
                                    </span>
                                    <div className="text-gray-500 transition-transform duration-200">
                                        {showDetails ? (
                                            <ChevronUp size={20} />
                                        ) : (
                                            <ChevronDown size={20} />
                                        )}
                                    </div>
                                </div>
                                {product.details && !showDetails && (
                                    <span className="text-sm text-gray-500 line-clamp-1 pr-8">
                                        Flavour:{' '}
                                        {product.details.split('\n')[0] || 'View more details'}
                                    </span>
                                )}
                            </button>
                            {showDetails && product.details && (
                                <div className="mt-3 p-4 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
                                    <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap m-0 font-sans">
                                        {product.details}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 m-0 leading-tight sm:text-xl">
                                {product.name}
                            </h1>
                            <p className="text-base text-gray-500 m-0 sm:text-sm">
                                {product.quantity}
                            </p>
                        </div>

                        {/* Pricing */}
                        <div className="flex flex-col gap-1 bg-green-50/30 p-4 rounded-xl border border-green-100/50">
                            <div className="flex items-center gap-3">
                                <span className="text-[26px] font-bold text-gray-900 sm:text-2xl xs:text-[22px]">
                                    ₹{product.price}
                                </span>
                                <span className="text-lg text-gray-400 line-through sm:text-base xs:text-sm">
                                    ₹{mrp}
                                </span>
                                <span className="bg-green-600 text-white px-2 py-0.5 rounded font-semibold text-xs animate-pulse">
                                    {discount}% OFF
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 m-0">(Inclusive of all taxes)</p>
                        </div>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const filled =
                                        hoverRating >= star ||
                                        (!hoverRating && product.rating >= star);

                                    return (
                                        <Star
                                            key={star}
                                            size={20}
                                            fill={filled ? '#22c55e' : 'none'}
                                            stroke="#22c55e"
                                            className={`transition-colors duration-150 ${
                                                submittingRating
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : 'cursor-pointer'
                                            }`}
                                            onMouseEnter={() =>
                                                !submittingRating && setHoverRating(star)
                                            }
                                            onMouseLeave={() =>
                                                !submittingRating && setHoverRating(0)
                                            }
                                            onClick={() => !submittingRating && submitRating(star)}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-base font-bold text-gray-900 ml-1">
                                {product.rating?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-sm text-gray-500">
                                ({product.rating_count || 0} reviews)
                            </span>
                        </div>

                        {/* Add to Cart Button */}
                        {(() => {
                            const cartItem = cartItems.find((c) => c.id === product.id);
                            const qty = cartItem?.cartQuantity || 0;
                            if (qty > 0) {
                                return (
                                    <div className="flex items-center gap-4 bg-green-50 w-fit p-1 rounded-xl border border-green-200">
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-white text-green-600 border border-green-100 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                decreaseQuantity(product.id);
                                            }}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="text-xl font-bold text-green-600 min-w-[30px] text-center">
                                            {qty}
                                        </span>
                                        <button
                                            className="w-10 h-10 flex items-center justify-center bg-white text-green-600 border border-green-100 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                increaseQuantity(product.id);
                                            }}
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                );
                            }
                            return (
                                <button
                                    className="bg-green-600 text-white border-none py-4 px-6 rounded-xl font-bold text-lg cursor-pointer transition-all duration-200 w-full max-w-[320px] shadow-lg shadow-green-100 hover:bg-green-700 hover:shadow-green-200 active:scale-[0.98] sm:max-w-full sm:text-base sm:py-3.5"
                                    onClick={handleAddToCart}
                                >
                                    Add to cart
                                </button>
                            );
                        })()}

                        {/* Why shop section */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 sm:text-base">
                                Why shop from Venkateshwara?
                            </h3>
                            <div className="flex flex-col gap-6">
                                {[
                                    {
                                        icon: <Clock size={24} />,
                                        title: 'Superfast Delivery',
                                        desc: 'Get your order delivered to your doorstep at the earliest from dark stores near you.',
                                    },
                                    {
                                        icon: <ShoppingCart size={24} />,
                                        title: 'Best Prices & Offers',
                                        desc: 'Best price destination with offers directly from the farmers & manufacturers.',
                                    },
                                    {
                                        icon: <Package size={24} />,
                                        title: 'Pure & Authentic Products',
                                        desc: 'Enjoy fresh, naturally grown products without harmful chemicals or preservatives.',
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-start group">
                                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 transition-colors group-hover:bg-green-100">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <h4 className="text-[15px] font-bold text-gray-900 m-0 group-hover:text-green-700 transition-colors sm:text-sm">
                                                {item.title}
                                            </h4>
                                            <p className="text-[13px] text-gray-600 leading-relaxed m-0 sm:text-[12px]">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Products Section - At Bottom */}
                <div className="mt-16 pt-10 pb-5 border-t-2 border-gray-100 w-full font-sans">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 sm:text-xl">
                        Similar products
                    </h3>
                    {(() => {
                        const category = product.category;
                        const hasCategory =
                            category && typeof category === 'string' && category.trim() !== '';

                        if (!hasCategory) {
                            return (
                                <div className="text-center py-10 text-gray-400 italic">
                                    Category not available.
                                </div>
                            );
                        }

                        if (loadingSimilar) {
                            return (
                                <div className="text-center py-10 text-gray-400 italic">
                                    Loading similar products...
                                </div>
                            );
                        }

                        if (similarProducts.length > 0) {
                            return (
                                <div className="relative group">
                                    {/* Left Arrow */}
                                    {showLeftArrow && (
                                        <button
                                            className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-md cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white hover:border-green-600 sm:hidden -left-5"
                                            onClick={() => scrollSimilarProducts('left')}
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                    )}

                                    {/* Product Cards - Horizontal Scroll */}
                                    <div
                                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                                        ref={similarProductsScrollRef}
                                        style={{
                                            scrollBehavior: 'smooth',
                                        }}
                                    >
                                        {similarProducts.map((item) => {
                                            const cartItem = cartItems.find(
                                                (c) => c.id === item.id
                                            );
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

                                    {/* Right Arrow */}
                                    {showRightArrow && (
                                        <button
                                            className="absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-500 shadow-md cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white hover:border-green-600 sm:hidden -right-5"
                                            onClick={() => scrollSimilarProducts('right')}
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <div className="text-center py-10 text-gray-400 italic">
                                No similar products found for category: {category}
                            </div>
                        );
                    })()}
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
