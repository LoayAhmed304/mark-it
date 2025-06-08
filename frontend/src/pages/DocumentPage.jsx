import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentStore } from '../stores/documentStore';
import { LoaderCircle } from 'lucide-react';

const DocumentPage = () => {
  const { id } = useParams();
  const { loadDocument, currentDocument, isLoading } = useDocumentStore();
  const [error, setError] = useState(false);

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

  return <div>{currentDocument.title}</div>;
};

export default DocumentPage;
