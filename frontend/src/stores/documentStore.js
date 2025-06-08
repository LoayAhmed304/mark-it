import { create } from 'zustand';
import toast from 'react-hot-toast';

// API service functions (to be implemented with real backend)
const documentApi = {
  fetchDocument: async (id) => {
    // Will call API endpoint to get document by ID
    console.log(`API call: Fetching document ${id}`);
    // Return mock data for now
    return null; // This will make the code fall back to local state
  },

  createDocument: async (document) => {
    // Will call API endpoint to create document
    console.log(`API call: Creating document "${document.title}"`);
    // Return mock response with ID
    return { id: `doc_${Date.now()}`, ...document };
  },

  // Add more API methods as needed (update, delete, etc.)
};

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
        toast.success('Document loaded successfully!');
      } else {
        // Try to fetch from API
        const apiDoc = await documentApi.fetchDocument(id);

        if (apiDoc) {
          set({ currentDocument: apiDoc });
          toast.success('Document loaded from server!');
        } else {
          // For demo purposes only - remove in production
          set({
            currentDocument: {
              id,
              title: 'Sample Loaded Document',
              content: `This is a sample document content. # hello world
            ## Header 2
            ### Header 3`,
            },
          });
          toast.success('Demo document loaded!');
        }
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
      // Prepare new document
      const newDocument = {
        title: formData.title,
        content: '',
      };

      // In the future, this would call the API
      const savedDoc = await documentApi.createDocument(newDocument);

      // Add to local state
      set({
        documents: [...get().documents, savedDoc],
      });

      // Close the modal
      document.getElementById('my_modal_2').close();
      toast.success('New document created successfully!');

      return savedDoc.id; // Return ID for navigation
    } catch (err) {
      console.error('Error creating document:', err);
      toast.error(err.response?.data?.message || 'Failed to create document.');
    } finally {
      set({ isCreatingDocument: false });
    }
  },
}));
