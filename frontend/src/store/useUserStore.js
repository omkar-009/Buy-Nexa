import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import userService from '../services/userService';

const useUserStore = create(
    persist(
        (set, get) => ({
            userProfile: null,
            loading: false,
            error: null,

            getProfile: async () => {
                set({ loading: true, error: null });
                try {
                    const data = await userService.fetchProfile();
                    if (data.success) {
                        set({ userProfile: data.data, loading: false });
                    } else {
                        set({ error: data.message || 'Failed to fetch profile', loading: false });
                    }
                } catch (err) {
                    set({
                        error:
                            err.response?.data?.message || err.message || 'Failed to fetch profile',
                        loading: false,
                    });
                    // On error, the persisted userProfile will still be available
                }
            },

            updateProfile: async (formData) => {
                set({ loading: true, error: null });
                try {
                    const data = await userService.updateProfile(formData);
                    if (data.success) {
                        set({ userProfile: data.data, loading: false });
                        return { success: true };
                    } else {
                        set({ error: data.message || 'Failed to update profile', loading: false });
                        return { success: false, message: data.message };
                    }
                } catch (err) {
                    const errMsg =
                        err.response?.data?.message || err.message || 'Failed to update profile';
                    set({ error: errMsg, loading: false });
                    return { success: false, message: errMsg };
                }
            },

            clearUser: () => set({ userProfile: null, error: null }),
        }),
        {
            name: 'user-storage', // name of the item in the storage (must be unique)
        }
    )
);

export default useUserStore;
