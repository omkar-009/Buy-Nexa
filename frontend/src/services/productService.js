import api from '../../utils/api';

const productService = {
    fetchHomeProducts: async () => {
        const response = await api.get('/products/home-page-products');
        return response.data;
    },
    fetchProducts: async () => {
        const response = await api.get('/products/processed'); 
        return response.data;
    },
    fetchProductsByCategory: async (category) => {
        const response = await api.get(`/category/${category}`);
        return response.data;
    },
    searchProducts: async (query) => {
        const response = await api.get(`/products/search?query=${query}`);
        return response.data;
    },
    fetchProductById: async (productId) => {
        const response = await api.get(`/products/getproduct/${productId}`);
        return response.data;
    },
    fetchSimilarProducts: async (category, excludeId) => {
        const response = await api.get('/products/similar', {
            params: { category, excludeId }
        });
        return response.data;
    },
    submitRating: async (productId, rating) => {
        const response = await api.post(`/products/rate/${productId}`, { rating });
        return response.data;
    }
};

export default productService;
