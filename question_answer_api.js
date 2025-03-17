const express = require('express');
const router = express.Router();

var questions = [];

router.get('/', (req, res) => {
    res.json(questions);
});

router.post('/', (req, res) => {
    const { student, question } = req.body;
    
    if (!student || !question) {
        return res.status(400).json({ error: "Valid Name and Question are Required!" });
    }

    const newQuestion = {
        id: questions.length + 1,
        student,
        question
    };

    questions.push(newQuestion);

    if (req.io) {
        req.io.emit("new_question", newQuestion);
    }

    res.status(201).json({ message: "Question posted successfully!", newQuestion });
});

router.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { alumni, answer } = req.body;

    if (!alumni || !answer) {
        return res.status(400).json({ error: "Valid Alumni name and Answer are required!" });
    }

    const question = questions.find(q => q.id == id);

    if (!question) {
        return res.status(404).json({ error: "Question not found!" });
    }

    if (!question.answers) {
        question.answers = [];
    }

    question.answers.push({ alumni, answer });

    if (req.io) {
        req.io.emit("new_answer", { questionId: id, alumni, answer });
    }

    res.json({ message: "Answer added successfully!", question });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const question = questions.find(q => q.id == id);

    if (!question) {
        return res.status(404).json({ error: "Question not found!" });
    }

    res.json(question);
});

module.exports = router;

