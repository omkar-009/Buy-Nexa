import api from '../../utils/api';

const orderService = {
    fetchOrders: async () => {
        const response = await api.get('/orders/history');
        return response.data;
    },
    fetchOrderDetails: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },
    placeOrder: async (orderData) => {
        const response = await api.post('/orders/place', orderData);
        return response.data;
    },
    cancelOrder: async (orderId) => {
        const response = await api.put(`/orders/${orderId}/cancel`);
        return response.data;
    },
};

export default orderService;
