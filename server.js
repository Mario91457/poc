const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Serve quiz questions
app.get('/api/questions', (req, res) => {
  fs.readFile('./data/questions.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading questions.');
    res.json(JSON.parse(data));
  });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  fs.readFile('./data/leaderboard.json', 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading leaderboard.');
    res.json(JSON.parse(data));
  });
});

// Post score
app.post('/api/leaderboard', (req, res) => {
  const newScore = req.body;

  fs.readFile('./data/leaderboard.json', 'utf8', (err, data) => {
    let leaderboard = [];
    if (!err && data) {
      leaderboard = JSON.parse(data);
    }
    leaderboard.push(newScore);

    // Sort and keep top 10
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);

    fs.writeFile('./data/leaderboard.json', JSON.stringify(leaderboard, null, 2), err => {
      if (err) return res.status(500).send('Error saving score.');
      res.status(200).send('Score saved!');
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
