// Mongodb is non-relational db , in sql we store data in table but here we store in json (way to communicate in server and client) so better for more unstructured data
const mongoose = require("mongoose"); // Import mongo to manipulate data

// Format in which data will be stored in db
const questionSchema = new mongoose.Schema({ 
  student: { type: String, required: true },
  question: { type: String, required: true },
  answers: [
    {
      alumni: String,
      answer: String,
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema); // It creates a model named "Question" to store Q/A --- Model is like blueprint for in which data should be stored
module.exports = Question; // So that Question (where Q/A are stored) can be used by all files
