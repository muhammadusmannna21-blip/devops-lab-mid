const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let submissions = [];

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

app.get('/api/submissions', (req, res) => {
  res.status(200).json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const { name, regNo, title, url } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Student name is required.' });
  }
  if (!regNo || !regNo.trim()) {
    return res.status(400).json({ error: 'Registration number is required.' });
  }
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Assignment title is required.' });
  }
  if (!url || !isValidUrl(url.trim())) {
    return res.status(400).json({ error: 'A valid HTTP/HTTPS submission URL is required.' });
  }

  const newSubmission = {
    id: submissions.length + 1,
    name: name.trim(),
    regNo: regNo.trim(),
    title: title.trim(),
    url: url.trim(),
    submittedAt: new Date().toISOString()
  };

  submissions.push(newSubmission);
  return res.status(201).json({ message: 'Submission saved!', submission: newSubmission });
});

app.resetSubmissions = () => {
  submissions = [];
};

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Portal running on http://localhost:${PORT}`));
}

module.exports = app;