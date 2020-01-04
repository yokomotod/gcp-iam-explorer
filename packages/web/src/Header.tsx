import {
  AppBar,
  Drawer,
  IconButton,
  Link,
  Toolbar,
  makeStyles,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ReactComponent as GithubLogo } from "./github.svg";
import { ReactComponent as TwitterLogo } from "./twitter.svg";

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.modal + 1,
  },
  logo: {
    display: "block",
    height: 24,
    fill: "currentColor",
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerList: {
    width: 160,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const Header: React.FC = () => {
  const classes = useStyles();

  const [drawerShown, setDrawerShown] = React.useState(false);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setDrawerShown(open);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.sectionMobile}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </div>
          <Link component={RouterLink} to="/" color="inherit" variant="h6">
            GCP IAM Explorer
          </Link>
          <div className={classes.sectionDesktop}>
            <Box ml={3}>
              <Link
                component={RouterLink}
                to="/"
                color="inherit"
                variant="body1"
              >
                Browse
              </Link>
            </Box>
            <Box ml={3}>
              <Link
                component={RouterLink}
                to="/compare"
                color="inherit"
                variant="body1"
              >
                Compare
              </Link>
            </Box>
          </div>
          <div className={classes.grow} />
          <Box>
            <Link
              href="https://twitter.com/yokomotod"
              target="_blank"
              color="inherit"
            >
              <TwitterLogo className={classes.logo} />
            </Link>
          </Box>
          <Box ml={2}>
            <Link
              href="https://github.com/yokomotod/gcp-iam-explorer"
              target="_blank"
              color="inherit"
            >
              <GithubLogo className={classes.logo} />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerShown} onClose={toggleDrawer(false)}>
        <div
          className={classes.drawerList}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <div className={classes.appBarSpacer} />
          <List>
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              variant="body1"
              underline="none"
            >
              <ListItem button>
                <ListItemText primary={"Browse"} />
              </ListItem>
            </Link>
            <Link
              component={RouterLink}
              to="/compare"
              color="inherit"
              variant="body1"
              underline="none"
            >
              <ListItem button>
                <ListItemText primary={"Compare"} />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default Header;
