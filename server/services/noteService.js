const Note = require("../models/Notes");
const mongoose = require("mongoose");

class NoteService {
  static async getNotesByUser(userId, perPage, page) {
    return await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }

  static async countNotesByUser(userId) {
    return await Note.countDocuments({ user: userId });
  }

  static async getNoteById(noteId, userId) {
    return await Note.findById(noteId).where({ user: userId }).lean();
  }

  static async updateNote(noteId, userId, updateData) {
    return await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      { ...updateData, updatedAt: Date.now() }
    );
  }

  static async deleteNote(noteId, userId) {
    return await Note.deleteOne({ _id: noteId, user: userId });
  }

  static async createNote(noteData) {
    return await Note.create(noteData);
  }

  static async searchNotes(userId, searchTerm) {
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
    return await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: userId });
  }
}

module.exports = NoteService;
