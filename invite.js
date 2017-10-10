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
  console.error(`Usage: ${process.argv[1]} <user> [organization: jphacks]`);
  console.error("");
  console.error("Invite user name MUST be specified");
  console.error("GITHUB_TOKEN MUST be set as environment variable");
}

function entrypoint(path = "/") {
  return `https://api.github.com${path}`;
}

function invite(token, invitee, org = "jphacks") {
  const options = {
    method: "PUT",
    uri: entrypoint(`/orgs/${org}/memberships/${invitee}`),
    headers: {
      "Authorization": `token ${token}`,
      "User-Agent": "node.js",
    },
    body: {
      "role": "member",
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (err, resp) => {
      if (!err && resp.statusCode === 200) {
        resolve(resp.body);
      } else {
        reject(resp, err);
      }
    });
  });
}

function main(argv) {
  const [ _node, _script, invitee, org ] = argv;
  const TOKEN = process.env.GITHUB_TOKEN;

  if (invitee === "-h" || invitee === "--help") {
    usage();
    return Promise.resolve(ExitCode.Help);
  }

  if (invitee === undefined) {
    console.error("You must specify the name of user to invite");
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

  return invite(TOKEN, invitee, org).then(resp => {
    console.log("User is been invited");
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
