import api from '../../utils/api';

const productService = {
    fetchHomeProducts: async () => {
        const response = await api.get('/products/home-page-products');
        return response.data;
    },
    fetchProductsByCategory: async (category) => {
        const response = await api.get(`/products/category/${category}`);
        return response.data;
    },
    searchProducts: async (query) => {
        const response = await api.get(`/products/search?q=${query}`);
        return response.data;
    },
    fetchProductDetails: async (productId) => {
        const response = await api.get(`/products/${productId}`);
        return response.data;
    },
};

export default productService;
