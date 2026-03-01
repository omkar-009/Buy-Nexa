import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function Login({ showLogin, setShowLogin, onLoginSuccess }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(formData);
            if (result.success) {
                toast.success(result.message || 'Login successful!');
                setShowLogin(false);

                // Check if we need to redirect back to cart
                const redirectTo = localStorage.getItem('vcoop_redirect_to');
                if (redirectTo === 'cart') {
                    localStorage.removeItem('vcoop_redirect_to');
                    navigate('/cart');
                } else {
                    navigate('/home');
                }

                // Call onLoginSuccess callback if provided
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                setError(result.message || 'Invalid credentials');
                toast.error(result.message || 'Invalid credentials');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!showLogin) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-100">
            <div className="bg-white rounded-2xl shadow-xl w-[320px] p-6 relative">
                <button
                    className="absolute right-3.5 top-2.5 border-none bg-none text-lg cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowLogin(false)}
                >
                    ✕
                </button>
                <h2 className="text-center text-[22px] font-semibold text-[#1aa849] mb-[30px]">
                    Login to Vcoop
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                    <label className="text-sm font-medium text-gray-700">
                        Email or Contact Number
                    </label>
                    <input
                        type="text"
                        name="identifier"
                        placeholder="Enter your email or contact number"
                        className="p-2 px-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#4caf50] transition-colors"
                        value={formData.identifier}
                        onChange={handleChange}
                        required
                    />

                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        className="p-2 px-2.5 border border-gray-300 rounded-lg outline-none focus:border-[#4caf50] transition-colors"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-[#16a34a] text-white border-none p-2.5 rounded-lg text-[15px] cursor-pointer mt-1 hover:bg-[#138a3b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {error && <p className="text-red-600 text-center text-sm mt-2">{error}</p>}

                <div className="text-center mt-2.5 text-sm text-gray-500">
                    Don’t have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-green-600 font-medium border-none bg-none cursor-pointer hover:underline p-0"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
