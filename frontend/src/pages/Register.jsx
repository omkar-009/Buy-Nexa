import React, { useState } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        contact_no: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Handle Input Change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Form Submit with API Call
    const handleSubmit = async (e) => {
        e.preventDefault();

        let tempErrors = {};

        // Validation
        if (!formData.username.trim()) tempErrors.username = 'Name is required';
        if (!formData.email.trim()) tempErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email))
            tempErrors.email = 'Enter a valid email address';

        if (!formData.password.trim()) tempErrors.password = 'Password is required';

        if (!formData.contact_no.trim()) {
            tempErrors.contact_no = 'Contact number is required';
        } else if (!/^\d+$/.test(formData.contact_no)) {
            tempErrors.contact_no = 'Contact number must be numeric';
        } else if (formData.contact_no.length < 10) {
            tempErrors.contact_no = 'Contact number must be at least 10 digits';
        }

        setErrors(tempErrors);

        // Stop if any validation errors
        if (Object.keys(tempErrors).length > 0) return;

        try {
            setLoading(true);

            // Call backend API
            const response = await api.post('/user/register', formData);

            if (response.data.success) {
                toast.success('Registration successful!');

                // Reset form on success
                setFormData({
                    username: '',
                    email: '',
                    contact_no: '',
                    password: '',
                });

                setErrors({});
            } else {
                toast.error(response.data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error(error?.response?.data?.message || 'Error registering user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-6 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-10 border border-gray-100 sm:p-8">
                <div className="flex flex-col gap-2 mb-10 text-center">
                    <h2 className="text-3xl font-black text-gray-900 m-0">Create Account</h2>
                    <p className="text-gray-500 font-medium">
                        Join Vcoop for the best grocery experience
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Username */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="username"
                            className={`w-full bg-gray-50 border ${errors.username ? 'border-red-300' : 'border-gray-100'} rounded-xl py-3.5 px-5 outline-none text-gray-900 font-medium transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 placeholder:text-gray-300`}
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Your full name"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs font-bold pl-1 m-0">
                                {errors.username}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            className={`w-full bg-gray-50 border ${errors.email ? 'border-red-300' : 'border-gray-100'} rounded-xl py-3.5 px-5 outline-none text-gray-900 font-medium transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 placeholder:text-gray-300`}
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@mail.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs font-bold pl-1 m-0">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Contact No */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            name="contact_no"
                            value={formData.contact_no}
                            onChange={handleChange}
                            placeholder="10-digit mobile number"
                            className={`w-full bg-gray-50 border ${errors.contact_no ? 'border-red-300' : 'border-gray-100'} rounded-xl py-3.5 px-5 outline-none text-gray-900 font-medium transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 placeholder:text-gray-300`}
                        />
                        {errors.contact_no && (
                            <p className="text-red-500 text-xs font-bold pl-1 m-0">
                                {errors.contact_no}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">
                            Create Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className={`w-full bg-gray-50 border ${errors.password ? 'border-red-300' : 'border-gray-100'} rounded-xl py-3.5 px-5 outline-none text-gray-900 font-medium transition-all focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 placeholder:text-gray-300`}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs font-bold pl-1 m-0">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-green-600 text-white border-none py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] cursor-pointer transition-all shadow-lg shadow-green-100 mt-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group
              ${!loading ? 'hover:bg-green-700 hover:shadow-green-200' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creating Account...
                            </span>
                        ) : (
                            'Join Vcoop'
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-50 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <a
                            href="/home"
                            onClick={(e) => {
                                e.preventDefault();
                                // We'd typically open the login modal here, but for now navigate home
                                window.location.href = '/home?showLogin=true';
                            }}
                            className="text-green-600 font-black hover:text-green-700 transition-colors ml-1"
                        >
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
