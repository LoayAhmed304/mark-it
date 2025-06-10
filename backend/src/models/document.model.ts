import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborative: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
