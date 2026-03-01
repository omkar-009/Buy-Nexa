import React from 'react';
import { Star, Minus, Plus } from 'lucide-react';

const ProductCard = ({
    product,
    onAddToCart,
    onIncrease,
    onDecrease,
    cartQuantity = 0,
    onClick,
}) => {
    return (
        <div
            className="min-w-[240px] max-w-[240px] bg-white rounded-xl shadow-md overflow-hidden flex flex-col items-center p-3 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
            onClick={onClick}
        >
            {/* Image Section */}
            <div className="w-full h-[150px] flex items-center justify-center bg-gray-50 rounded-lg mb-3 overflow-hidden group-hover:bg-white transition-colors relative">
                <img
                    src={
                        product.imageUrls && product.imageUrls[0]
                            ? product.imageUrls[0]
                            : '/placeholder.png'
                    }
                    alt={product.name}
                    className="w-full h-full object-contain mb-1 transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        e.target.src = '/placeholder.png';
                    }}
                />
                {product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">
                        {product.discount}% OFF
                    </div>
                )}
            </div>

            {/* Product Name */}
            <p className="text-sm font-semibold text-gray-800 m-0 line-clamp-2 min-h-[40px] leading-tight w-full">
                {product.name}
            </p>

            {/* Row 1: Qty and Rating */}
            <div className="flex justify-between items-center w-full mt-2">
                <p className="text-[12px] text-gray-500 m-0 font-medium">{product.quantity}</p>
                <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded-md">
                    <Star size={12} fill="#22c55e" stroke="#22c55e" />
                    <span className="text-[11px] font-black text-green-700">
                        {(Number(product.rating) || 0).toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Row 2: Price and Add Button */}
            <div className="flex justify-between items-center w-full mt-3 pt-2 border-t border-gray-50">
                <div className="flex flex-col">
                    <span className="text-base font-black text-gray-900">₹{product.price}</span>
                    {product.mrp > product.price && (
                        <span className="text-[10px] text-gray-400 line-through">
                            ₹{product.mrp}
                        </span>
                    )}
                </div>

                {cartQuantity > 0 ? (
                    <div className="flex items-center bg-green-600 rounded-lg overflow-hidden shadow-sm">
                        <button
                            className="w-8 h-8 flex items-center justify-center text-white border-none bg-transparent hover:bg-black/10 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDecrease(product.id);
                            }}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-black text-white w-6 text-center">
                            {cartQuantity}
                        </span>
                        <button
                            className="w-8 h-8 flex items-center justify-center text-white border-none bg-transparent hover:bg-black/10 transition-colors cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onIncrease(product.id);
                            }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        className="bg-white text-green-600 border border-green-600 py-1.5 px-4 rounded-lg font-bold text-sm cursor-pointer transition-all duration-200 hover:bg-green-600 hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }}
                    >
                        ADD
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
