import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentStore } from '../stores/documentStore';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // to snaitize the output
import { socket } from '../sockets/socket';
import { toast } from 'react-hot-toast';

const DocumentPage = () => {
  const { id } = useParams();

  const {
    loadDocument,
    currentDocument,
    isLoading,
    updateCollaboration,
    saveDocument,
    deleteDocument,
    updateCollabs,
    currentCollabs,
    resetDocument,
  } = useDocumentStore();
  const [error, setError] = useState(false);
  const { authUser, isCheckingAuth } = useAuthStore();
  const [localUpdate, setLocalUpdate] = useState(false);
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
      await saveDocument(currentDocument._id, markdown);
      const res = await updateCollaboration(currentDocument._id);

      if (!res) {
        socket.emit('terminate-session', { docId: currentDocument._id });
      }
    } catch (err) {
      console.error('Error terminating session:', err);
    }
  };

  const handleContentChange = (e) => {
    setMarkdown(e.target.value);
    setLocalUpdate(true);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  const sendContentUpdate = useCallback(
    debounce((content) => {
      if (socket.connected && currentDocument?.collaborative) {
        socket.emit('update-doc', {
          docId: currentDocument._id,
          content,
        });
      }
    }, 200),
    [currentDocument],
  );
  useEffect(() => {
    if (localUpdate && currentDocument?.collaborative) {
      sendContentUpdate(markdown);
      setLocalUpdate(false);
    }
  }, [
    markdown,
    localUpdate,
    sendContentUpdate,
    currentDocument?.collaborative,
  ]);
  useEffect(() => {
    marked.setOptions({ breaks: true, gfm: true });

    return () => {
      setMarkdown('');
      resetDocument();
      if (socket.connected) {
        socket.emit('leave-doc', {
          docId: currentDocument?._id || id,
          user: authUser,
        });
        socket.off('doc-users');
        socket.off('session-terminated');
        socket.off('joined-doc');
        socket.off('left-doc');
      }
    };
  }, []);

  useEffect(() => {
    if (currentDocument?.content) {
      setMarkdown(currentDocument.content);
    }
  }, [currentDocument]);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setMarkdown(currentDocument?.content || '');
        await loadDocument(id);
      } catch (err) {
        setError(true);
        console.error('Error loading document:', err);
      }
    };

    fetchDocument();
    return () => {
      setError(false);
      setMarkdown('');
      setLocalUpdate(false);
      resetDocument();
    };
  }, [id, loadDocument]);

  // Document is loaded for the first time and its authenticated user
  useEffect(() => {
    if (!currentDocument || !authUser) return;

    // Only setup socket connection if document is collaborative
    if (!currentDocument.collaborative) {
      return;
    }
    setMarkdown(currentDocument.content || '');
    // Setup socket connection and listeners
    const setupSocketConnection = () => {
      // Remove any existing listeners to prevent duplicates
      socket.off('doc-users');
      socket.off('session-terminated');
      socket.off('joined-doc');
      socket.off('left-doc');

      // Connect if not already connected
      if (!socket.connected) {
        socket.connect();
      }

      // Join document room
      socket.emit('join-doc', {
        docId: currentDocument._id,
        user: authUser,
      });

      // Setup event listeners
      socket.on('joined-doc', (data) => {
        // Don't show toast for the current user
        if (data.user._id !== authUser._id) {
          toast.success(`${data.user.username} joined the document!`);
        }
      });

      socket.on('left-doc', (data) => {
        toast.success(`${data.user.username} left the document.`);
      });

      socket.on('doc-users', (data) => {
        updateCollabs(data);
      });

      socket.on('session-terminated', () => {
        toast.error(
          'This collaborative session has been terminated by the owner.',
        );
        navigate('/');
        setMarkdown('');
        resetDocument();
      });

      socket.on('doc-updated', (data) => {
        if (data.docId === currentDocument._id && !localUpdate) {
          setMarkdown(data.content);
        }
      });
    };

    setupSocketConnection();

    // Cleanup function
    return () => {
      if (socket.connected) {
        socket.emit('leave-doc', {
          docId: currentDocument._id,
          user: authUser,
        });
      }
    };
  }, [currentDocument?._id, currentDocument?.collaborative, authUser]);

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
        <div className="flex items-center gap-2">
          <button
            className={`btn btn-${
              currentDocument.collaborative
                ? 'error btn-soft'
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

          {/* Collaborator Avatars */}
          {currentDocument.collaborative && (
            <div className="flex -space-x-2 ml-2">
              {currentCollabs &&
                currentCollabs.map((collab, index) => (
                  <div
                    key={index}
                    className="tooltip"
                    data-tip={collab.username}
                  >
                    <div className="avatar placeholder">
                      <div
                        className={`flex justify-center items-center rounded-full w-8 h-8 ring ${
                          authUser && collab._id === authUser._id
                            ? 'bg-primary text-primary-content ring-primary ring-offset-2'
                            : 'bg-neutral text-neutral-content'
                        }`}
                      >
                        <span className="text-xs font-bold flex items-center justify-center h-full">
                          {authUser && collab._id === authUser._id
                            ? 'You'
                            : collab.username.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

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
                value={markdown}
                onChange={handleContentChange}
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
