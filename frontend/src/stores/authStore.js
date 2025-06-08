import { create } from 'zustand';
import { useDocumentStore } from './documentStore';
import toast from 'react-hot-toast';

const docs = [
  {
    id: 'hffcv',
    title: 'My First Document',
    content: 'This is the content of my first document.',
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

export const useAuthStore = create((set, get) => ({
  authUser: true,
  isSigningUp: false,
  isLoggingIn: false,
  gettingDocuments: false,
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

  getUserDocuments: async () => {
    set({ gettingDocuments: true });
    try {
      // Implement logic to fetch user documents from the server
      toast.success('Documents fetched successfully!');
      const { setDocuments } = useDocumentStore.getState();
      setDocuments(docs);
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
}));
