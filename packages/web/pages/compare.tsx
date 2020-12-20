import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  Autocomplete,
  AutocompleteInputChangeReason,
  createFilterOptions,
} from "@material-ui/lab";
import _ from "lodash";
import { GetStaticProps } from "next";
import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";
import { roles } from "../lib/roles";
import Role from "../types/Role";
import { useRouter } from "next/router";

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

const useForceUpdate = (): (() => void) => {
  const [, updateDummyState] = React.useState<Record<string, unknown>>();

  return React.useCallback(() => updateDummyState({}), []);
};

const Compare: React.FC<CompareProps> = ({ roles: baseRoles }) => {
  const forceUpdate = useForceUpdate();

  const router = useRouter();
  const leftParam =
    typeof router.query.left === "string" ? router.query.left : undefined;
  const rightParam =
    typeof router.query.right === "string" ? router.query.right : undefined;

  const rolesPlusAll: Role[] = React.useMemo(
    () => [
      {
        name: "ALL PERMISSIONS",
        stage: "",
        includedPermissions: _.chain(baseRoles)
          .flatMap((role) => role.includedPermissions)
          .uniq()
          .sort()
          .value(),
      },
      ...baseRoles,
    ],
    [baseRoles],
  );

  const leftRole = React.useMemo(
    () => findRole(rolesPlusAll, leftParam, "roles/appengine.serviceAdmin"),
    [rolesPlusAll, leftParam],
  );

  const rightRole = React.useMemo(
    () => findRole(rolesPlusAll, rightParam, "roles/appengine.deployer"),
    [rolesPlusAll, rightParam],
  );

  const [leftValue, setLeftValue] = React.useState(leftRole.name);
  const [rightValue, setRightValue] = React.useState(rightRole.name);

  const onLeftInputChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    _event: React.ChangeEvent<{}>,
    value: string,
    _reason: AutocompleteInputChangeReason,
  ): void => {
    setLeftValue(value);

    const newLeftRole = rolesPlusAll.find((role) => role.name === value);
    if (newLeftRole && newLeftRole.name !== leftRole?.name) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push({
        search: buildSearchParams(newLeftRole, rightRole),
      });
    }
  };

  const onRightInputChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    _event: React.ChangeEvent<{}>,
    value: string,
    _reason: AutocompleteInputChangeReason,
  ): void => {
    setRightValue(value);

    const newRightRole = rolesPlusAll.find((role) => role.name === value);
    if (newRightRole && newRightRole.name !== rightRole?.name) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.push({
        search: buildSearchParams(leftRole, newRightRole),
      });
    }
  };

  React.useEffect(() => {
    const handleRouteChange = () => {
      forceUpdate();
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, forceUpdate]);

  const diff = React.useMemo(() => makeDiff(leftRole, rightRole), [
    leftRole,
    rightRole,
  ]);

  return (
    <Layout>
      <Grid container spacing={3}>
        <Head>
          <title>Compare : GCP IAM Explorer</title>
          <meta property="og:title" content="Compare : GCP IAM Explorer" />
        </Head>

        <Grid item xs={6}>
          <Autocomplete
            options={rolesPlusAll}
            getOptionLabel={(role) => role.name}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" fullWidth />
            )}
            value={leftRole}
            inputValue={leftValue}
            onInputChange={onLeftInputChange}
          />
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            options={rolesPlusAll}
            getOptionLabel={(role) => role.name}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" fullWidth />
            )}
            value={rightRole}
            inputValue={rightValue}
            onInputChange={onRightInputChange}
          />
        </Grid>
        {leftRole && rightRole && diff && (
          <CompareResult
            leftRole={leftRole}
            rightRole={rightRole}
            diff={diff}
          />
        )}
      </Grid>
    </Layout>
  );
};

const findRole = (
  roles: Role[],
  name: string | undefined,
  defaultName: string,
): Role => {
  const role =
    (name && roles.find((role) => role.name === name)) ||
    roles.find((role) => role.name === defaultName);

  if (!role) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `role not found: name="${name}" defaultName="${defaultName}`,
    );
  }

  return role;
};

const buildSearchParams = (
  leftRole: Role | undefined,
  rightRole: Role | undefined,
): string => {
  const params = new URLSearchParams();
  params.set("left", leftRole?.name || "");
  params.set("right", rightRole?.name || "");

  return params.toString();
};

const makeDiff = (
  leftRole: Role | undefined,
  rightRole: Role | undefined,
): Diff | undefined => {
  console.log("[START] makeDiff");
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

  console.log("[END] makeDiff");
  return {
    leftOnly,
    rightOnly,
    common,
  };
};

type ResultProps = {
  leftRole: Role;
  rightRole: Role;
  diff: Diff;
};

const CompareResult: React.FC<ResultProps> = React.memo(
  ({ leftRole, rightRole, diff }) => (
    <>
      <Grid item xs={12}>
        <Box component={Paper} p={2}>
          <TableContainer>
            <Table
              size="small"
              aria-label="simple table"
              // reset `width: "100%"` for mobile collapsion
              // `minWidth: "100%"` to keep full width on desktip
              style={{
                tableLayout: "fixed",
                width: "auto",
                minWidth: "100%",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography color="primary" variant="subtitle2">
                      {`${leftRole.name} Only`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="primary" variant="subtitle2">
                      {`${rightRole.name} Only`}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {_.range(
                  0,
                  Math.max(diff.leftOnly.length, diff.rightOnly.length) - 1,
                ).map((index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {diff.leftOnly[index] || (index === 0 ? "- none -" : "")}
                    </TableCell>
                    <TableCell>
                      {diff.rightOnly[index] || (index === 0 ? "- none -" : "")}
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
                  diff.common.map((permission) => (
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
  ),
);

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      roles,
    },
  };
};

export default Compare;
