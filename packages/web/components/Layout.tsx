import { Container, makeStyles } from "@material-ui/core";
import Header from "../components/Header";
import Splash from "./Splash";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

const App: React.FC = ({ children }) => {
  const classes = useStyles();

  // const [roles, setRoles] = React.useState<Role[]>([]);

  // React.useEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   (async () => {
  //     const response = await fetch("/roles.json");

  //     const contentType = response.headers.get("content-type");
  //     if (!contentType?.includes("application/json")) {
  //       alert("Error");
  //       return;
  //     }

  //     const roles = (await response.json()) as Role[];

  //     setRoles(roles);
  //   })();
  // }, []);

  // if (roles.length === 0) {
  //   return <Splash />;
  // }

  return (
    <div className={classes.grow}>
      <Header />
      <main>
        <div className={classes.appBarSpacer} />
        <Container maxWidth={false} className={classes.container}>
          <>{children}</>
        </Container>
      </main>
    </div>
  );
};

export default App;
