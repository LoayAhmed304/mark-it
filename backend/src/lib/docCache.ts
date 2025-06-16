const docCache = new Map<string, string>();

export function getDocumentContent(docId: string): string {
  return docCache.get(docId) || '';
}

export function setDocumentContent(docId: string, content: string): void {
  docCache.set(docId, content);
}

export function hasDocument(docId: string): boolean {
  return docCache.has(docId);
}

export function initDocument(docId: string, content: string = ''): void {
  if (!hasDocument(docId)) {
    setDocumentContent(docId, content);
  } else {
    console.warn(`Document with id ${docId} already exists.`);
  }
}

export function getAllDocuments(): Map<string, string> {
  return docCache;
}
