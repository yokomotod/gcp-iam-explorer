import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import { specialRoleNames } from "../../constants";
import { roles, services } from "../../lib/roles";
import Role from "../../types/Role";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "auto",
  },
  verticalText: {
    writingMode: "vertical-lr",
  },
}));

type RoleTableProps = {
  service: string;
  roles: Role[];
};

const PermissionTable: React.FC<RoleTableProps> = ({ service, roles }) => {
  const classes = useStyles();

  const filteredRoles = (service === "project"
    ? roles.filter((role) => specialRoleNames.includes(role.name))
    : roles.filter((role) => role.name.startsWith(`roles/${service}.`))
  ).sort((a, b) => b.includedPermissions.length - a.includedPermissions.length);

  const relatedPermissons = _.chain(filteredRoles)
    .flatMap((role) => role.includedPermissions)
    .uniq()
    .sort()
    .value();

  // if (filteredRoles.length === 0) {
  //   return <NotFound />;
  // }

  return (
    <Layout>
      <Box component={Paper} p={2}>
        <Head>
          <title>{service} : GCP IAM Explorer</title>
          <meta property="og:title" content={`${service} : GCP IAM Explorer`} />
        </Head>
        <TableContainer>
          <Table
            className={classes.table}
            size="small"
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Permission</TableCell>
                {filteredRoles.map((role) => (
                  <TableCell key={role.name}>
                    <span className={classes.verticalText}>
                      {role.name.replace(`roles/${service}.`, "")}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {relatedPermissons.map((permission) => (
                <TableRow key={permission}>
                  <TableCell>{permission}</TableCell>
                  {filteredRoles.map((role) => (
                    <TableCell key={role.name}>
                      {role.includedPermissions.includes(permission) ? "✔" : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: services.map((service) => ({ params: { service } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      service: params.service,
      roles,
    },
  };
};

export default PermissionTable;
