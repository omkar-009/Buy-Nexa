import { create } from 'zustand';
import productService from '../services/productService';

const useProductStore = create((set, get) => ({
    products: [],
    searchResults: [],
    currentProduct: null,
    loading: false,
    error: null,
    searchLoading: false,
    similarProducts: [],
    loadingSimilar: false,

    fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
            const data = await productService.fetchProducts();
            if (data.success) {
                set({ products: data.data || [], loading: false });
            } else {
                set({ error: data.message || 'Failed to fetch products', loading: false });
            }
        } catch (err) {
            set({
                error: err.response?.data?.message || err.message || 'Failed to fetch products',
                loading: false,
            });
        }
    },

    fetchProductById: async (id) => {
        set({ loading: true, error: null, currentProduct: null });
        try {
            const data = await productService.fetchProductById(id);
            if (data.success) {
                const productData = data.data;

                // Process images/imageUrls logic from ProductDescription.jsx
                let imageFilenames = [];
                if (productData.images) {
                    if (typeof productData.images === 'string') {
                        try {
                            imageFilenames = JSON.parse(productData.images);
                        } catch (e) {
                            imageFilenames = [];
                        }
                    } else if (Array.isArray(productData.images)) {
                        imageFilenames = productData.images;
                    }
                }

                let imageUrls = [];
                if (productData.imageUrls) {
                    if (Array.isArray(productData.imageUrls)) {
                        imageUrls = productData.imageUrls;
                    } else if (typeof productData.imageUrls === 'string') {
                        try {
                            imageUrls = JSON.parse(productData.imageUrls);
                        } catch (e) {
                            imageUrls = [];
                        }
                    }
                }

                if (imageUrls.length === 0 && imageFilenames.length > 0) {
                    imageUrls = imageFilenames.map(
                        (filename) => `http://localhost:5000/uploads/home_page_products/${filename}`
                    );
                }

                // Inferred category logic
                let inferredCategory = productData.category;
                if (!inferredCategory) {
                    const productName = (productData.name || '').toLowerCase();
                    if (
                        productName.includes('mango') ||
                        productName.includes('grapes') ||
                        productName.includes('custard apple')
                    ) {
                        inferredCategory = 'fruits';
                    } else if (
                        productName.includes('honey') ||
                        productName.includes('turmeric') ||
                        productName.includes('clarrified butter')
                    ) {
                        inferredCategory = 'ProcessedProducts';
                    } else if (
                        productName.includes('almonds') ||
                        productName.includes('cashew') ||
                        productName.includes('peanuts') ||
                        productName.includes('pista')
                    ) {
                        inferredCategory = 'dryfruits';
                    } else {
                        inferredCategory = 'dryfruits';
                    }
                }

                const updatedProductData = {
                    ...productData,
                    category: inferredCategory,
                    images: imageFilenames,
                    imageUrls: imageUrls,
                };

                set({ currentProduct: updatedProductData, loading: false });
                return { success: true, product: updatedProductData };
            } else {
                set({ error: data.message || 'Product not found', loading: false });
                return { success: false, message: data.message };
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || err.message || 'Failed to fetch product';
            set({ error: errMsg, loading: false });
            return { success: false, message: errMsg };
        }
    },

    fetchSimilarProducts: async (category, excludeId) => {
        set({ loadingSimilar: true });
        try {
            const data = await productService.fetchSimilarProducts(category, excludeId);
            if (data.success) {
                set({ similarProducts: data.data || [], loadingSimilar: false });
            } else {
                set({ similarProducts: [], loadingSimilar: false });
            }
        } catch (err) {
            set({ similarProducts: [], loadingSimilar: false });
        }
    },

    submitRating: async (productId, rating) => {
        try {
            const data = await productService.submitRating(productId, rating);
            if (data.success) {
                const { currentProduct } = get();
                if (currentProduct && currentProduct.id === productId) {
                    set({
                        currentProduct: {
                            ...currentProduct,
                            rating: data.avg_rating,
                            rating_count: data.rating_count,
                        },
                    });
                }
                return {
                    success: true,
                    avg_rating: data.avg_rating,
                    rating_count: data.rating_count,
                };
            }
            return { success: false, message: data.message };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Rating failed' };
        }
    },

    searchProducts: async (query) => {
        if (!query.trim()) {
            set({ searchResults: [], searchLoading: false });
            return;
        }
        set({ searchLoading: true });
        try {
            const data = await productService.searchProducts(query);
            if (data.success) {
                set({ searchResults: data.data || [], searchLoading: false });
            } else {
                set({ searchResults: [], searchLoading: false });
            }
        } catch (err) {
            set({ searchResults: [], searchLoading: false });
        }
    },

    clearSearch: () => {
        set({ searchResults: [], searchLoading: false });
    },
}));

export default useProductStore;
