import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getUserDocuments,
  createDocument,
  deleteDocument,
  updateDocument,
  saveDocumentContent,
} from '../controllers/doc.controller.js';

const router = express.Router();
router.use(protect);
router.get('/', getUserDocuments);
router.post('/', createDocument);
router.delete('/:id', deleteDocument);
router.patch('/:id', updateDocument);
router.post('/save/:id', saveDocumentContent);

export default router;
