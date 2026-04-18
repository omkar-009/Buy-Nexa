import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
    const text = "BUY NEXA";
    const letters = Array.from(text);

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    const content = (
        <div className="flex flex-col items-center justify-center gap-6">
            <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="flex overflow-hidden"
            >
                {letters.map((letter, index) => (
                    <motion.span
                        variants={child}
                        key={index}
                        className={`text-4xl md:text-6xl font-black uppercase tracking-tighter ${
                            letter === " " ? "w-4" : ""
                        }`}
                        style={{ display: "inline-block" }}
                    >
                        {letter}
                    </motion.span>
                ))}
            </motion.div>
            
            <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
                className="h-[2px] bg-black max-w-[120px]"
            />
            
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400"
            >
                Loading Excellence
            </motion.p>
        </div>
    );

    if (fullScreen) {
        return (
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
            >
                {content}
            </motion.div>
        );
    }

    return (
        <div className="flex items-center justify-center py-20 w-full">
            {content}
        </div>
    );
};

export default Loader;
