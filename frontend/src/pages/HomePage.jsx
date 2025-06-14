import React from 'react';
import { Plus, LoaderCircle } from 'lucide-react';
import { useDocumentStore } from '../stores/documentStore';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { documents, isCreatingDocument } = useDocumentStore();
  const { getUserDocuments, addUserDocument, gettingDocuments } =
    useAuthStore();
  const [formData, setFormData] = React.useState({
    title: '',
  });

  React.useEffect(() => {
    getUserDocuments();
  }, []);

  const handleLoad = (id) => {
    navigate(`/document/${id}`);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newDocId = await addUserDocument(formData);
      setFormData({ title: '' }); // Reset form

      // Navigate to the new document after creation
      if (newDocId) {
        navigate(`/document/${newDocId}`);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  if (gettingDocuments && documents.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-base-300 min-h-[calc(100vh-64px)] py-6">
      <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 justify-items-center">
        {documents.map((doc) => (
          <div
            className="card bg-base-100 w-full max-w-96 shadow-sm"
            key={doc._id.toString()}
          >
            <div className="card-body">
              <h2 className="card-title text-center justify-center">
                {doc.title}
              </h2>
              <div className="card-actions justify-center">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLoad(doc._id);
                  }}
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new document */}
        <div className="card bg-base-100 w-full max-w-96 shadow-sm">
          <div className="card-body flex justify-center items-center">
            <div className="flex card-actions justify-center items-center">
              <button
                className="btn btn-primary btn-circle"
                onClick={() =>
                  document.getElementById('my_modal_2').showModal()
                }
              >
                <Plus className="text-success" />
              </button>
              <dialog id="my_modal_2" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg text-center">
                    Create a New Document
                  </h3>
                  <form
                    onSubmit={handleAdd}
                    className="flex flex-col items-center p-7"
                  >
                    <input
                      type="text"
                      placeholder="Title"
                      className="p-2 border rounded w-full"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className={
                        'btn btn-neutral hover:text-accent p-2 rounded mt-7 flex' +
                        (isCreatingDocument
                          ? ' opacity-40 cursor-not-allowed'
                          : '')
                      }
                    >
                      {isCreatingDocument ? 'Creating document...' : 'Create'}
                    </button>
                  </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
