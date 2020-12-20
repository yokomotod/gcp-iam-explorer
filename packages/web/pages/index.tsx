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
import { Link as RouterLink } from "react-router-dom";
import { Role } from "./types";

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
    <Box component={Paper} p={2}>
      <Helmet>
        <title>GCP IAM Explorer</title>
        <meta property="og:title" content="GCP IAM Explorer" />
      </Helmet>
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
                    <Link component={RouterLink} to={`/services/${service}`}>
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
  );
};

export default ServiceTable;
