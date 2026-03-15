import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Youtube } from 'lucide-react';
import '../App.css';

export default function Footer() {
    const openMail = () => {
        window.location.href = 'mailto:info@venkateshwarapoweragro.com';
    };
    return (
        <footer className="bg-green-900 border-t border-green-800 mt-10 px-6 py-10 text-white">
            <div className="max-w-[1280px] mx-auto flex gap-10 lg:gap-[60px] mb-10 flex-col lg:flex-row">
                {/* Useful Links Section */}
                <div className="flex-1 min-w-[200px]">
                    <h4 className="text-lg font-bold text-white mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-green-500">
                        Useful Links
                    </h4>
                    <div className="flex flex-col gap-2">
                        {['Blog', 'Privacy', 'Terms', 'FAQs', 'Contact'].map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-gray-300 no-underline text-sm transition-colors duration-200 hover:text-green-400"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Categories Section */}
                <div className="flex-[2] min-w-[300px]">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-bold text-white m-0 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-green-500">
                            Categories
                        </h4>
                        <a
                            href="/categories"
                            className="text-green-400 no-underline text-sm font-medium hover:underline"
                        >
                            See All
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { name: 'Vegetables & Fruits', path: 'category/fruits' },
                            { name: 'Dry Fruits', path: 'category/dryfruits' },
                            { name: 'Processed Products', path: 'category/ProcessedProducts' },
                        ].map((cat) => (
                            <a
                                key={cat.name}
                                href={cat.path}
                                className="text-gray-300 no-underline text-sm transition-colors duration-200 hover:text-green-400"
                            >
                                {cat.name}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Brand & Mission */}
                <div className="flex-1 min-w-[200px]">
                    <h4 className="text-lg font-bold text-white mb-6 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-green-500">
                        Our Mission
                    </h4>
                    <p className="text-gray-300 text-sm m-0 leading-relaxed">
                        Revolutionizing grocery delivery with speed and quality. Bringing the
                        freshest produce directly to your doorstep.
                    </p>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="max-w-[1280px] mx-auto border-t border-green-800 pt-6">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-5">
                    {/* Copyright */}
                    <div className="text-gray-300 text-sm m-0">
                        © {new Date().getFullYear()} Copyright:{' '}
                        <span className="italic text-xs">BuyNexa Groceries</span>
                    </div>

                    {/* App Download & Social Media */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-3">
                            <span className="text-white text-sm font-medium">Download App</span>
                            <div className="flex gap-3 flex-col sm:flex-row">
                                <a
                                    href="https://apps.apple.com/in/app/blinkit-grocery-in-10-minutes/id960335206"
                                    className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded no-underline transition-opacity duration-200 hover:opacity-90 min-w-[140px]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        width="18"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="shrink-0"
                                    >
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.24-1.99 1.11-3.14-1.02.04-2.26.67-3.04 1.57-.7.8-1.32 2.02-1.14 3.13 1.13.09 2.34-.73 3.07-1.56z" />
                                    </svg>
                                    <div className="flex flex-col leading-[1.1] text-left">
                                        <span className="text-[9px] text-white/95 tracking-[0.3px]">
                                            Download on the
                                        </span>
                                        <span className="text-[13px] font-semibold tracking-[0.2px]">
                                            App Store
                                        </span>
                                    </div>
                                </a>
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.grofers.customerapp&hl=en_IN&gl=US&pli=1"
                                    className="flex items-center gap-2 bg-black text-white px-2.5 py-1.5 rounded no-underline transition-opacity duration-200 hover:opacity-90 min-w-[140px]"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg
                                        width="18"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="shrink-0"
                                    >
                                        <path d="M3.529 3.05a2.53 2.53 0 0 0-.529.569v16.762c0 .2.067.4.192.564L12.556 12 3.529 3.05zm10.518 10.435l3.203-1.848c1.332-.769 1.332-2.022 0-2.791l-3.203-1.848-1.127 1.127 1.127 1.127zM4.686 2.5l7.994 4.615L13.807 8.24 4.686 2.5zm9.121 13.26l-1.127-1.127-1.127 1.127 9.121 5.26c.441.254 1-.067 1-.577v-2.311l-7.994 4.615z" />
                                    </svg>
                                    <div className="flex flex-col leading-[1.1] text-left">
                                        <span className="text-[9px] text-white/95 tracking-[0.3px]">
                                            GET IT ON
                                        </span>
                                        <span className="text-[13px] font-semibold tracking-[0.2px]">
                                            Google Play
                                        </span>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex gap-4 w-full sm:w-auto sm:justify-start justify-center">
                            {[
                                {
                                    icon: Facebook,
                                    label: 'Facebook',
                                    href: 'https://www.facebook.com',
                                },
                                {
                                    icon: Twitter,
                                    label: 'X (Twitter)',
                                    href: 'https://x.com/as_hish09',
                                },
                                {
                                    icon: Instagram,
                                    label: 'Instagram',
                                    href: 'https://www.instagram.com/as_hish.x09?igsh=MXBoMDljeGl4d3Iwaw==',
                                },
                                {
                                    icon: Youtube,
                                    label: 'YouTube',
                                    href: 'https://www.youtube.com',
                                },
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white text-green-900 flex items-center justify-center no-underline transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-110 shadow-sm"
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                            <button
                                onClick={openMail}
                                className="w-10 h-10 rounded-full bg-white text-green-900 flex items-center justify-center no-underline transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-110 shadow-sm border-0 cursor-pointer"
                                aria-label="Email Us"
                            >
                                <Mail size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="pt-5 border-t border-green-800">
                    <p className="text-gray-400 text-xs mt-4 mb-0 leading-relaxed text-center">
                        "BuyNexa Groceries" One step order product delivery platform.
                    </p>
                </div>
            </div>
        </footer>
    );
}
