import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';
import ProductDescription from './components/ProductDescription';
import ProductsPage from './components/ProductsPage';
import OrderTracking from './pages/TrackOrder';
import Layout from './layout/layout';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="light"
                />
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route element={<Layout />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/orders" element={<OrderHistory />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/search" element={<SearchResults />} />
                        <Route path="/product/:id" element={<ProductDescription />} />
                        <Route path="/category/:category" element={<ProductsPage />} />
                        <Route path="/order/:orderId" element={<OrderTracking />} />
                    </Route>
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
