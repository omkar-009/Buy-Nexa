import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Minus, Plus, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../../utils/api';

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
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-4">
                                {products.map((item) => {
                                    const cartItem = cartItems.find((c) => c.id === item.id);
                                    const quantity = cartItem?.cartQuantity || 0;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => navigate(`/product/${item.id}`)}
                                            className="group bg-white rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-green-50/50 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
                                        >
                                            <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-4 p-4 flex items-center justify-center relative group-hover:bg-white transition-colors">
                                                <img
                                                    src={item.imageUrls?.[0] || '/placeholder.png'}
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

                                            <div className="flex flex-col gap-1.5 flex-1">
                                                <h3 className="text-sm font-bold text-gray-800 m-0 line-clamp-2 leading-snug h-10 group-hover:text-green-600 transition-colors">
                                                    {item.name}
                                                </h3>

                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest m-0">
                                                        {item.quantity}
                                                    </p>
                                                    <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
                                                        <Star
                                                            size={10}
                                                            fill="#22c55e"
                                                            stroke="#22c55e"
                                                        />
                                                        <span className="text-[10px] font-black text-green-700">
                                                            {(Number(item.rating) || 0).toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                                                    <div className="flex flex-col">
                                                        <span className="text-base font-black text-gray-900 tracking-tight">
                                                            ₹{item.price}
                                                        </span>
                                                        {item.mrp > item.price && (
                                                            <span className="text-[10px] text-gray-400 line-through">
                                                                ₹{item.mrp}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {quantity > 0 ? (
                                                        <div className="flex items-center bg-green-600 rounded-xl overflow-hidden shadow-lg shadow-green-100">
                                                            <button
                                                                className="w-8 h-8 flex items-center justify-center text-white border-none bg-transparent hover:bg-black/10 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    decreaseQuantity(item.id);
                                                                }}
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="text-xs font-black text-white w-6 text-center">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                className="w-8 h-8 flex items-center justify-center text-white border-none bg-transparent hover:bg-black/10 transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    increaseQuantity(item.id);
                                                                }}
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center transition-all hover:bg-green-600 hover:text-white active:scale-90"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addToCart(item);
                                                            }}
                                                        >
                                                            <span className="text-xs font-black">
                                                                ADD
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
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
