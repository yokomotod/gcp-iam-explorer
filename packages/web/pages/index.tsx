import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import _ from "lodash";
import Head from "next/head";
import { default as NextLink } from "next/link";
import Layout from "../components/Layout";
import { specialRoleNames } from "../constants";
import Role from "../types/Role";

type ServiceTableProps = {
  roles: Role[];
};

const ServiceTable: React.FC<ServiceTableProps> = ({ roles }) => {
  const servicesExceptProject = _.chain(roles)
    .filter((role) => !specialRoleNames.includes(role.name))
    .map((role) => role.name.split("/")[1].split(".")[0])
    .uniq()
    .value();

  const services = ["project", ...servicesExceptProject].sort();

  return (
    <Layout>
      <Box component={Paper} p={2}>
        <Head>
          <title>GCP IAM Explorer</title>
          <meta property="og:title" content="GCP IAM Explorer" />
        </Head>
        <TableContainer>
          <Table size="small" aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Count</TableCell>
                <TableCell>Roles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => {
                const relatedRoleNames =
                  service === "project"
                    ? specialRoleNames.map((roleName) =>
                        roleName.replace("roles/", ""),
                      )
                    : roles
                        .filter((role) =>
                          role.name.startsWith(`roles/${service}.`),
                        )
                        .map((role) =>
                          role.name.replace(`roles/${service}.`, ""),
                        );

                return (
                  <TableRow key={service}>
                    <TableCell>
                      <Link component={NextLink} href={`/services/${service}`}>
                        {service}
                      </Link>
                    </TableCell>
                    <TableCell>{relatedRoleNames.length}</TableCell>
                    <TableCell>{relatedRoleNames.join(", ")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default ServiceTable;
