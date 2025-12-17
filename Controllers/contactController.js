const Contact = require("../Models/contactModel");

// POST → Create Contact Message
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      message: "Contact message sent successfully",
      data: savedContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending contact message",
      error: error.message,
    });
  }
};

// GET → All Contact Messages (for admin)
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Contacts fetched successfully",
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching contacts",
      error: error.message,
    });
  }
};

module.exports = {
  createContact,
  getContacts,
};