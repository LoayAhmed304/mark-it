import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useDocumentStore = create((set, get) => ({
  isLoading: false,
  currentDocument: null,
  documents: [],
  isCreatingDocument: false,
  currentCollabs: [],

  setDocuments: (documents) => set({ documents }),

  loadDocument: async (id) => {
    set({ isLoading: true });
    try {
      // First try to find document in local state
      const foundDoc = get().documents.find((doc) => doc.id == id);

      if (foundDoc) {
        set({ currentDocument: foundDoc });
      } else {
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
      throw error;
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

  updateCollaboration: async (id) => {
    try {
      const response = await axiosInstance.patch(`/documents/${id}`, {
        collaborative: !get().currentDocument.collaborative,
      });
      toast.success(
        `Document collaboration ${
          response.data.data.updatedDocument.collaborative
            ? 'enabled'
            : 'disabled'
        }!`,
      );
      set({
        currentDocument: {
          ...get().currentDocument,
          collaborative: response.data.data.updatedDocument.collaborative,
        },
      });
      return get().currentDocument.collaborative;
    } catch (err) {
      console.error('Error updating collaboration:', err);
      toast.error(
        err.response?.data?.message || 'Failed to update collaboration.',
      );
    }
  },

  saveDocument: async (id, content) => {
    try {
      const response = await axiosInstance.post(`/documents/save/${id}`, {
        content,
      });
      set({
        currentDocument: {
          ...get().currentDocument,
          content: response.data.data.document.content,
        },
      });
      toast.success('Document saved successfully!');
    } catch (err) {
      console.error('Error saving document:', err);
      toast.error(err.response?.data?.message || 'Failed to save document.');
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await axiosInstance.delete(`/documents/${id}`);
      set({
        documents: get().documents.filter((doc) => doc._id !== id),
        currentDocument: null,
      });
      toast.success('Document deleted successfully!');
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error(err.response?.data?.message || 'Failed to delete document.');
    }
  },

  updateCollabs: async (users) => {
    set({
      currentCollabs: users,
    });
  },

  resetDocument: () => {
    set({
      currentDocument: null,
      currentCollabs: [],
    });
  },
}));
