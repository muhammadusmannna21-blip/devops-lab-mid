const { spawnSync } = require('child_process');
const fs = require('fs');

const jestRun = spawnSync('npx', ['jest', '--json', '--outputFile=jest-raw.json'], {
  stdio: 'inherit',
  shell: true
});

const raw = JSON.parse(fs.readFileSync('jest-raw.json', 'utf8'));
const tests = [];

raw.testResults.forEach((suite) => {
  suite.assertionResults.forEach((t) => {
    tests.push({
      name: t.title,
      result: t.status,
      failure_message: t.failureMessages.length > 0 ? t.failureMessages.join('\n') : null
    });
  });
});

const report = {
  repository: process.env.GITHUB_REPOSITORY || 'local/assignment-portal',
  branch: process.env.GITHUB_REF_NAME || 'main',
  commit_sha: process.env.GITHUB_SHA || 'local-commit',
  run_id: process.env.GITHUB_RUN_ID || 'local-run',
  timestamp: new Date().toISOString(),
  tests: tests,
  total: raw.numTotalTests,
  passed: raw.numPassedTests,
  failed: raw.numFailedTests,
  status: raw.numFailedTests === 0 ? 'PASSED' : 'FAILED'
};

fs.writeFileSync('test-report.json', JSON.stringify(report, null, 2));
console.log('Generated test-report.json successfully.');

process.exit(jestRun.status || 0);

