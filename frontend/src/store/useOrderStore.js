import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import orderService from '../services/orderService';

const useOrderStore = create(
    persist(
        (set, get) => ({
            orders: [],
            currentOrder: null,
            loading: false,
            error: null,

            currentOrder: null,

            getOrders: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await orderService.fetchOrders();
                    if (data.success) {
                        set({ orders: data.data || [], loading: false });
                    } else {
                        set({ error: data.message || 'Failed to fetch orders', loading: false });
                    }
                } catch (err) {
                    set({
                        error:
                            err.response?.data?.message || err.message || 'Failed to fetch orders',
                        loading: false,
                    });
                }
            },

            getOrderDetails: async (orderId) => {
                set({ loading: true, error: null });
                try {
                    const data = await orderService.fetchOrderDetails(orderId);
                    if (data.success) {
                        set({ currentOrder: data.data, loading: false });
                    } else {
                        set({
                            error: data.message || 'Failed to fetch order details',
                            loading: false,
                        });
                    }
                } catch (err) {
                    set({
                        error:
                            err.response?.data?.message ||
                            err.message ||
                            'Failed to fetch order details',
                        loading: false,
                    });
                }
            },

            placeOrder: async (orderData) => {
                set({ loading: true, error: null });
                try {
                    const data = await orderService.placeOrder(orderData);
                    if (data.success) {
                        set({ loading: false });
                        await get().getOrders(); // Refresh orders after placement
                        return { success: true, data: data.data };
                    } else {
                        set({ error: data.message || 'Failed to place order', loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    const errMsg =
                        err.response?.data?.message || err.message || 'Failed to place order';
                    set({ error: errMsg, loading: false });
                    return { success: false, message: errMsg };
                }
            },

            cancelOrder: async (orderId) => {
                set({ loading: true, error: null });
                try {
                    const data = await orderService.cancelOrder(orderId);
                    if (data.success) {
                        set({ loading: false });
                        await get().getOrders(); // Refresh orders
                        return { success: true };
                    } else {
                        set({ error: data.message || 'Failed to cancel order', loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    const errMsg =
                        err.response?.data?.message || err.message || 'Failed to cancel order';
                    set({ error: errMsg, loading: false });
                    return { success: false, message: errMsg };
                }
            },
        }),
        {
            name: 'order-storage',
        }
    )
);

export default useOrderStore;
