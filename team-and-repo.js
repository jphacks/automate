/** 
 * Script to create teams and repos
 *
 * 0. Generate a list of team to create
 * 1. Create a team
 * 2. Create a repository with created team associated
 * 3. Add write permission to the team
 * 4. Loop until all teams and repos are created
 */
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({
  auth: '',//process.env.GITHUB_TOKEN,
  userAgent: 'JPHACKS GitHub Automation',
});
const TARGET_ORG = 'jphacks';
let GENERAL_MAINTAINERS = [
  // Put maintainers' github account here
  // 'Kenshiro1216',
  'ta9yamakawa',
  'shin5ishihara'
];
const TEAM_USER = {
  // 'A_2201':'',
  // 'A_2202':'',
  // 'A_2203':'Al-Mikan',
  // 'A_2204':'kashu-02',
  // 'A_2205':'kuriyan1204',
  // 'A_2206':'',
  // 'A_2207':'Ikumi-Ito',
  // 'A_2208':'',
  // 'A_2209':'USK314',
  // 'A_2212':'',
  // 'A_2210':'yuki-tome',
  // 'A_2211':'shoheiyonekura',

  // 'B_2201':'',
  // 'B_2202':'Ishigami100',
  // 'B_2203':'Mori-San-Tyu',//エラー
  // 'B_2204':'poteto0',
  // 'B_2205':'',
  // 'B_2206':'',
  // 'B_2207':'',
  // 'B_2208':'',
  // 'B_2209':'haruponponpopon',
  // 'B_2210':'kohtaro246',
  // 'B_2211':'http://github.com/csenet',//手動対応
  // 'B_2212':'hasemizu0507',
  // 'B_2213':'',
  // 'B_2214':'HaruguchiKazuto',
  // 'B_2215':'',
  // 'B_2216':'',
  // 'B_2217':'MiyamotoRin',
  // 'B_2218':'Yuma0802',
  // 'B_2219':'kakudo415',
  // 'B_2225':'tsukky67',
  // 'B_2226':'',
  // 'B_2227':'',
  // 'B_2220':'tak999',
  // 'B_2221':'Yu-Muro',
  // 'B_2222':'ranzatu4256',
  // 'B_2223':'a1m7f',
  // 'B_2224':'Nattchi',

  // 'C_2201':'soso1031',
  // 'C_2202':'',
  // 'C_2203':'H0R15H0',
  // 'C_2204':'datesann0109',
  // 'C_2205':'itoka229',
  // 'C_2206':'nac-39',
  // 'C_2207':'',
  // 'C_2208':'',
  // 'C_2209':'',
  // 'C_2210':'mono-1729',
  // 'C_2211':'',
  // 'C_2212':'',
  // 'C_2213':'guchio33',
  // 'C_2214':'reki204',
  // 'C_2215':'',

  // 'D_2201':'',
  // 'D_2202':'moririn2528',
  // 'D_2203':'lion-rion',
  // 'D_2204':'kenboo0426',
  // 'D_2205':'Mont9165',
  // 'D_2206':'rikumiura',
  // 'D_2207':'',
  // 'D_2208':'averak',
  // 'D_2209':'greenlaver',
  // 'D_2210':'',
  // 'D_2211':'',
  // 'D_2215':'harple17',
  // 'D_2212':'george0528',
  // 'D_2213':'arufos',
  // 'D_2214':'MGMCN',
  // 'D_2215':'harple17',

  // 'E_2201':'abokado2525',
  // 'E_2202':'umahara555',
  // 'E_2203':'hundo303',
  // 'E_2204':'kami9811',
  // 'E_2205':'koyo343',
  // 'E_2206':'K-Kizuku',
  // 'E_2207':'',

  // 'F_2201':'kmusicsports',
  // 'F_2202':'',
  // 'F_2203':'',
  // 'F_2204':'lll-lll-lll-lll',
  // 'F_2205':'',
  // 'F_2206':'',
  // 'F_2207':'yuta-ike',
  // 'F_2208':'yuuumiravy',
  // 'F_2209':'takut368',

  // 'Z_2201':'kogure23',

};

