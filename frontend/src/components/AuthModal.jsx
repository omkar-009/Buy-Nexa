import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';
import api from '../../utils/api';

export default function AuthModal({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [view, setView] = useState('login'); // 'login' or 'register'
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        username: '',
        email: '',
        contact_no: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await login({
                identifier: formData.identifier || formData.email,
                password: formData.password
            });
            if (result.success) {
                toast.success('Welcome back!');
                onClose();
                navigate('/home');
            } else {
                toast.error(result.message || 'Invalid credentials');
            }
        } catch (err) {
            toast.error('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/user/register', {
                username: formData.username,
                email: formData.email,
                contact_no: formData.contact_no,
                password: formData.password,
            });

            if (response.data.success) {
                toast.success('Account created! Logging you in...');
                // Auto login after registration
                const loginResult = await login({
                    identifier: formData.email,
                    password: formData.password
                });
                if (loginResult.success) {
                    onClose();
                    navigate('/home');
                }
            } else {
                toast.error(response.data.message || 'Registration failed');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating account');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-white w-full max-w-4xl min-h-[500px] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                >
                    {/* Visual Side (LHS) */}
                    <div className="hidden md:flex md:w-1/2 bg-black text-white p-12 flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold tracking-tighter mb-4">
                                {view === 'login' ? 'WELCOME BACK.' : 'JOIN THE CLUB.'}
                            </h2>
                            <p className="text-gray-400 font-medium">
                                {view === 'login' 
                                    ? 'Access your account and explore the latest drops.' 
                                    : 'Create an account for a seamless shopping experience.'}
                            </p>
                        </div>
                        
                        {/* Decorative 3D-like circles */}
                        <div className="absolute -bottom-20 -left-20 w-64 h-64 border border-white/10 rounded-full" />
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 border border-white/20 rounded-full" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-sm font-bold tracking-widest text-gray-500">
                                <span>Buy Nexa</span>
                                <span className="w-8 h-[1px] bg-gray-800" />
                                <span>2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Side (RHS) */}
                    <div className="flex-1 p-8 md:p-12 bg-white relative">
                        <button 
                            onClick={onClose}
                            className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">
                                    {view === 'login' ? 'Login' : 'Register'}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {view === 'login' ? 'Sign in to continue' : 'Enter your details below'}
                                </p>
                            </div>

                            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
                                {view === 'register' && (
                                    <>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder="Full Name"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-all"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="contact_no"
                                                placeholder="Contact Number"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-all"
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={view === 'login' ? "text" : "email"}
                                        name={view === 'login' ? "identifier" : "email"}
                                        placeholder={view === 'login' ? "Email or Phone" : "Email Address"}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-all"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:border-black transition-all"
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-900 transition-all hover:gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {view === 'login' ? 'Login' : 'Create Account'}
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 text-center text-sm">
                                <span className="text-gray-500">
                                    {view === 'login' ? "Don't have an account?" : "Already have an account?"}
                                </span>
                                <button
                                    onClick={() => setView(view === 'login' ? 'register' : 'login')}
                                    className="ml-2 font-black border-b-2 border-transparent hover:border-black transition-all"
                                >
                                    {view === 'login' ? 'REGISTER' : 'LOGIN'}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
