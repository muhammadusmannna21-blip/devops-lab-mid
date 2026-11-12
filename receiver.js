const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/report', (req, res) => {
  const report = req.body;
  const filePath = path.join(__dirname, 'test-report.json');

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
  console.log(`\n[${new Date().toLocaleTimeString()}] Report received! Status: ${report.status}`);
  console.log(`Commit: ${report.commit_sha} | Passed: ${report.passed}/${report.total}`);
  console.log(`Saved to: ${filePath}`);

  res.status(200).json({ message: 'Report saved locally as test-report.json' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Local Report Receiver listening on http://localhost:${PORT}/report`);
});