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

type ServiceTableProps = {
  services: string[];
  relatedRoleNames: Record<string, string[]>;
};

const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  relatedRoleNames,
}) => (
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
            {services.map((service) => (
              <TableRow key={service}>
                <TableCell>
                  <Link href={`/services/${service}`}>{service}</Link>
                </TableCell>
                <TableCell>{relatedRoleNames[service].length}</TableCell>
                <TableCell>{relatedRoleNames[service].join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Layout>
);

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps<ServiceTableProps> = async () => {
  const relatedRoleNames: Record<string, string[]> = {};

  for (const service of services) {
    const names =
      service === "project"
        ? specialRoleNames.map((roleName) => roleName.replace("roles/", ""))
        : roles
            .filter((role) => role.name.startsWith(`roles/${service}.`))
            .map((role) => role.name.replace(`roles/${service}.`, ""));

    relatedRoleNames[service] = names;
  }

  return {
    props: {
      services,
      relatedRoleNames,
    },
  };
};

export default ServiceTable;
