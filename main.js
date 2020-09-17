const { Octokit } = require('@octokit/rest');
const { CmdArchive } = require("./lib/cmd");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'JPHACKS GitHub Automation',
});
const TARGET_ORG = 'jphacks';

CmdArchive(octokit, TARGET_ORG);
