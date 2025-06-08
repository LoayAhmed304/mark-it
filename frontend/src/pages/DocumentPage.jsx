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
      <div className="flex justify-center items-center h-screen">
        <p className="text-error-500">
          Error loading document. Please try again.
        </p>
      </div>
    );
  }
  if (isLoading && !currentDocument) {
    console.log('Loading document...');
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-error-500">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-base-300 justify-center items-center max-w mx-auto p-10 h-screen">
      {/* Settings Navbar Buttons */}
      <div className="flex justify-between w-full pr-10 pl-10">
        <button className="btn btn-warning" onClick={handleTerminate}>
          Terminate Session
        </button>
        <div className="flex justify-end space-x-10 w-full pr-10">
          <button className="btn btn-success" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-soft btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <h1 className="text-primary text-3xl font-semibold font-sans font-family-sans">
        {currentDocument.title}
      </h1>
      <div className="flex flex-row max-w space-x-10 justify-around w-full p-10 h-full">
        <div className="flex justify-center items-start h-full w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Document</legend>
            <textarea
              className="textarea w-full h-80 md:h-120"
              placeholder="Type your document content here..."
            >
              {currentDocument.content}
            </textarea>
          </fieldset>
        </div>

        <div className="flex justify-center items-start w-full">
          <fieldset className="fieldset w-full">
            <legend className="fieldset-legend">Preview</legend>
            <div
              className="p-4 bg-accent border rounded h-80 overflow-auto prose md:h-120"
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
