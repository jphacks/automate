"use strict";

const ExitCode = {
  Ok: 0,
  Error: 1,
  Help: 255,
};

function usage() {
  console.error(`Usage: ${process.argv[1]} [prefix: JP_] [limit: 15] [offset: 1] [zerofill: true]`);
  console.error("Number in `limit` will be *INCLUDED*");
  console.error("To set zerofill as false, set 'false'");
}

function prefixloop(prefix, limit = 15, offset = 1, zerofill = true) {
  let arr = [];
  for (let i = offset; i <= limit; i++) {
    arr.push(i);
  }
  const maxlen = String(limit).length;
  arr.map(v => {
    if (!zerofill) {
      return v;
    }
    return `${Array(maxlen).fill('0').join('')}${v}`.substr(-1 * maxlen);
  }).forEach(v => console.log(`${prefix}${v}`));
}

function main(argv) {
  let [ _node, _script, prefix, limit, offset, zerofill ] = argv;

  if (prefix === "-h" || prefix === "--help") {
    usage();
    return ExitCode.Help;
  }

  prefix = prefix === undefined ? "JP_" : prefix;
  limit = limit === undefined ? 15 : parseInt(limit, 10);
  offset = offset === undefined ? 1 : parseInt(offset, 10);
  zerofill = zerofill === "false" ? false : true;

  if (isNaN(limit) || isNaN(offset)) {
    console.error("limit and offset MUST be numeric value");
    console.error("");
    usage();
    return ExitCode.Error;
  }

  if (offset > limit) {
    console.error("offset is bigger than limit");
    console.error("");
    usage();
    return ExitCode.Error;
  }

  prefixloop(prefix, limit, offset, zerofill);
  return ExitCode.Ok;
}

process.exit(main(process.argv));
