const { spawnSync } = require('child_process');

const result = spawnSync(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['--no-install', 'conventional-changelog', '-p', 'conventionalcommits', '-r', '0'],
  { encoding: 'utf8' },
);

if (result.status !== 0) {
  process.stderr.write(result.stderr || 'Unable to generate the changelog from git history.\n');
  process.exit(result.status || 1);
}

if (!/^##?\s+\[?\d|^###\s+(Features|Bug Fixes|Performance Improvements)/m.test(result.stdout)) {
  process.stderr.write('Changelog generation returned no release sections. Check Conventional Commit messages and tags.\n');
  process.exit(1);
}

process.stdout.write('Conventional changelog generation verified.\n');
