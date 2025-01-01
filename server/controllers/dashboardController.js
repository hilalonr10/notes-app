const NoteService = require("../services/noteService");

/**
 * GET /
 * Dashboard
 */
exports.dashboard = async (req, res) => {
  const perPage = 12; // Notes per page
  const page = req.query.page || 1; // Current page

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    const notes = await NoteService.getNotesByUser(req.user.id, perPage, page);
    const count = await NoteService.countNotesByUser(req.user.id);

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  try {
    const note = await NoteService.getNoteById(req.params.id, req.user.id);

    if (note) {
      res.render("dashboard/view-note", {
        noteID: req.params.id,
        note,
        layout: "../views/layouts/dashboard",
      });
    } else {
      res.send("Note not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await NoteService.updateNote(req.params.id, req.user.id, req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await NoteService.deleteNote(req.params.id, req.user.id);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id; // Attach user ID to the note
    await NoteService.createNote(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    const searchResults = await NoteService.searchNotes(
      req.user.id,
      req.body.searchTerm
    );

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
