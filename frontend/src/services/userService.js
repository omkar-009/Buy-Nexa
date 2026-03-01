import api from '../../utils/api';

const userService = {
    fetchProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },
    updateProfile: async (formData) => {
        const response = await api.put('/user/profile', formData);
        return response.data;
    },
    register: async (formData) => {
        const response = await api.post('/user/register', formData);
        return response.data;
    },
};

export default userService;
