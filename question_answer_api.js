const express = require('express');
const router = express.Router();
const Question = require('../models/Question'); // Import the Question model

// ✅ Get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ error: "Error fetching questions" });
    }
});

// ✅ Post a new question
router.post('/', async (req, res) => {
    const { student, question } = req.body;

    if (!student || !question) {
        return res.status(400).json({ error: "Valid Name and Question are Required!" });
    }

    try {
        const newQuestion = new Question({ student, question });
        await newQuestion.save();

        if (req.io) {
            req.io.emit("new_question", newQuestion);
        }

        res.status(201).json({ message: "Question posted successfully!", newQuestion });
    } catch (err) {
        res.status(500).json({ error: "Error saving question" });
    }
});

// ✅ Get a single question by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ error: "Question not found!" });
        }

        res.json(question);
    } catch (err) {
        res.status(500).json({ error: "Invalid question ID!" });
    }
});

// ✅ Add an answer to a question
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { alumni, answer } = req.body;

    if (!alumni || !answer) {
        return res.status(400).json({ error: "Valid Alumni name and Answer are required!" });
    }

    try {
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ error: "Question not found!" });
        }

        question.answers.push({ alumni, answer });
        await question.save();

        if (req.io) {
            req.io.emit("new_answer", { questionId: id, alumni, answer });
        }

        res.json({ message: "Answer added successfully!", question });
    } catch (err) {
        res.status(500).json({ error: "Invalid question ID!" });
    }
});

module.exports = router;
