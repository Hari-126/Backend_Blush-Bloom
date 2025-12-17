const express = require("express");
const { createContact, getContacts } = require("../Controllers/contactController");

const router = express.Router();

// POST → Submit contact form
router.post("/", createContact);

// GET → Get all contacts (for admin)
router.get("/", getContacts);

module.exports = router;