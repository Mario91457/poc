let questions = [];
let current = 0;
let score = 0;
let buttonsLocked = false;

fetch('/api/questions')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  buttonsLocked = false;
  const q = questions[current];
  document.getElementById('question').textContent = q.question;
  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';

  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.onclick = () => checkAnswer(choice, btn);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(selected, button) {
  if (buttonsLocked) return;
  buttonsLocked = true;

  const correctAnswer = questions[current].answer;
  const buttons = document.querySelectorAll('#choices button');

  buttons.forEach(btn => {
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    } else if (btn.textContent === selected) {
      btn.classList.add('wrong');
    }
    btn.disabled = true;
  });

  if (selected === correctAnswer) {
    score++;
  }

  setTimeout(() => {
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      showScore();
    }
  }, 1000);
}

function showScore() {
  document.getElementById('question').style.display = 'none';
  document.getElementById('choices').style.display = 'none';
  document.getElementById('score').textContent = `🎉 Your score: ${score}/${questions.length}`;
  document.getElementById('score').style.display = 'block';
  document.getElementById('name-input').style.display = 'block';
}

function submitScore() {
  const name = document.getElementById('player-name').value.trim();
  if (!name) return alert("Please enter your name!");

  fetch('/api/leaderboard', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, score })
  }).then(() => {
    document.getElementById('name-input').style.display = 'none';
    loadLeaderboard();
  });
}

function loadLeaderboard() {
  fetch('/api/leaderboard')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard-list');
      list.innerHTML = '';
      data.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} - ${entry.score}`;
        list.appendChild(li);
      });
      document.getElementById('leaderboard').style.display = 'block';
    });
}