const genTeamNames = (prefix, limit = 20, offset = 1, zerofill = true) => {
  let arr = [];
  for (let i = offset; i <= limit; i++) {
    arr.push(i);
  }
  const maxlen = String(limit).length;
  const zeroprefix = (zerofill) ? Array(maxlen).fill('0').join('') : ''
  return arr.map(v => {

    return ('00' + v).slice(-2);
    // if (!zerofill) {
    //   return v;
    // }
    // return `${zeroprefix}${v}`.substr(-1 * maxlen);
  }).map(v => `${prefix}${v}`);
};

(async () => {
  const areas = [
    // {
    //   code: 'A_20',
    //   limit: 25,
    // },
    // {
    //   code: 'B_20',
    //   limit: 25,
    // },
    // {
    //   code: 'C_20',
    //   limit: 25,
    // },
    // {
    //   code: 'D_20',
    //   limit: 25,
    // },
    // {
    //   code: 'E_20',
    //   limit: 25,
    // },
    {
      code: 'D_22',
      limit: 16,
    }
  ];
  const teamNames = areas
    .map((area) => genTeamNames(`${area.code}`, area.limit))
    .flat()

  // return;
  // Because `forEach` does not support async/await style of callback, using for-loop instead
  const limit = teamNames.length;
  for (let i = 0; i < limit; i++) {
    try {
      const teamName = teamNames[i];
      console.log(`${teamName} ----------start`);


      // 後からメンバー追加する場合
      // if(TEAM_USER[teamName]){
      //   console.log(TEAM_USER[teamName]);
      //   const {data:member} = await octokit.teams.addOrUpdateMembershipForUserInOrg({
      //     org: TARGET_ORG,
      //     team_slug:teamName,
      //     username:TEAM_USER[teamName]
      //   });
      // }
      // =====================


      // 通常のステップ以下
      if(teamName == 'D_2215'){
        // console.log(`Creating a team ${teamName} in ${TARGET_ORG}`);
        // https://octokit.github.io/rest.js/#octokit-routes-teams-create
        //リーダーに権限付与
        let update_users = Array.from(GENERAL_MAINTAINERS);
        // let update_users = ['aaa'];
        // if(Object.keys(TEAM_USER).length && TEAM_USER[teamName]){
        //   console.log(TEAM_USER[teamName]);
        //   update_users.push(TEAM_USER[teamName]);
        // }
        console.log(update_users);
        const { data: team } = await octokit.teams.create({
          org: TARGET_ORG,
          name: teamName,
          maintainers: update_users,
          privacy: 'closed',
        });
        // return;


        // console.log(`Creating a repo ${teamName} in ${TARGET_ORG}`);
        // https://octokit.github.io/rest.js/#octokit-routes-repos-create-in-org

        const { data: repo } = await octokit.repos.createInOrg({
          org: TARGET_ORG,
          name: team.name,
          team_id: team.id,
          private: false,
        });
        console.log('Step2');

        // Since default permission is only to 'pull' add 'push' permission to the repository
        // https://octokit.github.io/rest.js/#octokit-routes-teams-add-or-update-repo

        const { headers, data: updatedTeam } = await octokit.teams.addOrUpdateRepoPermissionsInOrg({
          owner: TARGET_ORG,
          org: TARGET_ORG,
          repo: teamName,
          team_slug: teamName,
          permission: 'admin',
        });
        console.log('Step3');

        // readmeなど設定
        const {data:d} = await octokit.migrations.startImport({
          owner: TARGET_ORG,
          repo: teamName,
          vcs_url:'https://github.com/jphacks/JP_sample',
        });
        console.log('Step4');


      }


      console.log(`----------end`);

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

