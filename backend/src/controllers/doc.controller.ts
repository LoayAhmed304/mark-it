import { ObjectId } from 'mongodb';
import Document from '../models/document.model.js';
import { Request, Response } from 'express';

export const getUserDocuments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    const documents = await Document.find({ authorId: user._id });

    res.status(200).json({
      status: 'success',
      length: documents.length,
      data: {
        documents,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const createDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title } = req.body;
    if (!title.trim()) {
      res.status(400).json({ status: 'fail', message: 'Title is required' });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    // check if a document with the same title already exists
    const existingDocument = await Document.findOne({
      title: title.trim(),
      authorId: user._id,
    });
    if (existingDocument) {
      res.status(400).json({
        status: 'fail',
        message: 'Document with this title already exists',
      });
      return;
    }

    const newDocument = new Document({
      title: title.trim(),
      authorId: user._id,
      content: '',
      collaborative: false,
    });

    const savedDocument = await newDocument.save();
    res.status(201).json({
      status: 'success',
      data: {
        document: savedDocument,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const deleteDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: docId } = req.params;
    const doc_id = ObjectId.isValid(docId) ? docId : null;
    if (!doc_id) {
      res.status(400).json({ status: 'fail', message: 'Invalid document ID' });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    const document = await Document.findOneAndDelete({
      _id: doc_id,
      authorId: user._id,
    });

    if (!document) {
      res.status(404).json({
        status: 'fail',
        message:
          'Document not found or you do not have permission to delete it',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const updateDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: docId } = req.params;
    const { title, collaborative } = req.body;

    const doc_id = ObjectId.isValid(docId) ? docId : null;
    if (!doc_id) {
      res.status(400).json({ status: 'fail', message: 'Invalid document ID' });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    console.log('doc_id:', doc_id);
    console.log('user._id:', user._id);
    const updatedDocument = await Document.findOneAndUpdate(
      { _id: doc_id, authorId: user._id },
      { title, collaborative },
      { new: true },
    );
    if (!updatedDocument) {
      res.status(404).json({
        status: 'fail',
        message:
          'Document not found or you do not have permission to update it',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedDocument,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const saveDocumentContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id: docId } = req.params;
    const { content } = req.body;

    const doc_id = ObjectId.isValid(docId) ? docId : null;
    if (!doc_id) {
      res.status(400).json({ status: 'fail', message: 'Invalid document ID' });
      return;
    }

    const user = req.user;
    if (!user) {
      res.status(401).json({ status: 'fail', message: 'Unauthorized' });
      return;
    }

    const existingDocument = await Document.findOne({
      _id: doc_id,
      authorId: user._id,
    });

    if (!existingDocument) {
      res.status(404).json({
        status: 'fail',
        message:
          'Document not found or you do not have permission to update it',
      });
      return;
    }

    existingDocument.content = content;
    const updatedDocument = await existingDocument.save();

    res.status(200).json({
      status: 'success',
      data: {
        document: updatedDocument,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};

export const getDocument = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id: docId } = req.params;
  const doc_id = ObjectId.isValid(docId) ? docId : null;
  try {
    const document = await Document.findById(doc_id);
    if (!document) {
      res.status(404).json({
        status: 'fail',
        message: 'Document not found',
      });
      return;
    }
    const user = req.user;

    if (document.authorId.toString() != user._id.toString()) {
      if (document.collaborative === false) {
        res.status(403).json({
          status: 'fail',
          message: 'You do not have permission to access this document',
        });
        return;
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  } catch (err) {
    console.error('ERROR:', err);
    res.status(500).json({ status: 'fail', message: 'Server error' });
  }
};
