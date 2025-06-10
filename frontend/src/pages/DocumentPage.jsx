import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentStore } from '../stores/documentStore';
import { LoaderCircle } from 'lucide-react';

const DocumentPage = () => {
  const { id } = useParams();
  const { loadDocument, currentDocument, isLoading } = useDocumentStore();
  const [error, setError] = useState(false);

  const handleSave = async (e) => {};
  const handleDelete = async (e) => {};
  const handleTerminate = async (e) => {};

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        await loadDocument(id);
      } catch (err) {
        setError(true);
        console.error('Error loading document:', err);
      }
    };

    fetchDocument();
  }, [id, loadDocument]);

  if (error) {
    console.error('Error loading document IN DOC PAGE:', error);
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-error-500">
          Error loading document. Please try again.
        </p>
      </div>
    );
  }
  if (isLoading && !currentDocument) {
    console.log('Loading document...');
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <p className="text-error-500">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-300 items-center w-full max-w-full p-5 pt-5 min-h-[calc(100vh-64px)]">
      {/* Settings Navbar Buttons */}
      <div className="flex justify-between w-full px-4 md:px-10 mb-4">
        <button className="btn btn-warning" onClick={handleTerminate}>
          Terminate Session
        </button>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-soft btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <h1 className="text-primary text-3xl font-semibold mb-4">
        {currentDocument.title}
      </h1>
      <div className="flex flex-col md:flex-row gap-6 w-full px-4 md:px-10 flex-grow">
        <div className="flex-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Document</legend>
            <textarea
              className="textarea w-full h-[60vh]"
              placeholder="Type your document content here..."
              defaultValue={currentDocument.content}
            />
          </fieldset>
        </div>

        <div className="flex-1">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Preview</legend>
            <div
              className="p-4 bg-accent border rounded h-[60vh] overflow-auto prose"
              id="markdown-preview"
              dangerouslySetInnerHTML={{ __html: currentDocument.content }}
            />
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
