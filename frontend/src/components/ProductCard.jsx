import React from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({
    product,
    onAddToCart,
    onIncrease,
    onDecrease,
    cartQuantity = 0,
    onClick,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="flex flex-col bg-white overflow-hidden group cursor-pointer border border-transparent hover:border-black/5 transition-all duration-300 rounded-2xl"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-2xl p-4">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={product.imageUrls?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply transition-all duration-500"
                    onError={(e) => {
                        e.target.src = '/placeholder.png';
                    }}
                />
                
                {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        -{product.discount}%
                    </div>
                )}

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-4 px-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                    {cartQuantity === 0 && (
                        <button
                            className="w-full bg-black text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-900 flex items-center justify-center gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product);
                            }}
                        >
                            <ShoppingBag size={14} /> Add to Bag
                        </button>
                    )}
                </div>
            </div>

            {/* Product Info */}
            <div className="py-5 px-1">
                <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className="text-sm font-black text-black uppercase tracking-tight line-clamp-1 flex-1">
                        {product.name}
                    </h3>
                    <span className="text-sm font-black text-black shrink-0">₹{product.price}</span>
                </div>
                
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    {product.quantity}
                </p>

                {cartQuantity > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-black text-white p-1 rounded-xl"
                    >
                        <button
                            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDecrease(product.id);
                            }}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-black w-8 text-center">
                            {cartQuantity}
                        </span>
                        <button
                            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onIncrease(product.id);
                            }}
                        >
                            <Plus size={14} />
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
