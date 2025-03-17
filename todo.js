const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 5000;

// Temporary in-memory storage
let users = [];
let internships = [];
let mentorships = [];
let connections = [];

// Function to generate unique IDs
const generateId = (arr) =>
  arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;

// ✅ Post an Internship (Only Alumni)
app.post("/internships", (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const user = users.find((u) => u.id === userId);

    const newInternship = {
      id: generateId(internships),
      title,
      description,
      postedBy: userId,
    };
    internships.push(newInternship);
    res.status(201).json(newInternship);
  } catch (err) {
    res.status(500).json({ error: "Error posting internship" });
  }
});

// ✅ View Internship Listings
app.get("/internships", (req, res) => {
  try {
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: "Error fetching internships" });
  }
});

// ✅ Request Mentorship (Only Students)
app.post("/mentorship", (req, res) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = users.find((u) => u.id === studentId);

    mentorships.push({
      id: generateId(mentorships),
      studentId,
      mentorId,
      status: "pending",
    });
    res.status(201).json({ message: "Mentorship request sent" });
  } catch (err) {
    res.status(500).json({ error: "Error requesting mentorship" });
  }
});

// ✅ Accept or Reject Mentorship Request (Only Mentor)
app.post("/mentorship/respond", (req, res) => {
  try {
    const { mentorshipId, mentorId, action } = req.body;
    const mentorship = mentorships.find(
      (m) => m.id === mentorshipId && m.mentorId === mentorId
    );
    if (!mentorship)
      return res.status(404).json({ error: "Mentorship request not found" });

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    mentorship.status = action;
    res.json({ message: `Mentorship request ${action}` });
  } catch (err) {
    res.status(500).json({ error: "Error responding to mentorship request" });
  }
});

// ✅ Connect Users (Networking Feature)
app.post("/connect", (req, res) => {
  try {
    const { user1Id, user2Id } = req.body;

    const newConnection = {
      id: generateId(connections),
      user1Id,
      user2Id,
      status: "pending",
    };
    connections.push(newConnection);

    res
      .status(201)
      .json({ message: "Connection request sent", connection: newConnection });
  } catch (err) {
    res.status(500).json({ error: "Error sending connection request" });
  }
});

// ✅ Accept or Reject Connection Request
app.post("/connect/respond", (req, res) => {
  try {
    const { connectionId, userId, action } = req.body;
    const connection = connections.find(
      (c) => c.id === connectionId && c.user2Id === userId
    );
    if (!connection)
      return res.status(404).json({ error: "Connection request not found" });

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    connection.status = action;
    res.json({ message: `Connection request ${action}` });
  } catch (err) {
    res.status(500).json({ error: "Error responding to connection request" });
  }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
