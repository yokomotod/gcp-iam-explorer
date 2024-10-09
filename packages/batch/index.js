const { promises: fs } = require("fs");

const { google } = require("googleapis");

async function main() {
  const auth = new google.auth.GoogleAuth();
  const authClient = await auth.getClient();

  const result = [];
  const allPermissions = {};

  const allRoles = [];
  let pageToken;
  for (let i = 0; ; i++) {
    console.log(`roles.list: page=${i}`);
    const {
      data: { roles, nextPageToken },
    } = await google.iam("v1").roles.list({ auth: authClient, pageSize: 1000, pageToken });
    console.log(`roles.length = ${roles.length}`);

    allRoles.push(...roles);

    if (!nextPageToken) {
      break;
    }

    pageToken = nextPageToken;

    if (i > 10) {
      throw new Error("Too many pages");
    }
  }

  console.log(`allRoles.length = ${allRoles.length}`);
  for (const role of allRoles) {
    console.log(role.name);

    const {
      data: { name, stage, includedPermissions },
    } = await google.iam("v1").roles.get({ name: role.name, auth: authClient });

    const permissions = includedPermissions || [];

    for (const permissioin of permissions) {
      allPermissions[permissioin] = 1;
    }

    result.push({
      name,
      stage,
      includedPermissions: permissions,
    });
  }

  await fs.writeFile("roles.json", JSON.stringify(result, null, 2));
}

main().catch(console.error);
