import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, Globe, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function BecomeSeller() {
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
        <div className="min-h-screen bg-white text-black pt-20">
            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden border-b border-gray-100">
                <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="max-w-4xl"
                    >
                        <motion.span variants={fadeIn} className="inline-block text-[10px] font-black uppercase tracking-[0.5em] mb-8 text-gray-400">
                            Partner with Buy Nexa
                        </motion.span>
                        <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">
                            Empowering <br />
                            <span className="text-gray-400 italic">Your Brand.</span>
                        </motion.h1>
                        <motion.p variants={fadeIn} className="text-xl md:text-2xl text-gray-500 font-medium mb-12 max-w-2xl mx-auto">
                            Join our curated marketplace and reach thousands of conscious consumers looking for premium quality essentials.
                        </motion.p>
                        <motion.div variants={fadeIn} className="flex justify-center gap-6">
                            <button className="bg-black text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center gap-3 active:scale-95">
                                Start Selling <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Why Sell Section */}
            <section className="py-32 max-w-[1440px] mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Why Buy Nexa?</h2>
                    <div className="w-20 h-1 bg-black mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {[
                        { icon: <Zap size={32} />, title: 'FAST LAUNCH', desc: 'Get your storefront ready and operational in less than 24 hours.' },
                        { icon: <TrendingUp size={32} />, title: 'GROWTH ENGINE', desc: 'Powerful analytics to help you scale your business intelligently.' },
                        { icon: <Globe size={32} />, title: 'WIDER REACH', desc: 'Connect with a growing community of premium lifestyle shoppers.' },
                        { icon: <Shield size={32} />, title: 'SECURE PAY', desc: 'Automated, secure, and transparent payment cycles.' }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="p-10 bg-gray-50 rounded-[32px] hover:bg-black hover:text-white transition-all duration-500 group"
                        >
                            <div className="mb-6 text-black group-hover:text-white transition-colors">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-widest mb-4">{feature.title}</h3>
                            <p className="text-gray-500 group-hover:text-gray-400 font-medium leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Simple Steps */}
            <section className="py-32 bg-black text-white">
                <div className="max-w-[1440px] mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-24">
                        <div className="lg:w-1/2">
                            <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                Three simple <br />
                                steps to <span className="text-gray-600">success.</span>
                            </h2>
                            <p className="text-gray-400 text-lg max-w-md">
                                We've streamlined the onboarding process to ensure you focus on what matters most: your products.
                            </p>
                        </div>
                        <div className="lg:w-1/2 space-y-12">
                            {[
                                { step: '01', title: 'REGISTER', desc: 'Sign up and submit your business documentation for verification.' },
                                { step: '02', title: 'LIST PRODUCTS', desc: 'Upload your catalog with high-quality imagery and detailed descriptions.' },
                                { step: '03', title: 'START EARNING', desc: 'Receive orders, fulfill them, and watch your brand grow.' }
                            ].map((item) => (
                                <div key={item.step} className="flex gap-8 group">
                                    <span className="text-5xl font-black text-white/10 group-hover:text-white/40 transition-colors duration-500">{item.step}</span>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-widest mb-2">{item.title}</h3>
                                        <p className="text-gray-500 font-medium max-w-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-40 text-center">
                <div className="max-w-[1440px] mx-auto px-6">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-12">
                        Ready to <br />
                        <span className="italic">Partner?</span>
                    </h2>
                    <button className="bg-black text-white px-12 py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] hover:scale-110 active:scale-95 transition-all">
                        Apply Now
                    </button>
                </div>
            </section>
        </div>
    );
}
