import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';
import ProductDescription from './components/ProductDescription';
import ProductsPage from './components/ProductsPage';
import OrderTracking from './pages/TrackOrder';
import AboutUs from './pages/AboutUs';
import BecomeSeller from './pages/BecomeSeller';
import Layout from './layout/layout';
import Loader from './components/Loader';
import { useAuth } from './context/AuthContext';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

function App() {
    const { loading } = useAuth();

    return (
        <>
            <AnimatePresence>
                {loading && <Loader key="global-loader" fullScreen />}
            </AnimatePresence>
            <Router>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="dark"
                />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Navigate to="/home" replace />} />
                        <Route element={<Layout />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/orders" element={<OrderHistory />} />
                            <Route path="/account" element={<Account />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/become-seller" element={<BecomeSeller />} />
                            <Route path="/product/:id" element={<ProductDescription />} />
                            <Route path="/category/:category" element={<ProductsPage />} />
                            <Route path="/order/:orderId" element={<OrderTracking />} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </Router>
        </>
    );
}

export default App;
