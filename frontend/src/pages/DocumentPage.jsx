import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../stores/documentStore';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // to snaitize the output

const DocumentPage = () => {
  const { id } = useParams();
  const {
    loadDocument,
    currentDocument,
    isLoading,
    updateCollaboration,
    saveDocument,
    deleteDocument,
  } = useDocumentStore();
  const [error, setError] = useState(false);
  const { authUser, isCheckingAuth } = useAuthStore();

  const [markdown, setMarkdown] = useState('');

  const navigate = useNavigate();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!authUser || !currentDocument) {
      return;
    }
    try {
      await saveDocument(currentDocument._id, markdown);
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (
      !authUser ||
      authUser._id.toString() !== currentDocument.authorId.toString()
    ) {
      return;
    }
    try {
      await deleteDocument(currentDocument._id);
      navigate('/');
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleTerminate = async (e) => {
    e.preventDefault();
    if (
      !authUser ||
      authUser._id.toString() !== currentDocument.authorId.toString()
    ) {
      return;
    }
    try {
      await updateCollaboration(currentDocument._id);
    } catch (err) {
      console.error('Error terminating session:', err);
    }
  };

  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });
  }, []);

  useEffect(() => {
    if (currentDocument?.content) {
      setMarkdown(currentDocument.content);
    }
  }, [currentDocument]);
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
  if (isCheckingAuth && !authUser) {
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
        <button
          className={`btn btn-${
            currentDocument.collaborative
              ? 'warning btn-soft'
              : 'primary btn-outline'
          }`}
          onClick={handleTerminate}
          disabled={
            !authUser ||
            authUser._id.toString() !== currentDocument.authorId.toString()
          }
        >
          {currentDocument.collaborative
            ? 'Terminate Session'
            : 'Start Session'}
        </button>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <button
            className="btn btn-success"
            disabled={
              !authUser ||
              authUser._id.toString() !== currentDocument.authorId.toString()
            }
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="btn btn-soft btn-error"
            disabled={
              !authUser ||
              authUser._id.toString() !== currentDocument.authorId.toString()
            }
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
      <h1 className="text-primary text-3xl font-semibold mb-4">
        {currentDocument.title}
      </h1>
      <div className="flex flex-col md:flex-row gap-6 w-full px-4 md:px-10 flex-grow">
        <div className="flex-1">
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <h3 className="card-title">Document</h3>
              <textarea
                className="textarea textarea-bordered w-full h-[100vh]"
                placeholder="Type your document content here..."
                defaultValue={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="card bg-base-100 shadow-sm w-full">
            <div className="card-body">
              <h3 className="card-title">Preview</h3>
              <div className="bg-base-200 rounded-box h-[100vh] overflow-auto p-4">
                <div
                  className="prose prose-sm max-w-none min-h-[calc(100vh-4rem)] pb-[50vh]"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked(markdown)),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
