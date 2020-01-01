import {
  Box,
  TextField,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Grid,
  Typography,
} from "@material-ui/core";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import React from "react";
import { Role } from "./types";
import _ from "lodash";

type Diff = {
  leftOnly: string[];
  rightOnly: string[];
  common: string[];
};

const filterOptions = createFilterOptions({
  stringify: (role: Role) => role.name,
});

type CompareProps = {
  roles: Role[];
};

const Compare: React.FC<CompareProps> = ({ roles }) => {
  const rolesPlusAll: Role[] = [
    {
      name: "ALL PERMISSIONS",
      stage: "",
      includedPermissions: _.chain(roles)
        .flatMap(role => role.includedPermissions)
        .uniq()
        .sort()
        .value(),
    },
    ...roles,
  ];

  const defaultLeftRole = roles.find(
    role => role.name === "roles/appengine.serviceAdmin",
  );
  const defaultRightRole = roles.find(
    role => role.name === "roles/appengine.deployer",
  );

  const [leftRole, setLeftRole] = React.useState<Role | undefined>(
    defaultLeftRole,
  );
  const [rightRole, setRightRole] = React.useState<Role | undefined>(
    defaultRightRole,
  );
  const [diff, setDiff] = React.useState<Diff | undefined>(undefined);

  React.useEffect(() => {
    setDiff(makeDiff(leftRole, rightRole));
  }, [leftRole, rightRole]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Autocomplete
          options={rolesPlusAll}
          getOptionLabel={role => role.name}
          filterOptions={filterOptions}
          defaultValue={defaultLeftRole}
          renderInput={params => (
            <TextField {...params} variant="outlined" fullWidth />
          )}
          onInputChange={(_event, value, _reason) =>
            setLeftRole(rolesPlusAll.find(role => role.name === value))
          }
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          options={rolesPlusAll}
          getOptionLabel={role => role.name}
          filterOptions={filterOptions}
          defaultValue={defaultRightRole}
          renderInput={params => (
            <TextField {...params} variant="outlined" fullWidth />
          )}
          onInputChange={(_event, value, _reason) =>
            setRightRole(rolesPlusAll.find(role => role.name === value))
          }
        />
      </Grid>
      {leftRole && rightRole && diff && (
        <>
          <Grid item xs={12}>
            <Box component={Paper} p={2}>
              <TableContainer>
                <Table
                  size="small"
                  aria-label="simple table"
                  style={{ tableLayout: "fixed" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography color="primary" variant="subtitle2">
                          {leftRole.name} Only
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography color="primary" variant="subtitle2">
                          {rightRole.name} Only
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {_.range(
                      0,
                      Math.max(diff.leftOnly.length, diff.rightOnly.length) - 1,
                    ).map(index => (
                      <TableRow key={index}>
                        <TableCell>
                          {diff.leftOnly[index] ||
                            (index === 0 ? "- none -" : "")}
                        </TableCell>
                        <TableCell>
                          {diff.rightOnly[index] ||
                            (index === 0 ? "- none -" : "")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box component={Paper} p={2}>
              <TableContainer>
                <Table size="small" aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography color="primary" variant="subtitle2">
                          Both {leftRole.name} {"&"} {rightRole.name}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {diff.common.length > 0 ? (
                      diff.common.map(permission => (
                        <TableRow key={permission}>
                          <TableCell>{permission}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>- none -</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </>
      )}
    </Grid>
  );
};

const makeDiff = (leftRole: Role | undefined, rightRole: Role | undefined) => {
  if (leftRole === undefined || rightRole === undefined) {
    return;
  }

  const leftOnly = [...leftRole.includedPermissions];
  const rightOnly = [];
  const common = [];

  for (const permission of rightRole.includedPermissions) {
    const leftIndex = leftOnly.indexOf(permission);
    if (leftIndex >= 0) {
      common.push(permission);
      leftOnly.splice(leftIndex, 1);
    } else {
      rightOnly.push(permission);
    }
  }

  return {
    leftOnly,
    rightOnly,
    common,
  };
};

export default Compare;
