import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Youtube, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-black text-white pt-24 pb-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black tracking-tighter uppercase italic">Buy Nexa.</h2>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs">
                            Redefining the modern marketplace with premium essentials delivered to your doorstep. Quality, speed, and elegance in every order.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                                <motion.a 
                                    key={idx}
                                    whileHover={{ y: -3 }}
                                    href="#" 
                                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Navigation</h4>
                        <ul className="space-y-4 p-0">
                            {['Home', 'Products', 'About Us', 'Become a Seller', 'Cart'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm font-medium uppercase tracking-widest text-white/60 hover:text-white flex items-center gap-2 group transition-all">
                                        {item} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Support</h4>
                        <ul className="space-y-4 p-0">
                            {['Shipping Policy', 'Return & Exchanges', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm cursor-pointer font-medium uppercase tracking-widest text-white/60 hover:text-white transition-all">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Stay Updated</h4>
                        <p className="text-gray-500 text-xs font-medium mb-6">Join our newsletter for exclusive drops and updates.</p>
                        <div className="relative">
                            <input 
                                type="email" 
                                placeholder="YOUR EMAIL" 
                                className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 text-xs font-medium tracking-widest focus:outline-none focus:border-white transition-all"
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} BUY NEXA. ALL RIGHTS RESERVED.
                    </p>
                    <button 
                        onClick={scrollToTop}
                        className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white flex items-center gap-2 transition-all"
                    >
                        Back to top <ArrowUpRight size={14} />
                    </button>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">VISA</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">UPI</span>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">NET BANKING</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
