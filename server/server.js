const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let leaderboard = [];

app.post('/submit-score', (req, res) => {
  const { playerName, score } = req.body;
  leaderboard.push({ playerName, score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 100); // Keep top 100 scores
  res.json({ success: true });
});

app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.listen(port, () => {
  console.log(`Leaderboard server listening at http://localhost:${port}`);
});
