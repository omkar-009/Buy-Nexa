import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../../utils/api';
import ProductCard from './ProductCard';

export default function ProductsPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCart();

    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError('');

                const res = await api.get(`/category/${category}`);

                if (res.data.success) {
                    const list = res.data.data.map((p) => ({
                        ...p,
                        imageUrls: p.imageUrls || [],
                    }));

                    setProducts(list);
                } else {
                    setError(res.data.message || 'Failed to fetch products');
                }
            } catch (err) {
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        if (category) fetchProducts();
    }, [category]);

    return (
        <>
            <div className="min-h-screen bg-gray-50 pt-24 pb-20 sm:pt-20 font-sans">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 mb-8 bg-white w-fit px-4 py-2 rounded-full border border-gray-100 shadow-sm ml-1">
                        <Link
                            to="/home"
                            className="text-[11px] font-black text-gray-400 uppercase tracking-widest no-underline hover:text-green-600 transition-colors"
                        >
                            Home
                        </Link>
                        <span className="text-gray-300 text-xs">/</span>
                        <span className="text-[11px] font-black text-green-600 uppercase tracking-widest">
                            {category}
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 mb-10 ml-1">
                        <h1 className="text-4xl font-black text-gray-900 m-0 sm:text-3xl tracking-tight">
                            {category.toUpperCase()}
                        </h1>
                        <div className="h-1.5 w-20 bg-green-500 rounded-full"></div>
                    </div>

                    {/* Product Grid */}
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <div className="w-12 h-12 border-4 border-green-100 border-t-green-600 rounded-full animate-spin"></div>
                                <p className="text-gray-500 font-medium tracking-wide">
                                    Gathering fresh products...
                                </p>
                            </div>
                        ) : error ? (
                            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-6 max-w-md mx-auto">
                                <p className="text-red-500 font-bold">{error}</p>
                                <button
                                    className="bg-green-600 text-white border-none py-3.5 px-8 rounded-xl font-bold text-sm cursor-pointer transition-all hover:bg-green-700 active:scale-95"
                                    onClick={() => window.location.reload()}
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="flex flex-wrap gap-6 sm:gap-4 justify-start">
                                {products.map((item) => {
                                    const cartItem = cartItems.find((c) => c.id === item.id);
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
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Package size={64} className="text-gray-300 mb-4" />
                                <p className="text-lg font-black text-gray-400 uppercase tracking-widest">
                                    No products found
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
