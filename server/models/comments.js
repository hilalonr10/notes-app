const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  noteId: {
    type: Schema.ObjectId,
    ref: 'Note', // Not ile ilişkilendirme
    required: true
  },
  userId: {
    type: Schema.ObjectId,
    ref: 'User', // Kullanıcı ile ilişkilendirme
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
