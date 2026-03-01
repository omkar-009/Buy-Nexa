import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 bg-green-50/50 overflow-hidden sm:pt-24 sm:pb-12">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-4 relative z-10">
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-green-100 shadow-sm w-fit">
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">
                                Our Story
                            </span>
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 leading-[1.1] m-0 sm:text-4xl tracking-tight">
                            Bringing the Farm <br />
                            <span className="text-green-600 underline decoration-green-200 underline-offset-8">
                                To Your Doorstep
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 font-medium leading-relaxed m-0 sm:text-base">
                            Vcoop is more than just a grocery store. We are a community-driven
                            initiative connecting conscious consumers directly with pure, fresh, and
                            local produce.
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-green-100/30 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-200/20 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* Mission Section */}
            <div className="py-24 max-w-[1280px] mx-auto px-6 lg:px-4 sm:py-16">
                <div className="grid grid-cols-2 gap-20 items-center sm:grid-cols-1 sm:gap-12">
                    <div className="bg-gray-50 rounded-[40px] p-12 aspect-square flex flex-col justify-center gap-8 relative overflow-hidden sm:p-8">
                        <div className="w-16 h-1 bg-green-500 rounded-full"></div>
                        <h2 className="text-4xl font-black text-gray-900 m-0 leading-tight">
                            Our Mission is <br />
                            Transparency.
                        </h2>
                        <p className="text-gray-600 font-medium leading-loose m-0">
                            We believe everyone deserves access to high-quality groceries without
                            the mystery. By working directly with farmers and trusted processors, we
                            ensure every product in our catalog meets the highest standards of
                            purity and freshness.
                        </p>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/50 rounded-full blur-2xl"></div>
                    </div>

                    <div className="flex flex-col gap-12 sm:gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm mb-2">
                                <span className="text-2xl font-black">01</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 m-0">
                                Direct Sourcing
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed m-0 italic">
                                Eliminating middlemen to provide better value to both farmers and
                                customers.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-8">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm mb-2">
                                <span className="text-2xl font-black">02</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 m-0">Quality First</h3>
                            <p className="text-gray-500 font-medium leading-relaxed m-0 italic">
                                Rigorous quality checks for every item, from dry fruits to fresh
                                produce.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-8">
                            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm mb-2">
                                <span className="text-2xl font-black">03</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 m-0">
                                Modern Community
                            </h3>
                            <p className="text-gray-500 font-medium leading-relaxed m-0 italic">
                                Merging traditional farming ethics with a seamless digital shopping
                                experience.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Banner */}
            <div className="bg-gray-900 py-24 sm:py-16">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-4 flex flex-col items-center text-center gap-12">
                    <h2 className="text-4xl font-black text-white m-0 sm:text-3xl">
                        Purity in Every Purchase
                    </h2>
                    <div className="grid grid-cols-4 gap-8 w-full sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-black text-green-400">100%</span>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Natural
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-black text-green-400">500+</span>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Products
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-black text-green-400">15m</span>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Delivery
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-3xl font-black text-green-400">5k+</span>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                Customers
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
