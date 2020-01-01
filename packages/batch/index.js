const { promises: fs } = require("fs");

const { google } = require("googleapis");

async function main() {
  const auth = new google.auth.GoogleAuth();
  const authClient = await auth.getClient();

  const result = [];
  const allPermissions = {};

  const {
    data: { roles },
  } = await google.iam("v1").roles.list({ auth: authClient, pageSize: 1000 });

  console.log(`roles.length = ${roles.length}`);
  for (const role of roles) {
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
