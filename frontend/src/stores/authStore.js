import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  authUser: true,
  isSigningUp: false,
  isLoggingIn: false,
  login: async (formData) => {
    set({ isLoggingIn: true });
    // Rest of the login logic code here
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    try {
      // Implement login here (API)
      toast.success('Welcome back!');
    } catch (err) {
      console.error('Error during login:', err);
      toast.error(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
      return;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });

    try {
      toast.success('Account created successfully!');
    } catch (err) {
      console.error('Error during signup:', err);
      toast.error(
        err.response?.data?.message || 'Signup failed. Please try again.',
      );
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
