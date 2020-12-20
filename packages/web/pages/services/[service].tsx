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
import { useParams } from "react-router-dom";
import { Role } from "./types";

const useStyles = makeStyles((theme) => ({
  table: {
    width: "auto",
  },
  verticalText: {
    writingMode: "vertical-lr",
  },
}));

type RoleTableProps = {
  roles: Role[];
};

export const PermissionTable: React.FC<RoleTableProps> = ({ roles }) => {
  const classes = useStyles();

  const { service } = useParams<{ service: string }>();

  const filteredRoles = (service === "project"
    ? roles.filter((role) => specialRoleNames.includes(role.name))
    : roles.filter((role) => role.name.startsWith(`roles/${service}.`))
  ).sort((a, b) => b.includedPermissions.length - a.includedPermissions.length);

  const relatedPermissons = _.chain(filteredRoles)
    .flatMap((role) => role.includedPermissions)
    .uniq()
    .sort()
    .value();

  if (filteredRoles.length === 0) {
    return <NotFound />;
  }

  return (
    <Box component={Paper} p={2}>
      <Helmet>
        <title>{service} : GCP IAM Explorer</title>
        <meta property="og:title" content={`${service} : GCP IAM Explorer`} />
      </Helmet>
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="simple table">
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
  );
};
