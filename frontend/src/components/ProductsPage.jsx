import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../store/useCartStore';
import api from '../../utils/api';
import ProductCard from './ProductCard';

export default function ProductsPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const { addToCart, cartItems, increaseQuantity, decreaseQuantity } = useCartStore();

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
                    setProducts(res.data.data.map((p) => ({ ...p, imageUrls: p.imageUrls || [] })));
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
        window.scrollTo(0, 0);
    }, [category]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 font-sans">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <Link to="/home" className="hover:text-black transition-colors">
                                Home
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-black">{category}</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            {category}
                        </h1>
                        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
                            {products.length} Products Found
                        </p>
                    </div>

                    <button className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-95 w-fit">
                        <Filter size={16} /> Filter & Sort
                    </button>
                </div>

                {/* Product Grid */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 gap-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full"
                            />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                Curating Excellence...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center gap-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tight">
                                    {error}
                                </h2>
                                <p className="text-gray-400">
                                    Something went wrong while fetching the collection.
                                </p>
                            </div>
                            <button
                                className="bg-black text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                                onClick={() => window.location.reload()}
                            >
                                Re-Authenticate
                            </button>
                        </div>
                    ) : products.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16"
                        >
                            {products.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    onAddToCart={addToCart}
                                    onIncrease={increaseQuantity}
                                    onDecrease={decreaseQuantity}
                                    cartQuantity={
                                        cartItems.find((c) => c.id === item.id)?.cartQuantity || 0
                                    }
                                    onClick={() => navigate(`/product/${item.id}`)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 opacity-20">
                            <Package size={80} strokeWidth={1} />
                            <p className="text-sm font-black uppercase tracking-[0.5em] mt-8">
                                Collection Empty
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
