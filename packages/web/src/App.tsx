import { Container, makeStyles } from "@material-ui/core";
import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import { PermissionTable, ServiceTable } from "./Browse";
import Compare from "./Compare";
import Header from "./Header";
import Splash from "./Splash";
import { Role } from "./types";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const ScrollToTop: React.FC = () => {
  const history = useHistory();

  React.useEffect(() => {
    if (history.action === "PUSH") {
      window.scrollTo(0, 0);
    }
  }, [history.location.pathname, history.action]);

  return null;
};

const App: React.FC = () => {
  const classes = useStyles();

  const [roles, setRoles] = React.useState<Role[]>([]);

  React.useEffect(() => {
    (async () => {
      const response = await fetch("/roles.json");

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        alert("Error");
        return;
      }

      const roles: Role[] = await response.json();

      setRoles(roles);
    })();
  }, []);

  if (roles.length === 0) {
    return <Splash />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className={classes.grow}>
        <Header />
        <main>
          <div className={classes.appBarSpacer} />
          <Container maxWidth={false} className={classes.container}>
            <Switch>
              <Route path="/" exact>
                <ServiceTable roles={roles} />
              </Route>
              <Route path="/services" exact>
                <Redirect to="/" />
              </Route>
              <Route path="/services/:service" exact>
                <PermissionTable roles={roles} />
              </Route>
              <Route path="/compare" exact>
                <Compare roles={roles} />
              </Route>
            </Switch>
          </Container>
        </main>
      </div>
    </Router>
  );
};

export default App;
