const { parseISO, differenceInDays } = require('date-fns')

const sleep = (sec = 1) => new Promise((resolve) => {
  setTimeout(() => resolve(), sec * 1000);
});

const listRepos = (octokit, org) => {
  return octokit.paginate("GET /orgs/:org/repos", {
    org,
    sort: "updated",
    direction: "asc",
    per_page: 100,
  });
};

const CmdArchive = async (octokit, org, inactiveDays = 200) => {
  const TEAM_REPO_REGEXP = /^[A-Z][A-Z]_\d+/;
  console.log("Listing repositories");
  const repos = (await listRepos(octokit, org)).filter((repo) => !repo.archived);
  console.log(`Found ${repos.length} repositories`);
  const inactives = repos.filter((repo) => {
    if (!TEAM_REPO_REGEXP.test(repo.name)) {
      return false;
    }
    const diff = differenceInDays(Date.now(), parseISO(repo.updated_at));
    return diff > inactiveDays;
  });
  console.log(`Marked ${inactives.length}/${repos.length} repositories as inactive`);
  console.log("Start archive...");
  const doArchives = inactives.map((repo) => sleep(1)
    .then(() => octokit.repos.update({
      owner: repo.owner.login,
      repo: repo.name,
      archived: true,
    })).catch((reason) => {
      if (reason.status === 451) {
        console.error({ reason: reason.message, block: reason.block });
        return;
      }
      throw reason;
    }));
  await Promise.all(doArchives).catch((reason) => {
    console.log("Reason", { reason });
    process.exit(1);
  });
  console.log("Archive completed");
};

module.exports = {
  CmdArchive,
};
