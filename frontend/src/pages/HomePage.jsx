import React from 'react';
import { Plus, LoaderCircle } from 'lucide-react';
import { useDocumentStore } from '../stores/documentStore';

const docs = [
  {
    title: 'My First Document',
    content: 'This is the content of my first document.',
  },
  {
    title: 'My Second Document',
    content: 'This is the content of my second document.',
  },
  {
    title: 'My Third Document',
    content: 'This is the content of my third document.',
  },
  {
    title: 'My Fourth Document',
    content: 'This is the content of my fourth document.',
  },
];

const HomePage = () => {
  const [documents, setDocuments] = React.useState(docs);
  const { isLoading, currentDocument, load, add, isCreatingDocument } =
    useDocumentStore();

  const [formData, setFormData] = React.useState({
    title: '',
  });

  const handleLoad = (e) => {
    console.log('Loading document');
    e.preventDefault();
    load();
    // TODO: Implement the logic to load the document
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await add(formData, setFormData, setDocuments);
    } catch (error) {
      console.error('Failed to create document:', error);
    }
  };

  if (isLoading && currentDocument === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {documents.map((doc, index) => (
        <div
          className="flex card bg-base-100 w-96 shadow-sm items-center"
          key={index}
        >
          <div className="card-body">
            <h2 className="card-title text-center">{doc.title}</h2>
            <div className="card-actions justify-center">
              <button className="btn btn-primary" onClick={handleLoad}>
                Load
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new document */}
      <div className="card bg-base-100 w-96 shadow-sm items-center">
        <div className="card-body flex justify-center">
          <div className="flex card-actions justify-center items-center">
            <button
              className="btn btn-primary btn-circle"
              onClick={() => document.getElementById('my_modal_2').showModal()}
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
  );
};

export default HomePage;
