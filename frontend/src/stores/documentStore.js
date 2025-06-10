import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useDocumentStore = create((set, get) => ({
  isLoading: false,
  currentDocument: null,
  documents: [],
  isCreatingDocument: false,

  setDocuments: (documents) => set({ documents }),

  loadDocument: async (id) => {
    set({ isLoading: true });
    try {
      // First try to find document in local state
      const foundDoc = get().documents.find((doc) => doc.id == id);

      if (foundDoc) {
        set({ currentDocument: foundDoc });
      } else {
        // If not found locally, try to fetch from server
        console.log(
          `Document with ID ${id} not found in local state, trying server...`,
        );
        // For demo, use a sample document
        const response = await axiosInstance.get(`/documents/${id}`);
        if (response.status !== 200) {
          throw new Error('Document not found or insufficient permissions');
        }
        set({
          currentDocument: response.data.data.document,
        });
      }
    } catch (error) {
      console.error('Error loading document:', error);
      toast.error('Failed to load document.');
      set({ currentDocument: null });
      throw error; // Re-throw to be caught by the component
    } finally {
      set({ isLoading: false });
    }
  },

  add: async (formData) => {
    if (formData.title.trim() === '') {
      return toast.error('Please enter a title for the document.');
    }
    set({ isCreatingDocument: true });

    try {
      const response = await axiosInstance.post('/documents', formData);
      console.log('Document created:', response.data);
      set({
        documents: [...get().documents, response.data.data.document],
      });

      // Close the modal
      document.getElementById('my_modal_2').close();
      toast.success('New document created successfully!');

      return response.data.data.document._id; // Return ID for navigation
    } catch (err) {
      console.error('Error creating document:', err);
      toast.error(err.response?.data?.message || 'Failed to create document.');
    } finally {
      set({ isCreatingDocument: false });
    }
  },
}));
