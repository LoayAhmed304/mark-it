import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useDocumentStore = create((set, get) => ({
  isLoading: false,
  currentDocument: null,
  documents: [],
  isCreatingDocument: false,

  load: async () => {
    set({ isLoading: true });
    try {
      // TODO: Implement the logic to load documents from the server
      toast.success('Documents loaded successfully!');
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents.');
    } finally {
      set({ isLoading: false });
    }
  },
  add: async (formData, setFormData, setDocuments) => {
    if (formData.title.trim() === '') {
      return toast.error('Please enter a title for the document.');
    }
    set({ isCreatingDocument: true });
    try {
      // TODO: Implement the logic to add a new document
      toast.success('New document created successfully!');
      // Close the modal after successful document creation
      document.getElementById('my_modal_2').close();
      // Reset the form data
      setFormData({ title: '' });
      setDocuments((prevDocs) => [
        ...prevDocs,
        { title: formData.title, content: '' }, // Add the new document to the list
      ]);
    } catch (err) {
      console.error('Error creating document:', err);
      toast.error(err.response?.data?.message || 'Failed to create document.');
    } finally {
      set({ isCreatingDocument: false });
    }
  },
}));
