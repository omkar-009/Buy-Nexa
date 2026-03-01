import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Categories from './Category';
import ProcessedProducts from './ProcessedProducts';
import DryFruits from './DryFruits';
import FruitsProducts from './Fruits';

import HeroImage1 from '../assets/slider-main.jpg';
import HeroImage2 from '../assets/slider-2.jpeg';
import HeroImage3 from '../assets/slider-3.jpg';
import Pharmacy from '../assets/dryfruits.png';
import Babycare from '../assets/fruits.png';
import Petcare from '../assets/processed.png';

const images = [HeroImage1, HeroImage2, HeroImage3];

export default function Home() {
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);
    const trackRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => prev + 1);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // When reaching cloned slide
        if (index === images.length) {
            setTimeout(() => {
                trackRef.current.style.transition = 'none';
                setIndex(0);
            }, 800);
        } else {
            trackRef.current.style.transition = 'transform 0.8s ease-in-out';
        }
    }, [index]);

    return (
        <>
            {/* Slider */}
            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] overflow-hidden group">
                <div
                    ref={trackRef}
                    className="flex h-full transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {[...images, images[0]].map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            className="flex-none w-full h-full object-cover"
                            alt="Hero"
                        />
                    ))}
                </div>

                {/* Navigation Dots (Optional addition for wow factor) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${index % images.length === i ? 'bg-green-600 w-6' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Category Banners */}
            <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-8">
                {[
                    { src: Pharmacy, alt: 'Dry Fruits', path: '/category/dryfruits' },
                    {
                        src: Petcare,
                        alt: 'Processed Products',
                        path: '/category/ProcessedProducts',
                    },
                    { src: Babycare, alt: 'Fruits', path: '/category/fruits' },
                ].map((item) => (
                    <div
                        key={item.alt}
                        className="relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer group flex-1 w-full"
                        onClick={() => navigate(item.path)}
                    >
                        <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {/* Products */}
            <Categories />

            {/* Dairy Products Section */}
            <ProcessedProducts />

            {/* Tobacco Products Section */}
            <DryFruits />

            {/* Snacks Products Section */}
            <FruitsProducts />
        </>
    );
}
