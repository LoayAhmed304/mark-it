import { create } from 'zustand';
import { useDocumentStore } from './documentStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { persist } from 'zustand/middleware';

const docs = [
  {
    id: 'hffcv',
    title: 'Document title',
    content: `This is the content of my first document.
    # Header 1
    ## Header 2`,
  },
  {
    id: 'hffcv2',
    title: 'My Second Document',
    content: 'This is the content of my second document.',
  },
  {
    id: 'hffcv3',
    title: 'My Third Document',
    content: 'This is the content of my third document.',
  },
  {
    id: 'hffcv4',
    title: 'My Fourth Document',
    content: 'This is the content of my fourth document.',
  },
];

export const useAuthStore = create(
  persist((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    gettingDocuments: false,
    isCheckingAuth: false,

    checkAuth: async () => {
      set({ isCheckingAuth: true });
      try {
        const response = await axiosInstance.get('/auth/check');
        if (response.data) {
          set({ authUser: response.data.data });
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        set({ authUser: null });
      } finally {
        set({ isCheckingAuth: false });
      }
    },

    login: async (formData) => {
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all fields');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return false;
      }
      set({ isLoggingIn: true });
      try {
        // Implement login here (API)
        const response = await axiosInstance.post('/auth/login', formData);
        if (response.data.status === 'success') {
          set({ authUser: response.data.data });
          toast.success('Welcome back!');
        }
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
        const user = await axiosInstance.post('/auth/signup', formData);
        if (user.data) {
          set({ authUser: user.data.data });
        }

        toast.success('Account created successfully!');

        return true;
      } catch (err) {
        console.error('Error during signup:', err);
        toast.error(
          err.response?.data?.message || 'Signup failed. Please try again.',
        );
        return false;
      } finally {
        set({ isSigningUp: false });
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post('/auth/logout');
        set({ authUser: null });
        toast.success('Logged out successfully!');
      } catch (err) {
        console.error('Error during logout:', err);
        toast.error(
          err.response?.data?.message || 'Logout failed. Please try again.',
        );
      }
    },

    getUserDocuments: async () => {
      set({ gettingDocuments: true });
      try {
        // Implement logic to fetch user documents from the server
        const { setDocuments } = useDocumentStore.getState();
        const response = await axiosInstance.get('/documents');
        setDocuments(response.data.data.documents || []);
      } catch (err) {
        console.error('Error fetching documents:', err);
        toast.error(
          err.response?.data?.message ||
            'Failed to fetch documents. Please try again.',
        );
      } finally {
        set({ gettingDocuments: false });
      }
    },

    addUserDocument: (formData) => {
      const { add } = useDocumentStore.getState();
      // Add document and get the new ID
      const newId = add(formData);

      // Sync with local docs array if needed
      if (newId) {
        docs.push({
          id: newId,
          title: formData.title,
          content: '',
        });
      }

      return newId; // Return the ID for navigation
    },
  })),
);
