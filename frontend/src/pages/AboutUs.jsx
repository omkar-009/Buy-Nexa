import React from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function AboutUs() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative py-32 bg-black text-white overflow-hidden">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center grayscale"
                />
                
                <div className="max-w-[1440px] mx-auto px-6 relative z-10 text-center">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                    >
                        <motion.span variants={fadeIn} className="inline-block text-[10px] font-black uppercase tracking-[0.5em] mb-6 opacity-60">
                            Our Philosophy
                        </motion.span>
                        <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
                            Redefining <br />
                            <span className="text-gray-500 italic">Commerce.</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
                            Buy Nexa is a visionary platform dedicated to bringing premium, fresh, and essential goods directly to the modern consumer.
                        </motion.p>
                    </motion.div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-32 max-w-[1440px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gray-50 p-16 rounded-[40px] aspect-square flex flex-col justify-center gap-10 relative overflow-hidden"
                    >
                        <div className="w-20 h-1 bg-black rounded-full"></div>
                        <h2 className="text-5xl font-black text-black leading-tight uppercase tracking-tighter">
                            Radical <br />
                            Transparency.
                        </h2>
                        <p className="text-gray-600 text-lg font-medium leading-relaxed">
                            We believe in the power of direct connections. By eliminating unnecessary layers, we bring you closer to the source of your daily essentials, ensuring unparalleled quality and ethics in every transaction.
                        </p>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-black/5 rounded-full" />
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="space-y-16"
                    >
                        {[
                            { id: '01', title: 'DIRECT ACCESS', desc: 'Direct sourcing ensures the freshest products reach our community without delays.' },
                            { id: '02', title: 'PREMIUM QUALITY', desc: 'Rigorous selection process for every item, from the farm to your table.' },
                            { id: '03', title: 'MODERN ETHOS', desc: 'Blending traditional farming values with a seamless digital lifestyle.' }
                        ].map((item) => (
                            <motion.div key={item.id} variants={fadeIn} className="flex flex-col gap-4 border-l-2 border-gray-100 pl-8 hover:border-black transition-colors">
                                <span className="text-sm font-black text-gray-300">{item.id}</span>
                                <h3 className="text-xl font-black text-black uppercase tracking-widest">{item.title}</h3>
                                <p className="text-gray-500 font-medium italic">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-black py-32">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
                        {[
                            { label: 'Natural', value: '100%' },
                            { label: 'Products', value: '500+' },
                            { label: 'Fast Delivery', value: '15m' },
                            { label: 'Community', value: '10k+' }
                        ].map((stat) => (
                            <motion.div 
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="flex flex-col gap-4"
                            >
                                <span className="text-5xl md:text-7xl font-black text-white tracking-tighter">{stat.value}</span>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{stat.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
