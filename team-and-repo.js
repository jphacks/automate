/** 
 * Script to create teams and repos
 *
 * 0. Generate a list of team to create
 * 1. Create a team
 * 2. Create a repository with created team associated
 * 3. Add write permission to the team
 * 4. Loop until all teams and repos are created
 */
const Octokit = require('@octokit/rest');
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  userAgent: 'JPHACKS GitHub Automation',
});
const TARGET_ORG = 'jphacks';
const GENERAL_MAINTAINERS = [
  // Put maintainers' github account here
];

const genTeamNames = (prefix, limit = 15, offset = 1, zerofill = true) => {
  let arr = [];
  for (let i = offset; i <= limit; i++) {
    arr.push(i);
  }
  const maxlen = String(limit).length;
  const zeroprefix = (zerofill) ? Array(maxlen).fill('0').join('') : ''

  return arr.map(v => {
    if (!zerofill) {
      return v;
    }
    return `${zeroprefix}${v}`.substr(-1 * maxlen);
  }).map(v => `${prefix}${v}`);
};

(async () => {
  const areas = [
    {
      code: 'SP_19',
      limit: 15,
    },
    {
      code: 'SD_19',
      limit: 15,
    },
    {
      code: 'TK_19',
      limit: 15,
    },
    {
      code: 'NG_19',
      limit: 15,
    },
    {
      code: 'KB_19',
      limit: 15,
    },
    {
      code: 'FK_19',
      limit: 15,
    },
    {
      code: 'OK_19',
      limit: 15,
    },
  ];
  const teamNames = areas
    .map((area) => genTeamNames(`${area.code}`, area.limit))
    .flat()

  // Because `forEach` does not support async/await style of callback, using for-loop instead
  const limit = teamNames.length;
  for (let i = 0; i < limit; i++) {
    try {
      const teamName = teamNames[i];
      // console.log(`Creating a team ${teamName} in ${TARGET_ORG}`);
      // https://octokit.github.io/rest.js/#octokit-routes-teams-create
      const { data: team } = await octokit.teams.create({
        org: TARGET_ORG,
        name: teamName,
        maintainers: GENERAL_MAINTAINERS,
        privacy: 'closed',
      });

      // console.log(`Creating a repo ${teamName} in ${TARGET_ORG}`);
      // https://octokit.github.io/rest.js/#octokit-routes-repos-create-in-org
      const { data: repo } = await octokit.repos.createInOrg({
        org: TARGET_ORG,
        name: team.name,
        team_id: team.id,
        private: false, // MAYBE true?
      });

      // Since default permission is only to 'pull' add 'push' permission to the repository
      // https://octokit.github.io/rest.js/#octokit-routes-teams-add-or-update-repo
      const { headers, data: updatedTeam } = await octokit.teams.addOrUpdateRepo({
        owner: TARGET_ORG,
        repo: teamName,
        team_id: team.id,
        permission: 'push',
      });

      // Add admin priviledge to organizers
      // await octokit.teams.addOrUpdateRepo({
      //   owner: TARGET_ORG,
      //   repo: teamName,
      //   team_id: ,
      //   permission: 'admin',
      // });
      console.log(`Repository for ${teamName} have successfully created: ${repo.html_url}`);
      console.log(`Rate limit remains: ${headers['x-ratelimit-remaining']}/${headers['x-ratelimit-limit']}`);

    } catch (err) {
      const { status, headers } = err;
      console.log(`Got status code: ${status}`);
      console.error(err.stack);
      console.log(`Rate limit remains: ${headers['x-ratelimit-remaining']}/${headers['x-ratelimit-limit']}`);
    }
  }

  // try {
  //   // I want to archive old repositories which are not maintained any more
  //   // Security alerts are bit annoing :P
  //   const { data } = await octokit.search.repos({
  //     q: 'org:jphacks+_18+in:name'
  //   })
  //   // Make archive request
  //   // console.log(data);
  // } catch (err) {
  //   console.error(err.stack);
  // }
})();

