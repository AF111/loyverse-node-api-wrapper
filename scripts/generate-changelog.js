const fs = require('fs');
const conventionalChangelog = require('conventional-changelog');

const header = '# Changelog\n\nAll notable changes to this project are documented here. Entries are generated from Conventional Commits.\n\n';
const checkOnly = process.argv.includes('--check');

const chunks = [];
const stream = conventionalChangelog({
  preset: 'conventionalcommits',
  releaseCount: 0,
});

stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
stream.on('error', (error) => {
  process.stderr.write(`Changelog generation failed: ${error.message}\n`);
  process.exitCode = 1;
});
stream.on('end', () => {
  const generated = Buffer.concat(chunks).toString('utf8');
  if (!generated.trim()) {
    process.stderr.write('Changelog generation produced no entries. Use Conventional Commit messages (feat:, fix:, etc.).\n');
    process.exitCode = 1;
    return;
  }

  if (checkOnly) {
    process.stdout.write('Conventional changelog generation verified.\n');
    return;
  }

  fs.writeFileSync('CHANGELOG.md', header + generated);
  process.stdout.write('CHANGELOG.md generated from git history.\n');
});
