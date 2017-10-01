"use strict";

// Libraries
const request = require("request");

// Constant
const ExitCode = {
  Ok: 0,
  Error: 1,
  Help: 255,
};

function usage() {
  console.error(`Usage: ${process.argv[1]} <repository> [organization: jphacks]`);
  console.error("");
  console.error("Repository name MUST be specified");
  console.error("GITHUB_TOKEN MUST be set as environment variable");
}

function entrypoint(path = "/") {
  return `https://api.github.com${path}`;
}

function mkrepo(token, repo, org = "jphacks") {
  const options = {
    method: "POST",
    uri: entrypoint(`/orgs/${org}/repos`),
    headers: {
      "Authorization": `token ${token}`,
      "User-Agent": "node.js",
    },
    body: {
      "name": repo,
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, resp) => {
      if (!err && resp.statusCode === 201) {
        resolve(resp.body);
      } else {
        reject(resp, err);
      }
    });
  });
}

function main(argv) {
  const [ _node, _script, repo, org ] = argv;
  const TOKEN = process.env.GITHUB_TOKEN;

  if (repo === "-h" || repo === "--help") {
    usage();
    return Promise.resolve(ExitCode.Help);
  }

  if (repo === undefined) {
    console.error("You must specify the name of repository to create");
    console.error("");
    usage();
    return Promise.resolve(ExitCode.Error);
  }
  if (TOKEN === undefined) {
    console.error("You must set `GITHUB_TOKEN` as your environment variable");
    console.error("");
    usage();
    return Promise.resolve(ExitCode.Error);
  }

  return mkrepo(TOKEN, repo, org).then(resp => {
    console.log("Repository is been created");
    console.log(resp.html_url);
    return ExitCode.Ok;
  }).catch((resp, err) => {
    console.error("Something wrong happend");
    console.error(resp.body || resp);
    if (err) {
      console.error("Error:", err.stack || err);
    }
    return ExitCode.Error;
  });
}

main(process.argv).then(v => process.exit(v));
