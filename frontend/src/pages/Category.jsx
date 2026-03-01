import React from 'react';
import '../App.css';

import paan from '../assets/paan.avif';
import dairy from '../assets/dairy.avif';
import fruits from '../assets/fruits.avif';
import drinks from '../assets/cold_drinks.avif';
import snacks from '../assets/snacks.avif';
import breakfast from '../assets/breakfast.avif';
import sweet from '../assets/sweet.avif';
import bakery from '../assets/bakery.avif';
import tea from '../assets/tea.avif';
import home from '../assets/home.avif';
import atta from '../assets/atta.avif';
import masala from '../assets/masala.avif';
import sauces from '../assets/sauce.avif';
import meat from '../assets/meat.avif';
import organic from '../assets/organic.avif';
import baby from '../assets/baby.avif';
import pharma from '../assets/pharma.avif';
import cleaning from '../assets/cleaning.avif';
import personal from '../assets/personal.avif';
import pet from '../assets/pet.avif';

export default function Category() {
    const categories = [
        { image: paan },
        { image: dairy },
        { image: fruits },
        { image: drinks },
        { image: snacks },
        { image: breakfast },
        { image: sweet },
        { image: bakery },
        { image: tea },
        { image: atta },
        { image: masala },
        { image: sauces },
        { image: meat },
        { image: organic },
        { image: baby },
        { image: pharma },
        { image: cleaning },
        { image: home },
        { image: personal },
        { image: pet },
    ];

    return (
        <div className="max-w-[1280px] mx-auto py-2 px-6 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-2">
                {categories.map((item, index) => (
                    <div
                        key={index}
                        className="p-2.5 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer flex items-center justify-center bg-white border border-transparent hover:border-gray-50"
                    >
                        <img
                            src={item.image}
                            alt="product"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
