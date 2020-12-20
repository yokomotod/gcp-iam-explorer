import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { GetStaticProps } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Link from "../components/Link";
import { specialRoleNames } from "../constants";
import { roles, services } from "../lib/roles";
import Role from "../types/Role";

type ServiceTableProps = {
  roles: Role[];
};

const ServiceTable: React.FC<ServiceTableProps> = ({ roles }) => (
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
                    <Link href={`/services/${service}`}>{service}</Link>
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

export const getStaticProps: GetStaticProps<ServiceTableProps> = async () => {
  return {
    props: {
      roles,
    },
  };
};

export default ServiceTable;
