import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import Categories from './Category';
import ProcessedProducts from './ProcessedProducts';
import DryFruits from './DryFruits';
import FruitsProducts from './Fruits';

import HeroImage1 from '../assets/slider-main.jpg';
import Pharmacy from '../assets/dryfruits.png';
import Babycare from '../assets/fruits.png';
import Petcare from '../assets/processed.png';

export default function Home() {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white min-h-screen"
        >
            {/* Hero Section */}
            <section className="relative h-[85vh] w-full overflow-hidden bg-black flex items-center">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.6 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <img
                        src={HeroImage1}
                        alt="Hero"
                        className="w-full h-full object-cover grayscale brightness-75"
                    />
                </motion.div>

                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="relative z-10 max-w-[1440px] mx-auto px-6 w-full">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-2xl"
                    >
                        <span className="inline-block text-white/60 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                            New Collection 2026
                        </span>
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                            ESSENTIALS FOR <br />
                            <span className="text-white/40 italic">MODERN LIFE.</span>
                        </h1>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => navigate('/category/dryfruits')}
                                className="group bg-white text-black px-8 py-4 rounded-full font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all active:scale-95"
                            >
                                Shop Collection
                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                            <button className="group border border-white/20 text-white px-8 py-4 rounded-full font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95">
                                Explore Styles
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest">Scroll</span>
                    <div className="w-px h-12 bg-white/20 relative">
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute left-0 w-full h-1/3 bg-white"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Featured Categories Grid */}
            <section className="max-w-[1440px] mx-auto px-6 py-24">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">
                            Selected Picks
                        </h2>
                        <p className="text-gray-400 font-medium">
                            Curated products for your lifestyle.
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:gap-3 transition-all">
                        View All <ChevronRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            src: Pharmacy,
                            alt: 'Dry Fruits',
                            path: '/category/dryfruits',
                            label: 'PREMIUM DRY FRUITS',
                        },
                        {
                            src: Petcare,
                            alt: 'Processed Products',
                            path: '/category/ProcessedProducts',
                            label: 'PROCESSED GOODS',
                        },
                        {
                            src: Babycare,
                            alt: 'Fruits',
                            path: '/category/fruits',
                            label: 'FRESH HARVEST',
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={item.alt}
                            whileHover={{ y: -10 }}
                            className="relative aspect-[4/5] overflow-hidden group cursor-pointer"
                            onClick={() => navigate(item.path)}
                        >
                            <img
                                src={item.src}
                                alt={item.alt}
                                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all" />
                            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 block opacity-60">
                                    Category 0{idx + 1}
                                </span>
                                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">
                                    {item.label}
                                </h3>
                                <div className="h-0.5 w-0 bg-white group-hover:w-full transition-all duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Content Sections with Scroll Reveal */}
            <div className="space-y-32 pb-32">
                <RevealOnScroll>
                    <Categories />
                </RevealOnScroll>

                <RevealOnScroll>
                    <ProcessedProducts />
                </RevealOnScroll>

                <RevealOnScroll>
                    <DryFruits />
                </RevealOnScroll>

                <RevealOnScroll>
                    <FruitsProducts />
                </RevealOnScroll>
            </div>
        </motion.div>
    );
}

function RevealOnScroll({ children }) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            {children}
        </motion.section>
    );
}
