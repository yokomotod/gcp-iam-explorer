import { Container, makeStyles } from "@material-ui/core";
import Header from "../components/Header";

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
